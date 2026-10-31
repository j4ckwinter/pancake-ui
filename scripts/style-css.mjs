import postcss from "postcss";
import { themeVariables, themeUtilities } from "./style/theme.mjs";
import {
  exceptions,
  ancestors,
  scopedSelector,
  colorKeywords,
} from "./style/css-policy.mjs";
export { themeVariables, themeUtilities } from "./style/theme.mjs";

export function checkCss(source, filename = "component.css") {
  const errors = [];
  const report = (node, message) =>
    errors.push(`${filename}:${node.source?.start?.line ?? 1}: ${message}`);
  let root;
  try {
    root = postcss.parse(source, { from: filename });
  } catch (error) {
    return [`${filename}:${error.line ?? 1}: ${error.reason}`];
  }
  root.walkRules((rule) => {
    if (rule.selectors.some((selector) => !scopedSelector(selector)))
      report(
        rule,
        "Selectors must stay within a .pancake- component; use explicit selectors instead of :is/:where or nesting.",
      );
    if (
      !ancestors(rule).some(
        (node) =>
          node.type === "atrule" &&
          node.name === "layer" &&
          node.params === "components",
      )
    )
      report(rule, "Component rules must be inside @layer components.");
  });
  root.walkAtRules((rule) => {
    if (rule.name === "import") {
      const local =
        /^(?:"\.\/(?:[\w-]+\/)*[\w.-]+\.css"|'\.\/(?:[\w-]+\/)*[\w.-]+\.css')$/.test(
          rule.params,
        );
      const safeLocal = local && !rule.params.includes("..");
      const tailwind =
        rule.params ===
        '"tailwindcss/utilities.css" layer(utilities) source(none)';
      if (filename !== "src/styles.css" || (!safeLocal && !tailwind))
        report(
          rule,
          "Import component CSS through quoted ./ paths in src/styles.css; external styles and parent paths are not allowed.",
        );
    } else if (rule.name === "apply") {
      for (const utility of rule.params.split(/\s+/)) {
        if (!themeUtilities.has(utility))
          report(
            rule,
            `Use a known Pancake token utility instead of ${utility}.`,
          );
      }
    } else if (
      !["layer", "media", "supports", "container", "import"].includes(rule.name)
    ) {
      report(
        rule,
        `Unsupported @${rule.name}; keep token definitions and font faces in their dedicated files.`,
      );
    }
  });
  root.walkDecls((declaration) => {
    const { prop, value } = declaration;
    if (declaration.important)
      report(declaration, "Do not override consumer styles with !important.");
    const parents = ancestors(declaration);
    const rule = parents.find((node) => node.type === "rule");
    if (!rule) {
      report(
        declaration,
        "Component declarations must belong to a namespaced rule.",
      );
      return;
    }
    if (prop.startsWith("--"))
      report(
        declaration,
        "Define shared design tokens in src/foundations/tokens.ts, not component styles.",
      );
    if (/var\(\s*--[\w-]+\s*,/.test(value))
      report(
        declaration,
        "Use defined theme variables without local fallbacks.",
      );
    for (const match of value.matchAll(/var\(\s*(--[\w-]+)/g)) {
      if (!themeVariables.has(match[1]))
        report(declaration, `Unknown theme variable ${match[1]}.`);
    }
    const exceptional = exceptions.some(
      ([file, selector, property, expected, reason, media]) =>
        reason &&
        filename === `src/${file}` &&
        rule.selector === selector &&
        prop === property &&
        value === expected &&
        (!media ||
          parents.some(
            (node) =>
              node.type === "atrule" &&
              node.name === "media" &&
              node.params === media,
          )),
    );
    if (exceptional) return;
    const remainder = value
      .replace(/var\(\s*--[\w-]+\s*\)/g, "")
      .replace(/(["'])(?:\\.|(?!\1).)*?\1/g, "");
    if (
      /#(?:[\da-f]{3,8})\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\s*\(/i.test(
        remainder,
      )
    )
      report(declaration, `Use a colour token for ${prop}, not ${value}.`);
    if (
      /(?:^|[^\w-])[-+]?(?:\d*\.)?\d+(?:px|r?em|ch|ex|cap|ic|lh|rlh|[sld]?v[whib]|vmin|vmax|cm|mm|in|pt|pc|q)\b/i.test(
        remainder,
      )
    )
      report(declaration, `Use a dimension token for ${prop}, not ${value}.`);
    if (
      /^(?:[\w-]*color|background(?:-color|-image)?|(?:border|outline)(?:-(?:top|right|bottom|left|block(?:-start|-end)?|inline(?:-start|-end)?))?(?:-color)?|box-shadow|text-shadow|fill|stroke)$/.test(
        prop,
      )
    ) {
      const words =
        remainder
          .replace(/\b(?:var|calc|min|max|clamp)\([^)]*\)/g, "")
          .match(/[a-z][a-z-]*/gi) ?? [];
      if (words.some((word) => !colorKeywords.has(word.toLowerCase())))
        report(declaration, `Use a colour token for ${prop}, not ${value}.`);
    }
    if (
      /^(?:font(?:-family|-size|-weight)?|line-height|letter-spacing)$/.test(
        prop,
      ) &&
      !/^(?:inherit|normal|0)$/.test(remainder.trim()) &&
      remainder.trim()
    )
      report(declaration, `Use a typography token for ${prop}, not ${value}.`);
    if (prop === "opacity" && !/^(?:|0|1|inherit)$/.test(remainder.trim()))
      report(declaration, `Use an opacity token instead of ${value}.`);
  });
  return [...new Set(errors)];
}
