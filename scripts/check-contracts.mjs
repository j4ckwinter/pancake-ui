import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { checkComparison } from "./check-comparison.mjs";

export function checkContracts(components, contracts, source) {
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
      statement.moduleSpecifier.text === "./fixtures" &&
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
        `${name}.${category}: reference an assertion-bearing top-level test in contracts.spec.ts or explain why this contract does not apply.`,
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
      readFileSync("tests/contracts.spec.ts", "utf8"),
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
