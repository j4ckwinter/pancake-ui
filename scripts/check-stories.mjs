import { readdirSync, readFileSync } from "node:fs";
import { resolve, relative, basename } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { rendersComponent } from "./story-render.mjs";
import { publicComponents } from "./check-comparison.mjs";

function storyFiles(directory) {
  try {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory()
        ? storyFiles(path)
        : entry.name.endsWith(".stories.tsx")
          ? [path]
          : [];
    });
  } catch {
    return [];
  }
}

export function checkStories({
  indexPath = "src/index.ts",
  directory = "src/stories/catalogue",
} = {}) {
  const indexFile = resolve(indexPath);
  const files = storyFiles(directory);
  const program = ts.createProgram([indexFile, ...files], {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.Preserve,
    skipLibCheck: true,
    noEmit: true,
    types: [],
  });
  const checker = program.getTypeChecker();
  const entry = program.getSourceFile(indexFile);
  const module = entry && checker.getSymbolAtLocation(entry);
  if (!module)
    return {
      stories: [],
      errors: ["Story coverage requires a public package entry point."],
    };
  const components = publicComponents(checker, module);
  const errors = [];
  const stories = [];
  if (!components.length)
    errors.push("No public component exports were found.");
  const unalias = (symbol) =>
    symbol?.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(symbol)
      : symbol;
  const unwrap = (node) => {
    while (
      node &&
      (ts.isSatisfiesExpression(node) ||
        ts.isAsExpression(node) ||
        ts.isParenthesizedExpression(node))
    )
      node = node.expression;
    return node;
  };
  for (const { name, symbol } of components) {
    const matches = files.filter(
      (path) => basename(path) === `${name}.stories.tsx`,
    );
    if (matches.length !== 1) {
      errors.push(
        `${name}: require exactly one dedicated ${name}.stories.tsx under ${directory}.`,
      );
      continue;
    }
    const path = matches[0];
    const file = program.getSourceFile(path);
    const fail = (message) => errors.push(`${name}: ${message}`);
    const locals = new Map();
    const exports = new Map();
    for (const statement of file.statements) {
      if (!ts.isVariableStatement(statement)) continue;
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) continue;
        locals.set(declaration.name.text, declaration.initializer);
        if (
          statement.modifiers?.some(
            (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
          )
        )
          exports.set(declaration.name.text, declaration.initializer);
      }
    }
    const object = (node, seen = new Set()) => {
      node = unwrap(node);
      if (node && ts.isIdentifier(node) && !seen.has(node.text)) {
        seen.add(node.text);
        return object(locals.get(node.text), seen);
      }
      return node && ts.isObjectLiteralExpression(node) ? node : undefined;
    };
    const property = (node, key) => {
      const found = node?.properties.find(
        (item) =>
          (ts.isPropertyAssignment(item) ||
            ts.isMethodDeclaration(item) ||
            ts.isShorthandPropertyAssignment(item)) &&
          item.name.getText(file).replace(/["']/g, "") === key,
      );
      return (
        found &&
        (ts.isMethodDeclaration(found)
          ? found
          : ts.isShorthandPropertyAssignment(found)
            ? found.name
            : unwrap(found.initializer))
      );
    };
    const assignment = file.statements.find(
      (node) => ts.isExportAssignment(node) && !node.isExportEquals,
    );
    const meta = object(assignment?.expression);
    if (
      !meta ||
      meta.properties.some(
        (member) =>
          ts.isSpreadAssignment(member) ||
          ts.isGetAccessorDeclaration(member) ||
          ts.isSetAccessorDeclaration(member) ||
          (member.name && ts.isComputedPropertyName(member.name)),
      )
    ) {
      fail(
        "use an explicit default CSF metadata object (no metadata spreads, accessors or computed keys).",
      );
      continue;
    }
    const component = property(meta, "component");
    const imported = component && checker.getSymbolAtLocation(component);
    const directImport = imported?.declarations?.some((declaration) => {
      const importDeclaration = declaration.parent?.parent?.parent;
      return (
        ts.isImportSpecifier(declaration) &&
        !declaration.isTypeOnly &&
        ts.isImportDeclaration(importDeclaration) &&
        !importDeclaration.importClause?.isTypeOnly &&
        checker.getSymbolAtLocation(importDeclaration.moduleSpecifier) ===
          module
      );
    });
    if (!directImport || unalias(imported) !== symbol)
      fail(
        "metadata component must be the matching named import from the public entry point.",
      );
    const title = property(meta, "title");
    if (
      !title ||
      !ts.isStringLiteral(title) ||
      title.text.split("/").at(-1) !== name
    )
      fail(`metadata title must end with /${name} (or be ${name}).`);
    const tags = property(meta, "tags");
    if (
      !tags ||
      !ts.isArrayLiteralExpression(tags) ||
      !tags.elements.some(
        (tag) => ts.isStringLiteral(tag) && tag.text === "autodocs",
      )
    )
      fail("metadata must enable autodocs.");
    if (!exports.has("Default") || !object(exports.get("Default")))
      fail("export a Default CSF story object.");
    const variants = [...exports]
      .filter(([, node]) => object(node))
      .map(([key]) => key);
    if (variants.length < 2)
      fail(
        "include a named state, variant or composition example alongside Default.",
      );
    for (const variant of variants) {
      const story = object(exports.get(variant));
      if (
        story.properties.some(
          (member) =>
            ts.isSpreadAssignment(member) ||
            ts.isGetAccessorDeclaration(member) ||
            ts.isSetAccessorDeclaration(member) ||
            (member.name && ts.isComputedPropertyName(member.name)),
        )
      ) {
        fail(
          `${variant}: use an explicit story object (no story spreads, accessors or computed keys).`,
        );
        continue;
      }
      const render = property(story, "render") ?? property(meta, "render");
      if (render && !rendersComponent(render, symbol, checker, file))
        fail(
          `${variant}: custom render must render ${name} in JSX, directly or through local helpers.`,
        );
    }
    stories.push({
      component: name,
      path: relative(process.cwd(), path).replaceAll("\\", "/"),
      title: title && ts.isStringLiteral(title) ? title.text : "",
      exports: variants,
    });
  }
  const titles = new Set();
  for (const story of stories) {
    if (titles.has(story.title))
      errors.push(`Duplicate dedicated story title: ${story.title}.`);
    titles.add(story.title);
  }
  return { stories, errors };
}

export function checkBuiltStories(stories, index) {
  const errors = [];
  const entries = Object.values(index?.entries ?? {});
  const built = stories.map((story) => {
    const matching = entries.filter(
      (entry) =>
        entry.importPath === `./${story.path}` && entry.title === story.title,
    );
    const examples = story.exports.flatMap((exportName) => {
      const matches = matching.filter(
        (entry) => entry.type === "story" && entry.exportName === exportName,
      );
      if (matches.length !== 1) {
        errors.push(
          `${story.component}: built Storybook must contain ${exportName} exactly once.`,
        );
        return [];
      }
      return [{ exportName, id: matches[0].id }];
    });
    const docs = matching.filter((entry) => entry.type === "docs");
    if (docs.length !== 1)
      errors.push(
        `${story.component}: built Storybook must contain its autodocs entry.`,
      );
    return { ...story, examples, docsId: docs[0]?.id };
  });
  return { stories: built, errors };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  let result = checkStories();
  if (!result.errors.length && process.argv.includes("--built")) {
    try {
      result = checkBuiltStories(
        result.stories,
        JSON.parse(readFileSync("storybook-static/index.json", "utf8")),
      );
    } catch {
      result.errors.push(
        "Build Storybook before checking its component entries.",
      );
    }
  }
  if (result.errors.length) {
    console.error(result.errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      process.argv.includes("--json")
        ? JSON.stringify(result.stories)
        : `Dedicated stories cover all ${result.stories.length} public components${process.argv.includes("--built") ? " in the built Storybook" : ""}.`,
    );
}
