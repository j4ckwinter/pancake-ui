import ts from "typescript";
import { readFileSync } from "node:fs";
import { themeVariables } from "./theme.mjs";

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

export function validValue(property, value) {
  if (value === 0) return true;
  if (typeof value !== "string") return false;
  const refs = [...value.matchAll(/var\((--[\w-]+)\)/g)];
  if (
    refs.length &&
    refs.every((m) => themeVariables.has(m[1])) &&
    value.replace(/var\(--[\w-]+\)/g, "").trim() === ""
  )
    return true;
  if (structural.has(property)) return /^[a-z-]+$/.test(value);
  return /^(?:0|auto|none|inherit|initial|unset|currentColor|transparent|100%)$/.test(
    value,
  );
}

const layoutHelperPath = "src/components/layout/layout.shared.ts";
const spacingHelper =
  "constspace=(token:SpacingToken)=>`var(--spacing-pancake-${spacing[token]})`;";
const canonical = (source) => source.replace(/\s/g, "");
const normalized = (filename) => filename.replaceAll("\\", "/");

export function checkDynamicHelpers(source, filename) {
  if (
    normalized(filename) === layoutHelperPath &&
    !canonical(source).includes(spacingHelper)
  )
    return [
      `${filename}:1: Audited spacing helper changed; review dynamic token styling exemptions.`,
    ];
  return [];
}

const layoutStyles = [
  "gap:space(gap)",
  "padding:padding?space(padding):undefined",
  "alignItems:alignment[align]",
  "justifyContent:justification[justify]",
];
const avatarStyles = [
  "width:`var(--spacing-pancake-${size})`",
  "height:`var(--spacing-pancake-${size})`",
];
// Exact owners and expressions: moving or introducing dynamic styles requires review.
const dynamicStyles = {
  "src/components/layout/Stack.tsx": new Set(layoutStyles),
  "src/components/layout/Inline.tsx": new Set([
    ...layoutStyles,
    'flexWrap:wrap?"wrap":"nowrap"',
  ]),
  "src/components/layout/Text.tsx": new Set([
    "fontSize:`var(${token})`",
    "lineHeight:`var(${token}--line-height)`",
    "fontWeight:`var(${token}--font-weight)`",
    "letterSpacing:`var(${token}--letter-spacing)`",
    "color:`var(--color-pancake-${kebab(color)})`",
  ]),
  "src/components/identity/Avatar.tsx": new Set(avatarStyles),
  "src/components/identity/AvatarGroup.tsx": new Set(avatarStyles),
};

export function isDynamicStyle(file, filename, key, expression, importedFrom) {
  const path = normalized(filename);
  if (
    !dynamicStyles[path]?.has(`${key}:${canonical(expression.getText(file))}`)
  )
    return false;
  if (/\/layout\/(Stack|Inline)\.tsx$/.test(path)) {
    let validImports = true;
    function inspect(node) {
      if (
        ts.isIdentifier(node) &&
        ["space", "alignment", "justification"].includes(node.text)
      )
        validImports &&= importedFrom(node, "./layout.shared");
      ts.forEachChild(node, inspect);
    }
    inspect(expression);
    if (!validImports) return false;
    const helper = readFileSync(
      new URL(`../../${layoutHelperPath}`, import.meta.url),
      "utf8",
    );
    if (checkDynamicHelpers(helper, layoutHelperPath).length) return false;
  }
  if (
    path === "src/components/layout/Text.tsx" &&
    !canonical(file.text).includes(
      "consttoken=`--text-pancake-${kebab(variant)}`;",
    )
  )
    return false;
  return true;
}
