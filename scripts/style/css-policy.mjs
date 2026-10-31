export const exceptions = [
  [
    "components/Checkbox/Checkbox.css",
    ".pancake-checkbox:checked::before",
    "transform",
    "translateY(-2px) rotate(45deg)",
    "Optically centres the CSS checkmark.",
  ],
  [
    "components/Button/Button.css",
    ".pancake-button",
    "border",
    "1px solid ButtonText",
    "Uses the system button colour in forced-colours mode.",
    "(forced-colors: active)",
  ],
  [
    "components/TextField/TextField.css",
    '.pancake-field-input[aria-invalid="true"]',
    "border-width",
    "2px",
    "Preserves the existing invalid-field border.",
  ],
  [
    "components/feedback/feedback.css",
    ".pancake-banner-dismiss",
    "font-size",
    "24px",
    "The multiplication glyph is an icon rather than body typography.",
  ],
  [
    "components/navigation/navigation.css",
    ".pancake-header-copy",
    "flex",
    "1 1 160px",
    "Header wrapping threshold, not content spacing.",
  ],
  [
    "components/navigation/navigation.css",
    ".pancake-bottom-navigation li",
    "flex",
    "1 1 80px",
    "Navigation wrapping threshold.",
  ],
  [
    "components/navigation/navigation.css",
    ".pancake-segment",
    "flex",
    "1 1 80px",
    "Segment wrapping threshold.",
  ],
  ...["width", "height"].map((property) => [
    "components/navigation/navigation.css",
    ".pancake-navigation-sr-only",
    property,
    "1px",
    "Visually hidden accessible text geometry.",
  ]),
  [
    "components/navigation/navigation.css",
    ".pancake-navigation-sr-only",
    "margin",
    "-1px",
    "Visually hidden accessible text geometry.",
  ],
  [
    "components/navigation/navigation.css",
    ".pancake-segment input:checked + span",
    "border",
    "2px solid Highlight",
    "System selection colour in forced-colours mode.",
    "(forced-colors: active)",
  ],
  [
    "components/navigation/navigation.css",
    '.pancake-bottom-navigation a[aria-current="page"]',
    "outline",
    "2px solid Highlight",
    "System selection colour in forced-colours mode.",
    "(forced-colors: active)",
  ],
  ...[
    [
      "components/TextField/TextField.css",
      ".pancake-field-input:focus-visible",
    ],
    [
      "components/feedback/feedback.css",
      ".pancake-banner-dismiss:focus-visible",
    ],
    [
      "components/navigation/navigation.css",
      ".pancake-bottom-navigation a:focus-visible",
    ],
    [
      "components/navigation/navigation.css",
      ".pancake-segment input:focus-visible + span",
    ],
  ].map(([file, selector]) => [
    file,
    selector,
    "outline-offset",
    "2px",
    "Preserves the established compact focus offset.",
  ]),
];

export function ancestors(node) {
  const result = [];
  for (let parent = node.parent; parent; parent = parent.parent)
    result.push(parent);
  return result;
}

export function scopedSelector(selector) {
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

export const colorKeywords = new Set([
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
