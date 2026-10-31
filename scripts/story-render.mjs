import ts from "typescript";

export function rendersComponent(render, target, checker, file) {
  const seen = new Set();
  let rendered = false;
  const unalias = (symbol) =>
    symbol?.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(symbol)
      : symbol;
  function follow(expression) {
    const declaration = unalias(
      ts.isShorthandPropertyAssignment(expression.parent)
        ? checker.getShorthandAssignmentValueSymbol(expression.parent)
        : checker.getSymbolAtLocation(expression),
    )?.valueDeclaration;
    if (declaration?.getSourceFile() !== file) return;
    if (ts.isFunctionDeclaration(declaration)) visit(declaration.body);
    if (ts.isVariableDeclaration(declaration))
      visit(declaration.initializer, true);
  }
  function visit(node, invoked = false) {
    if (
      node &&
      !invoked &&
      (ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isArrowFunction(node))
    )
      return;
    if (!node || seen.has(node) || rendered) return;
    seen.add(node);
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      if (unalias(checker.getSymbolAtLocation(node.tagName)) === target) {
        rendered = true;
        return;
      }
      follow(node.tagName);
    }
    if (ts.isIdentifier(node) && node === render) follow(node);
    if (ts.isCallExpression(node)) {
      follow(node.expression);
      if (
        ts.isFunctionExpression(node.expression) ||
        ts.isArrowFunction(node.expression)
      )
        visit(node.expression, true);
      for (const argument of node.arguments) {
        if (ts.isArrowFunction(argument) || ts.isFunctionExpression(argument))
          visit(argument, true);
        if (ts.isIdentifier(argument)) follow(argument);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(render, true);
  return rendered;
}
