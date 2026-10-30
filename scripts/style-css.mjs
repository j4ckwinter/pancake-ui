import { readFileSync } from "node:fs";
import postcss from "postcss";

const theme = postcss.parse(
  readFileSync(new URL("../src/theme.css", import.meta.url), "utf8"),
);
export const themeVariables = new Set();
theme.walkDecls((declaration) => themeVariables.add(declaration.prop));
export const themeUtilities = new Set();
for (const variable of themeVariables) {
  const mappings = [
    ["--color-", ["bg-", "text-", "border-", "outline-", "fill-", "stroke-"]],
    [
      "--spacing-",
      [
        "p-",
        "px-",
        "py-",
        "pt-",
        "pr-",
        "pb-",
        "pl-",
        "ps-",
        "pe-",
        "m-",
        "mx-",
        "my-",
        "mt-",
        "mr-",
        "mb-",
        "ml-",
        "ms-",
        "me-",
        "gap-",
        "gap-x-",
        "gap-y-",
        "w-",
        "h-",
        "size-",
        "min-w-",
        "min-h-",
        "max-w-",
        "max-h-",
      ],
    ],
    ["--radius-", ["rounded-"]],
    ["--font-", ["font-"]],
    ["--text-", ["text-"]],
  ];
  for (const [prefix, utilities] of mappings) {
    if (
      variable.startsWith(prefix) &&
      !variable.slice(prefix.length).includes("--")
    ) {
      for (const utility of utilities)
        themeUtilities.add(utility + variable.slice(prefix.length));
    }
  }
}

const exceptions = [
  [
    "controls.css",
    ".pancake-checkbox:checked::before",
    "transform",
    "translateY(-2px) rotate(45deg)",
    "Optically centres the CSS checkmark.",
  ],
  [
    "controls.css",
    ".pancake-button",
    "border",
    "1px solid ButtonText",
    "Uses the system button colour in forced-colours mode.",
    "(forced-colors: active)",
  ],
  [
    "field.css",
    '.pancake-field-input[aria-invalid="true"]',
    "border-width",
    "2px",
    "Preserves the existing invalid-field border.",
  ],
  [
    "identity-feedback.css",
    ".pancake-banner-dismiss",
    "font-size",
    "24px",
    "The multiplication glyph is an icon rather than body typography.",
  ],
  [
    "navigation.css",
    ".pancake-header-copy",
    "flex",
    "1 1 160px",
    "Header wrapping threshold, not content spacing.",
  ],
  [
    "navigation.css",
    ".pancake-bottom-navigation li",
    "flex",
    "1 1 80px",
    "Navigation wrapping threshold.",
  ],
  [
    "navigation.css",
    ".pancake-segment",
    "flex",
    "1 1 80px",
    "Segment wrapping threshold.",
  ],
  ...["width", "height"].map((property) => [
    "navigation.css",
    ".pancake-navigation-sr-only",
    property,
    "1px",
    "Visually hidden accessible text geometry.",
  ]),
  [
    "navigation.css",
    ".pancake-navigation-sr-only",
    "margin",
    "-1px",
    "Visually hidden accessible text geometry.",
  ],
  [
    "navigation.css",
    ".pancake-segment input:checked + span",
    "border",
    "2px solid Highlight",
    "System selection colour in forced-colours mode.",
    "(forced-colors: active)",
  ],
  [
    "navigation.css",
    '.pancake-bottom-navigation a[aria-current="page"]',
    "outline",
    "2px solid Highlight",
    "System selection colour in forced-colours mode.",
    "(forced-colors: active)",
  ],
  ...[
    ["field.css", ".pancake-field-input:focus-visible"],
    ["identity-feedback.css", ".pancake-banner-dismiss:focus-visible"],
    ["navigation.css", ".pancake-bottom-navigation a:focus-visible"],
    ["navigation.css", ".pancake-segment input:focus-visible + span"],
  ].map(([file, selector]) => [
    file,
    selector,
    "outline-offset",
    "2px",
    "Preserves the established compact focus offset.",
  ]),
];

function ancestors(node) {
  const result = [];
  for (let parent = node.parent; parent; parent = parent.parent)
    result.push(parent);
  return result;
}

function scopedSelector(selector) {
  if (
    !/^\.pancake-[\w-]+/.test(selector) ||
    /:(?:is|where|global)\s*\(/i.test(selector) ||
    selector.includes("\\")
  )
    return false;
  let depth = 0;
  let quote = "";
  let descendant = false;
  for (let index = 0; index < selector.length; index++) {
    const char = selector[index];
    if (quote) {
      if (char === quote && selector[index - 1] !== "\\") quote = "";
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "(" || char === "[") depth++;
    if (char === ")" || char === "]") depth--;
    if (depth === 0 && (char === "+" || char === "~") && !descendant)
      return false;
    if (
      depth === 0 &&
      (char === ">" ||
        (/\s/.test(char) &&
          /[^\s+~]/.test(selector.slice(index).trim()[0] ?? "")))
    )
      descendant = true;
  }
  return true;
}

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
        "Define shared design tokens in src/tokens.ts, not component styles.",
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
      const allowed = new Set([
        "linear-gradient",
        "radial-gradient",
        "conic-gradient",
        "repeating-linear-gradient",
        "repeating-radial-gradient",
        "repeating-conic-gradient",
        "to",
        "left",
        "right",
        "top",
        "bottom",
        "center",
        "at",
        "from",
        "circle",
        "ellipse",
        "closest-side",
        "closest-corner",
        "farthest-side",
        "farthest-corner",
        "deg",
        "turn",
        "rad",
        "grad",
        "none",
        "transparent",
        "currentcolor",
        "inherit",
        "initial",
        "unset",
        "revert",
        "revert-layer",
        "solid",
        "dashed",
        "dotted",
        "double",
        "inset",
        "outset",
        "ridge",
        "groove",
        "hidden",
      ]);
      if (words.some((word) => !allowed.has(word.toLowerCase())))
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
