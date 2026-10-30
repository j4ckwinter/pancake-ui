import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { checkTsx } from "./style-tsx.mjs";

const check = (source) => checkTsx(source, "src/Example.tsx");

test("rejects raw visual values, aliases, and unknown variables", () => {
  for (const source of [
    "<div style={{ padding: 13 }} />",
    '<div style={{ color: "red" }} />',
    "<div style={{ fontSize: `13px` }} />",
    '<div style={{ borderRadius: "2rem" }} />',
    "<div style={{ opacity: .3 }} />",
    '<div style={{ color: "var(--color-pancake-missing)" }} />',
    "const x = { padding: 13 }; const y = x; <div style={y} />",
    "const x = { padding: 13 }; <div style={{ ...x }} />",
    'const x = { padding: 13 }; createElement("div", {style:x})',
    "const style = { padding: 13 }; <div style={style} />",
    "<div style={makeStyles()} />",
  ])
    assert.ok(check(source).length, source);
});

test("allows shared tokens and explicit consumer overrides", () => {
  assert.deepEqual(
    check(`function Example({style, className = ""}) {
    return <div className={\`pancake-example \${className}\`} style={{
      padding: "var(--spacing-pancake-12)", color: "var(--color-pancake-ink)",
      display: "flex", width: "100%", margin: 0, ...style
    }} />;
  }`),
    [],
  );
});

test("rejects utility classes including aliases and template fragments", () => {
  for (const source of [
    '<div className="p-4" />',
    'const classes = "pancake-example text-red-500"; <div className={classes} />',
    "<div className={`pancake-example p-4`} />",
    '<div className={`pancake-example ${"text-red-500"}`} />',
    '<div className={`pancake-example--${true ? "x p-4" : "y"}`} />',
    'function Example({className = "p-4"}) {return <div className={className} />}',
  ])
    assert.ok(check(source).length, source);
});

test("resolves styles in the nearest scope", () => {
  assert.ok(
    check(`const styles = {padding: "var(--spacing-pancake-12)"};
    function Example() { const styles = {padding:13}; return <div style={styles} />; }
  `).length,
  );
});

test("current component source passes, including audited dynamic token styles", () => {
  for (const name of readdirSync(new URL("../src", import.meta.url)).filter(
    (name) => name.endsWith(".tsx") && !name.includes(".stories."),
  )) {
    const source = readFileSync(
      new URL(`../src/${name}`, import.meta.url),
      "utf8",
    );
    assert.deepEqual(checkTsx(source, `src/${name}`), [], name);
  }
});

test("changing the audited spacing helper invalidates its dynamic exemption", () => {
  const source = readFileSync(
    new URL("../src/layout.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(
    checkTsx(
      source.replace("`var(--spacing-pancake-${spacing[token]})`", '"13px"'),
      "src/layout.tsx",
    ).length,
  );
});

test("checks local JSX props bags, aliases, and style mutations", () => {
  for (const source of [
    "const props = {style:{padding:13}}; <div {...props} />",
    "const a = {style:{padding:13}}; const b = a; <div {...b} />",
    'const a = {className:"p-4"}; createElement("div", a)',
    "const styles = {padding:0}; styles.padding = 13; <div style={styles} />",
    "const styles = {padding:0}; Object.assign(styles, {padding:13}); <div style={styles} />",
  ])
    assert.ok(check(source).length, source);
  assert.deepEqual(
    check(
      'const props = {style:{padding:"var(--spacing-pancake-12)"}, id:"example"}; <div {...props} />',
    ),
    [],
  );
});

test("rejects accessors and methods in local props bags", () => {
  for (const source of [
    "const props = {get style() { return {padding:13}; }}; <div {...props} />",
    'const props = {get className() { return "p-4"; }}; <div {...props} />',
    'const props = {style() { return {padding:13}; }}; createElement("div", props)',
    "const props = {set style(value) {}}; <div {...props} />",
  ])
    assert.ok(check(source).length, source);
  assert.deepEqual(
    check("function Example({...props}) {return <div {...props} />;}"),
    [],
  );
});
