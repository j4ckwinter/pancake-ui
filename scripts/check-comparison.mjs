import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

export function checkComparison({
  indexPath = "src/index.ts",
  storyPath = "src/stories/comparison/Comparison.stories.tsx",
} = {}) {
  const indexFile = resolve(indexPath);
  const storyFile = resolve(storyPath);
  const program = ts.createProgram([indexFile, storyFile], {
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
  const story = program.getSourceFile(storyFile);
  if (!entry || !story) {
    return {
      components: [],
      errors: [
        "Comparison coverage requires both the package entry point and comparison story.",
      ],
    };
  }
  const module = checker.getSymbolAtLocation(entry);
  if (!module)
    return { components: [], errors: ["Package entry point has no exports."] };
  const unalias = (symbol) =>
    symbol?.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(symbol)
      : symbol;
  const components = checker.getExportsOfModule(module).flatMap((exported) => {
    const symbol = unalias(exported);
    const declaration = symbol?.valueDeclaration;
    if (!declaration || !/^[A-Z]/.test(exported.name)) return [];
    const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
    if (
      !type.getCallSignatures().length &&
      !type.getConstructSignatures().length
    )
      return [];
    return [{ name: exported.name, symbol }];
  });
  const imported = new Set();
  const namespaces = new Set();
  for (const statement of story.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause) continue;
    if (checker.getSymbolAtLocation(statement.moduleSpecifier) !== module)
      continue;
    const bindings = statement.importClause.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
      for (const specifier of bindings.elements) {
        if (!specifier.isTypeOnly && !statement.importClause.isTypeOnly)
          imported.add(checker.getSymbolAtLocation(specifier.name));
      }
    }
    if (
      bindings &&
      ts.isNamespaceImport(bindings) &&
      !statement.importClause.isTypeOnly
    ) {
      namespaces.add(checker.getSymbolAtLocation(bindings.name));
    }
  }
  const rendered = new Set();
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const symbol = checker.getSymbolAtLocation(node.tagName);
      const namespaceUsage =
        ts.isPropertyAccessExpression(node.tagName) &&
        namespaces.has(checker.getSymbolAtLocation(node.tagName.expression));
      if (imported.has(symbol) || namespaceUsage) rendered.add(unalias(symbol));
    }
    ts.forEachChild(node, visit);
  }
  visit(story);
  const errors = components
    .filter(({ symbol }) => !rendered.has(symbol))
    .map(
      ({ name }) =>
        `${storyPath}: Render public component ${name} from the package entry point alongside the existing comparison components.`,
    );
  if (!components.length)
    errors.push(
      "No public component exports were found; check the package entry point.",
    );
  return { components: components.map(({ name }) => name).sort(), errors };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const result = checkComparison();
  if (result.errors.length) {
    console.error(result.errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(
      process.argv.includes("--json")
        ? JSON.stringify(result.components)
        : `Comparison story covers all ${result.components.length} public components.`,
    );
  }
}
