import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { checkComparison } from "./check-comparison.mjs";

async function fixture(story, run, extra = "", extraTs = "") {
  const directory = await mkdtemp(join(tmpdir(), "pancake-comparison-"));
  try {
    await writeFile(
      join(directory, "components.tsx"),
      `export function Button() { return <button />; }\nexport const Field = () => <input />;\nexport type Props = { label: string };\n${extra}`,
    );
    await writeFile(
      join(directory, "tokens.ts"),
      `export const spacing = { small: 4 }; export const tokenName = () => "small";\n${extraTs}`,
    );
    await writeFile(
      join(directory, "index.ts"),
      'export * from "./components"; export * from "./tokens";',
    );
    await writeFile(join(directory, "Comparison.stories.tsx"), story);
    await run({
      indexPath: join(directory, "index.ts"),
      storyPath: join(directory, "Comparison.stories.tsx"),
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("requires actual JSX usage, not an import or component name string", async () => {
  await fixture(
    'import { Button, Field } from "./index"; export const Story = () => <><Button /><span>Field</span></>;',
    (paths) => {
      const result = checkComparison(paths);
      assert.deepEqual(result.components, ["Button", "Field"]);
      assert.equal(result.errors.length, 1);
      assert.match(result.errors[0], /Render public component Field/);
    },
  );
});

test("resolves aliased JSX imports and ignores types and non-component token exports", async () => {
  await fixture(
    'import { Button as Action, Field } from "./index"; export const Story = () => <><Action /><Field /></>;',
    (paths) => {
      assert.deepEqual(checkComparison(paths), {
        components: ["Button", "Field"],
        errors: [],
      });
    },
  );
});

test("supports namespace imports from the public entry point", async () => {
  await fixture(
    'import * as UI from "./index"; export const Story = () => <><UI.Button /><UI.Field /></>;',
    (paths) => {
      assert.deepEqual(checkComparison(paths).errors, []);
    },
  );
});

test("does not count local components with the same name or direct implementation imports", async () => {
  await fixture(
    'import { Field } from "./components"; const Button = () => <button />; export const Story = () => <><Button /><Field /></>;',
    (paths) => {
      assert.equal(checkComparison(paths).errors.length, 2);
    },
  );
});

test("a new public arrow component fails coverage until added to the comparison", async () => {
  await fixture(
    'import { Button, Field } from "./index"; export const Story = () => <><Button /><Field /></>;',
    (paths) => {
      assert.deepEqual(checkComparison(paths).components, [
        "Button",
        "Field",
        "Toggle",
      ]);
      assert.match(
        checkComparison(paths).errors.join("\n"),
        /Render public component Toggle/,
      );
    },
    'export const Toggle = () => <button role="switch" />;',
  );
});

test("missing entry point or comparison story fails closed", () => {
  assert.match(
    checkComparison({
      indexPath: "/missing/index.ts",
      storyPath: "/missing/Comparison.stories.tsx",
    }).errors[0],
    /requires both/,
  );
});

test("an unused barrel import cannot bless a direct implementation import", async () => {
  await fixture(
    'import { Button as Unused, Field } from "./index"; import { Button } from "./components"; export const Story = () => <><Button /><Field /></>;',
    (paths) => {
      assert.match(
        checkComparison(paths).errors.join("\n"),
        /Render public component Button/,
      );
    },
  );
});

for (const [name, component, componentTs] of [
  [
    "ClassControl",
    "export class ClassControl { render() { return <button />; } }",
    "",
  ],
  [
    "Callout",
    "",
    'declare function createElement(tag: string): unknown; export function Callout() { return createElement("aside"); }',
  ],
]) {
  test(`requires omitted ${name} component regardless of implementation form`, async () => {
    await fixture(
      'import { Button, Field } from "./index"; export const Story = () => <><Button /><Field /></>;',
      (paths) => {
        assert.match(
          checkComparison(paths).errors.join("\n"),
          new RegExp(`Render public component ${name}`),
        );
      },
      component,
      componentTs,
    );
  });
  test(`accepts ${name} component when included in comparison JSX`, async () => {
    await fixture(
      `import { Button, Field, ${name} } from "./index"; export const Story = () => <><Button /><Field /><${name} /></>;`,
      (paths) => {
        const result = checkComparison(paths);
        assert.ok(result.components.includes(name));
        assert.deepEqual(result.errors, []);
      },
      component,
      componentTs,
    );
  });
}
