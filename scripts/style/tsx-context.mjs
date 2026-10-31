import ts from "typescript";

// Resolve local syntax against its lexical scope; no cross-module evaluation.
export function createTsxContext(file) {
  const unwrap = (node) => {
    while (
      node &&
      (ts.isParenthesizedExpression(node) ||
        ts.isAsExpression(node) ||
        ts.isSatisfiesExpression(node))
    )
      node = node.expression;
    return node;
  };
  function binding(identifier) {
    let scope = identifier.parent;
    while (scope) {
      const declarations = [];
      if (ts.isFunctionLike(scope)) declarations.push(...scope.parameters);
      if (ts.isBlock(scope) || ts.isSourceFile(scope)) {
        for (const statement of scope.statements) {
          if (ts.isVariableStatement(statement))
            declarations.push(...statement.declarationList.declarations);
        }
      }
      for (const declaration of declarations) {
        if (
          ts.isIdentifier(declaration.name) &&
          declaration.name.text === identifier.text
        )
          return declaration;
        if (ts.isObjectBindingPattern(declaration.name)) {
          const element = declaration.name.elements.find(
            (e) => ts.isIdentifier(e.name) && e.name.text === identifier.text,
          );
          if (element) return element;
        }
      }
      scope = scope.parent;
    }
  }
  function consumerProp(node, name) {
    if (!ts.isIdentifier(node) || node.text !== name) return false;
    const declaration = binding(node);
    return (
      declaration &&
      ts.isBindingElement(declaration) &&
      ts.isParameter(declaration.parent.parent) &&
      (!declaration.propertyName ||
        declaration.propertyName.getText(file) === name) &&
      (!declaration.initializer ||
        (name === "className" &&
          ts.isStringLiteral(declaration.initializer) &&
          declaration.initializer.text === ""))
    );
  }
  function literal(node, seen = new Set()) {
    node = unwrap(node);
    if (!node || seen.has(node)) return undefined;
    seen.add(node);
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
      return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (ts.isIdentifier(node)) return literal(binding(node)?.initializer, seen);
    return undefined;
  }
  function importedFrom(identifier, module) {
    if (binding(identifier)) return false;
    return file.statements.some(
      (statement) =>
        ts.isImportDeclaration(statement) &&
        statement.moduleSpecifier.text === module &&
        !statement.importClause?.isTypeOnly &&
        statement.importClause?.namedBindings &&
        ts.isNamedImports(statement.importClause.namedBindings) &&
        statement.importClause.namedBindings.elements.some(
          (element) =>
            !element.isTypeOnly &&
            element.name.text === identifier.text &&
            (!element.propertyName ||
              element.propertyName.text === identifier.text),
        ),
    );
  }
  return { unwrap, binding, consumerProp, literal, importedFrom };
}
