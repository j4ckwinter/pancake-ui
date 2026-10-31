import { readFileSync, readdirSync } from "node:fs";
import { resolve, posix } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { checkComparison } from "./check-comparison.mjs";

export function checkContracts(
  components,
  contracts,
  source,
  sourcePath = "tests/contracts.spec.ts",
) {
  if (typeof source !== "string") {
    const errors = [];
    for (const name of components) {
      const matches = Object.entries(source).filter(([path]) =>
        path.endsWith(`/${name}.spec.ts`),
      );
      if (matches.length !== 1) {
        errors.push(`${name}: require exactly one colocated ${name}.spec.ts.`);
        continue;
      }
      const [path, text] = matches[0];
      errors.push(
        ...checkContracts([name], { [name]: contracts[name] }, text, path),
      );
    }
    for (const name of Object.keys(contracts))
      if (!components.includes(name))
        errors.push(`${name}: contract has no public component export.`);
    return errors;
  }
  const errors = [];
  const file = ts.createSourceFile(
    "contracts.spec.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const testNames = new Map();
  const importedTest = file.statements.some(
    (statement) =>
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      ["tests/fixtures", "tests/contracts-fixture"].includes(
        posix.normalize(
          posix.join(posix.dirname(sourcePath), statement.moduleSpecifier.text),
        ),
      ) &&
      statement.importClause?.namedBindings &&
      ts.isNamedImports(statement.importClause.namedBindings) &&
      statement.importClause.namedBindings.elements.some(
        (element) => element.name.text === "test" && !element.propertyName,
      ),
  );
  for (const statement of file.statements) {
    if (
      !ts.isExpressionStatement(statement) ||
      !ts.isCallExpression(statement.expression)
    )
      continue;
    const call = statement.expression;
    if (
      !importedTest ||
      !ts.isIdentifier(call.expression) ||
      call.expression.text !== "test"
    )
      continue;
    const [title, callback] = call.arguments;
    if (
      !title ||
      !ts.isStringLiteral(title) ||
      !callback ||
      (!ts.isArrowFunction(callback) && !ts.isFunctionExpression(callback))
    )
      continue;
    let hasAssertion = false;
    const namedComponents = new Set();
    const visit = (node) => {
      if (ts.isStringLiteral(node)) namedComponents.add(node.text);
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "expect"
      )
        hasAssertion = true;
      ts.forEachChild(node, visit);
    };
    visit(callback);
    if (hasAssertion) testNames.set(title.text, namedComponents);
  }
  for (const name of components) {
    const contract = contracts[name];
    if (!contract || typeof contract !== "object") {
      errors.push(
        `${name}: add explicit component contracts before exporting this component.`,
      );
      continue;
    }
    for (const category of ["semantics", "keyboard", "state", "form", "ref"]) {
      const requirement = contract[category];
      if (
        requirement?.test &&
        !requirement.notApplicable &&
        testNames.has(requirement.test) &&
        (requirement.test.startsWith(`${name}:`) ||
          testNames.get(requirement.test).has(name))
      )
        continue;
      if (
        category !== "semantics" &&
        requirement?.notApplicable?.trim().length >= 20 &&
        !requirement.test
      )
        continue;
      errors.push(
        `${name}.${category}: reference an assertion-bearing top-level test in the component’s colocated spec or explain why this contract does not apply.`,
      );
    }
  }
  for (const name of Object.keys(contracts)) {
    if (!components.includes(name))
      errors.push(`${name}: contract has no public component export.`);
  }
  return errors;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const comparison = checkComparison();
  const errors = [
    ...comparison.errors,
    ...checkContracts(
      comparison.components,
      JSON.parse(readFileSync("tests/component-contracts.json", "utf8")),
      Object.fromEntries(
        readdirSync("src/components", { recursive: true })
          .filter((path) => path.endsWith(".spec.ts"))
          .map((path) => [
            `src/components/${path}`,
            readFileSync(`src/components/${path}`, "utf8"),
          ]),
      ),
    ),
  ];
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      `Behaviour contracts cover all ${comparison.components.length} public components.`,
    );
}
