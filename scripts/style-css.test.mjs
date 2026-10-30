import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { checkCss } from "./style-css.mjs";

const component = (declarations, selector = ".pancake-example") =>
  `@layer components { ${selector} { ${declarations} } }`;

for (const declaration of [
  "padding: 13px;",
  "gap: 1rem;",
  "width: calc(100% - 13px);",
  "color: #abcdef;",
  "color: red;",
  "background-image: linear-gradient(red, blue);",
  "background: linear-gradient(red, blue);",
  "border-inline: solid red;",
  "border-block-end: solid blue;",
  "background: rgb(1 2 3);",
  "border: solid rebeccapurple;",
  "font-family: Arial;",
  "font-size: 14px;",
  "font-weight: 700;",
  "line-height: 1.2;",
  "opacity: .4;",
  "color: var(--color-pancake-missing);",
  "padding: var(--spacing-pancake-8, 13px);",
  "color: var(--color-pancake-ink, red);",
  "caret-color: red;",
  "--local-color: red;",
  "padding: var(--spacing-pancake-8) !important;",
  "@apply p-4;",
  "@apply p-[13px];",
  "@apply bg-pancake-missing;",
]) {
  test(`rejects ${declaration}`, () => {
    assert.notEqual(checkCss(component(declaration), "src/New.css").length, 0);
  });
}

for (const selector of [
  "body",
  ".pancake-example, body",
  ":is(.pancake-example, body)",
  ".pancake-example + body",
  ".pancake-example:hover ~ main",
  ".pancake-example:where(body)",
  "& .pancake-example",
]) {
  test(`rejects unscoped or unsupported selector ${selector}`, () => {
    assert.notEqual(checkCss(component("margin: 0;", selector)).length, 0);
  });
}

test("accepts token styles, structural values, and component descendants", () => {
  assert.deepEqual(
    checkCss(
      component(
        `
    padding: var(--spacing-pancake-12); color: var(--color-pancake-ink);
    width: 100%; margin: 0 auto; border: 0; opacity: 1;
    font-family: var(--font-pancake); display: flex;
    @apply bg-pancake-surface rounded-pancake-16;
  `,
        ".pancake-example input:checked + span",
      ),
    ),
    [],
  );
});

test("requires the components cascade layer", () => {
  assert.match(
    checkCss(".pancake-example { margin: 0; }").join("\n"),
    /@layer components/,
  );
});

test("reports syntax errors with file and line", () => {
  assert.match(
    checkCss(".pancake-example {", "src/Broken.css")[0],
    /^src\/Broken.css:1:/,
  );
});

test("does not allow arbitrary imports or global at-rules", () => {
  assert.notEqual(
    checkCss('@import "https://example.com/styles.css";', "src/New.css").length,
    0,
  );
  assert.notEqual(checkCss("@font-face { font-family: Something; }").length, 0);
});

test("exceptions are restricted to the exact declaration and file", () => {
  const source = component("font-size: 24px;", ".pancake-banner-dismiss");
  assert.deepEqual(checkCss(source, "src/identity-feedback.css"), []);
  assert.notEqual(checkCss(source, "src/New.css").length, 0);
  assert.notEqual(
    checkCss(source, "src/nested/identity-feedback.css").length,
    0,
  );
  assert.notEqual(
    checkCss(source.replace("24px", "25px"), "src/identity-feedback.css")
      .length,
    0,
  );
});

test("system colour exception requires forced-colours context", () => {
  const source = component("border: 1px solid ButtonText;", ".pancake-button");
  assert.notEqual(checkCss(source, "src/controls.css").length, 0);
  assert.deepEqual(
    checkCss(
      `@media (forced-colors: active) { ${source} }`,
      "src/controls.css",
    ),
    [],
  );
});

test("all current authored component styles pass", () => {
  for (const file of readdirSync("src").filter(
    (name) =>
      name.endsWith(".css") && !["theme.css", "fonts.css"].includes(name),
  )) {
    assert.deepEqual(
      checkCss(readFileSync(`src/${file}`, "utf8"), `src/${file}`),
      [],
      file,
    );
  }
});

test("accepts gradients composed of colour tokens", () => {
  const gradient =
    "linear-gradient(to right, var(--color-pancake-ink), var(--color-pancake-surface))";
  for (const property of ["background", "background-image"]) {
    assert.deepEqual(checkCss(component(`${property}: ${gradient};`)), []);
  }
});

test("accepts new local component imports without an allowlist update", () => {
  assert.deepEqual(
    checkCss(
      `@import "./NewComponent.css"; @import './nested/Another.css';`,
      "src/styles.css",
    ),
    [],
  );
  for (const path of [
    "../outside.css",
    "./nested/../../outside.css",
    "https://example.com/styles.css",
    "/global.css",
  ]) {
    assert.notEqual(checkCss(`@import "${path}";`, "src/styles.css").length, 0);
  }
  assert.notEqual(
    checkCss('@import "./NewComponent.css";', "src/Other.css").length,
    0,
  );
});
