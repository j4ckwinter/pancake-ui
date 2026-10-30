import ts from "typescript";
import { readFileSync } from "node:fs";

const theme = readFileSync(
  new URL("../src/theme.css", import.meta.url),
  "utf8",
);
const tokens = new Set([...theme.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
const structural = new Set([
  "display",
  "position",
  "alignItems",
  "alignSelf",
  "justifyContent",
  "flexDirection",
  "flexWrap",
  "overflow",
  "overflowX",
  "overflowY",
  "boxSizing",
  "textAlign",
  "whiteSpace",
  "objectFit",
  "cursor",
  "visibility",
  "pointerEvents",
  "appearance",
]);

// These expressions derive styles from typed public token props. Keep the list
// exact so new dynamic styling paths require a deliberate review.
const dynamicStyles = {
  "layout.tsx": new Set([
    "gap:space(gap)",
    "padding:padding?space(padding):undefined",
    "alignItems:alignment[align]",
    "justifyContent:justification[justify]",
    'flexWrap:wrap?"wrap":"nowrap"',
    "fontSize:`var(${token})`",
    "lineHeight:`var(${token}--line-height)`",
    "fontWeight:`var(${token}--font-weight)`",
    "letterSpacing:`var(${token}--letter-spacing)`",
    "color:`var(--color-pancake-${kebab(color)})`",
  ]),
  "identity.tsx": new Set([
    "width:`var(--spacing-pancake-${size})`",
    "height:`var(--spacing-pancake-${size})`",
  ]),
};

export function checkTsx(source, filename) {
  const file = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const errors = [];
  const checkedBindings = new Set();
  const report = (node, message) => {
    const { line, character } = file.getLineAndCharacterOfPosition(
      node.getStart(file),
    );
    errors.push(`${filename}:${line + 1}:${character + 1}: ${message}`);
  };
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
  function validValue(property, value) {
    if (value === 0) return true;
    if (typeof value !== "string") return false;
    const refs = [...value.matchAll(/var\((--[\w-]+)\)/g)];
    if (
      refs.length &&
      refs.every((m) => tokens.has(m[1])) &&
      value.replace(/var\(--[\w-]+\)/g, "").trim() === ""
    )
      return true;
    if (structural.has(property)) return /^[a-z-]+$/.test(value);
    return /^(?:0|auto|none|inherit|initial|unset|currentColor|transparent|100%)$/.test(
      value,
    );
  }
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
      const path = filename.replaceAll("\\", "/");
      const canonical = source.replace(/\s/g, "");
      const helpersValid =
        !path.endsWith("layout.tsx") ||
        (canonical.includes(
          "constspace=(token:SpacingToken)=>`var(--spacing-pancake-${spacing[token]})`;",
        ) &&
          canonical.includes("consttoken=`--text-pancake-${kebab(variant)}`;"));
      const dynamic =
        helpersValid &&
        /(?:^|\/)src\/(layout|identity)\.tsx$/.test(path) &&
        dynamicStyles[path.split("/").at(-1)]?.has(
          `${key}:${value.getText(file).replace(/\s/g, "")}`,
        );
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
