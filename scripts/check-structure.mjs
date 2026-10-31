import { readdir, readFile } from "node:fs/promises";
import { posix, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

export function checkStructure(files) {
  const errors = [];
  for (const [path, source] of Object.entries(files)) {
    const report = (message) => errors.push(`${path}: ${message}`);
    if (
      !/^src\/(?:index\.ts|styles\.css|(?:components|foundations|stories)\/.+)$/.test(
        path,
      )
    ) {
      report(
        "Place source in components/, foundations/, or stories/; only index.ts and styles.css belong at the root.",
      );
      continue;
    }
    const spec =
      path.startsWith("src/components/") && path.endsWith(".spec.ts");
    if (spec && !files[path.replace(/\.spec\.ts$/, ".tsx")])
      report("Colocate specs beside their matching component TSX file.");
    const runtime = path.startsWith("src/components/") && !spec;
    const foundation = path.startsWith("src/foundations/");
    const entry = path === "src/index.ts";
    if (path.includes(".stories.") && !path.startsWith("src/stories/"))
      report(
        "Put Storybook stories in src/stories, outside runtime component code.",
      );
    if (runtime && path.split("/").length < 4)
      report("Give each component or component family a directory.");
    if (path !== "src/index.ts" && /\/index\.[jt]sx?$/.test(path))
      report(
        "Use direct internal modules; src/index.ts is the sole public barrel.",
      );
    if (!/\.[jt]sx?$/.test(path)) continue;
    const file = ts.createSourceFile(
      path,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const componentNames = [];
    if (runtime || foundation) {
      for (const statement of file.statements) {
        if (
          ts.isExportDeclaration(statement) &&
          !statement.isTypeOnly &&
          (!statement.exportClause ||
            !ts.isNamedExports(statement.exportClause) ||
            statement.exportClause.elements.some(
              (element) => !element.isTypeOnly,
            ))
        )
          report(
            "Declare runtime exports in their owning module; keep value re-exports in src/index.ts.",
          );
      }
    }
    for (const statement of file.statements) {
      const exported = statement.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
      );
      if (!exported) continue;
      if (
        (ts.isFunctionDeclaration(statement) ||
          ts.isClassDeclaration(statement)) &&
        /^[A-Z]/.test(statement.name?.text ?? "")
      )
        componentNames.push(statement.name.text);
      if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (
            ts.isIdentifier(declaration.name) &&
            /^[A-Z]/.test(declaration.name.text)
          )
            componentNames.push(declaration.name.text);
        }
      }
      if (
        runtime &&
        statement.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword,
        )
      )
        report("Use a named public component export matching its file.");
    }
    if (runtime && path.endsWith(".tsx")) {
      const expected = posix.basename(path, ".tsx");
      if (componentNames.length !== 1 || componentNames[0] !== expected)
        report(
          "Keep one public component per TSX file, named to match the file; keep its props and private helpers together.",
        );
    } else if ((runtime || foundation) && componentNames.length) {
      report("Put public components in a matching TSX file under components/.");
    }
    function dependency(value) {
      const target = value.startsWith(".")
        ? posix.normalize(posix.join(posix.dirname(path), value))
        : value;
      if (
        (runtime || foundation) &&
        (target === "@jack.winter/pancake-ui" ||
          /^src(?:\/index(?:\.[jt]sx?)?)?$/.test(target))
      )
        report(
          "Runtime modules must import direct modules, not the public barrel.",
        );
      if (
        (runtime || foundation || entry) &&
        (/^(?:src\/stories|tests|compatibility|examples|scripts)(?:\/|$)/.test(
          target,
        ) ||
          /\.spec(?:\.[jt]sx?)?$/.test(target))
      )
        report(
          "Runtime code must not depend on stories, tests, examples, compatibility fixtures, or tooling.",
        );
      if (foundation && /^src\/components(?:\/|$)/.test(target))
        report("Foundations must not depend on components.");
    }
    function visit(node) {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      )
        dependency(node.moduleSpecifier.text);
      if (
        ts.isCallExpression(node) &&
        (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          node.expression.getText(file) === "require")
      ) {
        if (node.arguments[0] && ts.isStringLiteral(node.arguments[0]))
          dependency(node.arguments[0].text);
        else if (runtime || foundation)
          report("Use statically resolvable imports in runtime modules.");
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
  }
  return errors;
}

async function readSource(directory) {
  const files = {};
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) Object.assign(files, await readSource(path));
    else files[path] = await readFile(path, "utf8");
  }
  return files;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const errors = checkStructure(await readSource("src"));
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      "Source placement, component boundaries, and dependency direction are valid.",
    );
}
