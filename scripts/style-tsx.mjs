import ts from "typescript";
import { createTsxContext } from "./style/tsx-context.mjs";
import {
  validValue,
  isDynamicStyle,
  checkDynamicHelpers,
} from "./style/tsx-policy.mjs";

export function checkTsx(source, filename) {
  const file = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const errors = checkDynamicHelpers(source, filename);
  const checkedBindings = new Set();
  const report = (node, message) => {
    const { line, character } = file.getLineAndCharacterOfPosition(
      node.getStart(file),
    );
    errors.push(`${filename}:${line + 1}:${character + 1}: ${message}`);
  };
  const { unwrap, binding, consumerProp, literal, importedFrom } =
    createTsxContext(file);
  function checkStyle(expression, seen = new Set()) {
    const node = unwrap(expression);
    if (!node || seen.has(node)) {
      report(
        expression,
        "Cannot resolve style expression; use a local style object and shared tokens.",
      );
      return;
    }
    seen.add(node);
    if (ts.isIdentifier(node)) {
      if (consumerProp(node, "style")) return;
      checkedBindings.add(binding(node));
      const value = binding(node)?.initializer;
      if (value) {
        checkStyle(value, seen);
        return;
      }
    }
    if (!ts.isObjectLiteralExpression(node)) {
      report(
        node,
        "Use a local style object with shared tokens; this style expression cannot be checked.",
      );
      return;
    }
    for (const property of node.properties) {
      if (ts.isSpreadAssignment(property)) {
        checkStyle(property.expression, new Set(seen));
        continue;
      }
      if (
        !ts.isPropertyAssignment(property) &&
        !ts.isShorthandPropertyAssignment(property)
      ) {
        report(property, "Use named style properties with shared tokens.");
        continue;
      }
      const key =
        ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)
          ? property.name.text
          : undefined;
      const value = ts.isPropertyAssignment(property)
        ? property.initializer
        : property.name;
      const dynamic = isDynamicStyle(file, filename, key, value, importedFrom);
      if (!dynamic && (!key || !validValue(key, literal(value))))
        report(
          property,
          `Use a shared CSS variable for ${key ?? "computed style property"}; move unsupported dynamic styling into token-based CSS.`,
        );
    }
  }
  function checkClass(expression, seen = new Set()) {
    const node = unwrap(expression);
    if (!node || seen.has(node)) {
      report(
        expression,
        "Cannot resolve className; use pancake- classes and the consumer className prop.",
      );
      return;
    }
    seen.add(node);
    if (consumerProp(node, "className")) return;
    if (ts.isIdentifier(node)) {
      checkedBindings.add(binding(node));
      const value = binding(node)?.initializer;
      if (value) {
        checkClass(value, seen);
        return;
      }
    }
    const value = literal(node);
    if (typeof value === "string") {
      if (
        value
          .split(/\s+/)
          .some((part) => part && !/^pancake-[\w-]+$/.test(part))
      )
        report(
          node,
          "Use pancake- component classes; utility classes belong in token-based component CSS.",
        );
      return;
    }
    if (ts.isConditionalExpression(node)) {
      checkClass(node.whenTrue, new Set(seen));
      checkClass(node.whenFalse, new Set(seen));
      return;
    }
    if (ts.isTemplateExpression(node)) {
      let assembled = node.head.text;
      for (const span of node.templateSpans) {
        if (consumerProp(span.expression, "className")) {
          if (
            !/\s$|^$/.test(assembled) ||
            (span.literal.text && !/^\s/.test(span.literal.text))
          )
            report(
              span.expression,
              "Keep the consumer className separate from component class names.",
            );
          assembled += " ";
        } else if (/pancake-[\w-]*$/.test(assembled)) {
          const text = literal(span.expression);
          if (text !== undefined && !/^[\w-]+$/.test(String(text)))
            report(
              span.expression,
              "Class variants must stay within a pancake- class name.",
            );
          if (ts.isConditionalExpression(span.expression)) {
            for (const branch of [
              span.expression.whenTrue,
              span.expression.whenFalse,
            ]) {
              const branchValue = literal(branch);
              if (
                branchValue !== undefined &&
                !/^[\w-]+$/.test(String(branchValue))
              )
                report(
                  branch,
                  "Class variants must stay within a pancake- class name.",
                );
            }
          }
          if (
            text === undefined &&
            !ts.isIdentifier(span.expression) &&
            !ts.isConditionalExpression(span.expression)
          )
            report(
              span.expression,
              "Use a simple component variant in dynamic class names.",
            );
          assembled += "variant";
        } else
          report(
            span.expression,
            "Only consumer className may add dynamic classes; author styles in component CSS.",
          );
        assembled += span.literal.text;
      }
      if (
        assembled
          .split(/\s+/)
          .some((part) => part && !/^pancake-[\w-]+$/.test(part))
      )
        report(
          node,
          "Use pancake- component classes; arbitrary utility classes are not allowed.",
        );
      return;
    }
    report(
      node,
      "Cannot check className expression; use pancake- classes and the consumer className prop.",
    );
  }
  function checkProps(expression, seen = new Set()) {
    const node = unwrap(expression);
    if (!node || node.kind === ts.SyntaxKind.NullKeyword) return;
    if (seen.has(node)) {
      report(node, "Cannot resolve recursive props bag.");
      return;
    }
    seen.add(node);
    if (ts.isIdentifier(node)) {
      const declaration = binding(node);
      if (
        declaration &&
        ts.isBindingElement(declaration) &&
        declaration.dotDotDotToken &&
        ts.isParameter(declaration.parent.parent)
      )
        return;
      checkedBindings.add(declaration);
      if (declaration?.initializer) {
        checkProps(declaration.initializer, seen);
        return;
      }
    }
    if (!ts.isObjectLiteralExpression(node)) {
      report(
        node,
        "Cannot check props bag; pass style and className explicitly or use a local object.",
      );
      return;
    }
    for (const property of node.properties) {
      if (ts.isSpreadAssignment(property)) {
        checkProps(property.expression, new Set(seen));
        continue;
      }
      if (
        ts.isPropertyAssignment(property) ||
        ts.isShorthandPropertyAssignment(property)
      ) {
        const key =
          ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)
            ? property.name.text
            : undefined;
        const value = ts.isPropertyAssignment(property)
          ? property.initializer
          : property.name;
        if (key === "style") checkStyle(value);
        if (key === "className") checkClass(value);
        if (!key)
          report(
            property,
            "Use named props so style and className can be checked.",
          );
      } else {
        report(
          property,
          "Use plain property assignments in props bags; accessors and methods cannot be checked.",
        );
      }
    }
  }
  function visit(node) {
    if (ts.isJsxAttribute(node) && node.initializer) {
      const expression = ts.isJsxExpression(node.initializer)
        ? node.initializer.expression
        : node.initializer;
      if (expression && node.name.text === "style") checkStyle(expression);
      if (expression && node.name.text === "className") checkClass(expression);
    }
    if (
      ts.isCallExpression(node) &&
      (node.expression.getText(file) === "createElement" ||
        node.expression.getText(file) === "React.createElement")
    ) {
      checkProps(node.arguments[1]);
    }
    if (ts.isJsxSpreadAttribute(node)) checkProps(node.expression);
    ts.forEachChild(node, visit);
  }
  visit(file);
  function mutations(node) {
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind >= ts.SyntaxKind.FirstAssignment &&
      node.operatorToken.kind <= ts.SyntaxKind.LastAssignment
    ) {
      let target = node.left;
      while (
        ts.isPropertyAccessExpression(target) ||
        ts.isElementAccessExpression(target)
      )
        target = target.expression;
      if (ts.isIdentifier(target) && checkedBindings.has(binding(target)))
        report(
          node,
          "Do not mutate checked styles or props; declare token-based values in the object initializer.",
        );
    }
    if (
      ts.isCallExpression(node) &&
      node.expression.getText(file) === "Object.assign"
    ) {
      const target = node.arguments[0];
      if (
        target &&
        ts.isIdentifier(target) &&
        checkedBindings.has(binding(target))
      )
        report(
          node,
          "Do not mutate checked styles or props with Object.assign.",
        );
    }
    ts.forEachChild(node, mutations);
  }
  checkedBindings.delete(undefined);
  mutations(file);
  return errors;
}
