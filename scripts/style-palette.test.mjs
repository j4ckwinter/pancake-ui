import assert from "node:assert/strict";
import test from "node:test";
import { colors, darkColors } from "../src/foundations/tokens.ts";

const readableText = 4.5;
const visibleBoundary = 3;

const textPairs = [
  ...[
    "surface",
    "canvas",
    "surfaceMuted",
    "info",
    "warning",
    "danger",
    "dangerHover",
    "surfaceAccent",
  ].map((background) => ["ink", background]),
  ...["surface", "canvas", "surfaceMuted"].map((background) => [
    "textSecondary",
    background,
  ]),
  ["muted", "surface"],
  ["muted", "canvas"],
  ["errorStrong", "surface"],
  ["onAccent", "accent"],
  ["onAccent", "accentHover"],
];
const boundaryPairs = [
  ["controlBorder", "surface"],
  ["controlBorder", "canvas"],
  ["controlFocus", "surface"],
  ["deep", "surface"],
  ["deep", "canvas"],
  ["deep", "surfaceMuted"],
];

function luminance(hex) {
  const channels = [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(first, second) {
  const [lighter, darker] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

for (const [theme, palette] of [
  ["light", colors],
  ["dark", darkColors],
]) {
  for (const [pairs, minimum] of [
    [textPairs, readableText],
    [boundaryPairs, visibleBoundary],
  ]) {
    for (const [foreground, background] of pairs) {
      test(`${theme}: ${foreground} on ${background} reaches ${minimum}:1`, () => {
        const ratio = contrast(palette[foreground], palette[background]);
        assert.ok(ratio >= minimum, `${ratio.toFixed(2)}:1`);
      });
    }
  }
}
