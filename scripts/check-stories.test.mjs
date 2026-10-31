import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { checkStories, checkBuiltStories } from "./check-stories.mjs";

const valid = `import { Button } from './index';
const meta = {title:'Actions/Button',component:Button,tags:['autodocs']};
export default meta; export const Default = {}; export const Disabled = {args:{disabled:true}};`;
async function fixture(
  run,
  { source = valid, extra = "", filename = "Button.stories.tsx" } = {},
) {
  const directory = await mkdtemp(join(tmpdir(), "pancake-stories-"));
  try {
    await writeFile(
      join(directory, "component.tsx"),
      `export function Button() {return <button/>;} ${extra}`,
    );
    await writeFile(
      join(directory, "index.ts"),
      `export * from './component'; export type Props={label:string}; export const spacing={small:4};`,
    );
    await writeFile(join(directory, filename), source);
    await run({ indexPath: join(directory, "index.ts"), directory });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("accepts dedicated metadata and state examples, ignoring tokens and types", async () => {
  await fixture((options) => {
    const result = checkStories(options);
    assert.deepEqual(result.errors, []);
    assert.deepEqual(
      result.stories.map(({ component, exports }) => ({ component, exports })),
      [{ component: "Button", exports: ["Default", "Disabled"] }],
    );
  });
});
test("a new public component fails until it gets a dedicated story", async () => {
  await fixture(
    (options) =>
      assert.match(
        checkStories(options).errors.join("\n"),
        /Toggle: require exactly one/,
      ),
    { extra: "export const Toggle = () => <button/>;" },
  );
});
for (const [label, source, error] of [
  [
    "wrong metadata component",
    valid.replace("component:Button", "component:() => <span/>"),
    /matching named import/,
  ],
  [
    "direct implementation import",
    valid.replace("'./index'", "'./component'"),
    /matching named import/,
  ],
  [
    "local impostor",
    valid.replace(
      "import { Button } from './index';",
      "const Button=()=> <button/>;",
    ),
    /matching named import/,
  ],
  [
    "type-only import",
    valid.replace("import { Button }", "import type { Button }"),
    /matching named import/,
  ],
  [
    "missing default metadata",
    valid.replace("export default meta;", ""),
    /explicit default/,
  ],
  [
    "unrelated sidebar title",
    valid.replace("Actions/Button", "Verification/Contracts"),
    /title must end/,
  ],
  ["missing autodocs", valid.replace("['autodocs']", "[]"), /enable autodocs/],
  [
    "missing Default",
    valid.replace("export const Default = {};", ""),
    /Default CSF story/,
  ],
  [
    "non-story Default",
    valid.replace("Default = {}", "Default = 'placeholder'"),
    /Default CSF story/,
  ],
  [
    "no state or composition examples",
    valid.replace("export const Disabled = {args:{disabled:true}};", ""),
    /alongside Default/,
  ],
  [
    "opaque metadata spread",
    valid.replace("component:Button", "...{component:Button}"),
    /metadata spreads/,
  ],
]) {
  test(`rejects ${label}`, async () => {
    await fixture(
      (options) => assert.match(checkStories(options).errors.join("\n"), error),
      { source },
    );
  });
}
test("group stories do not substitute for a dedicated component file", async () => {
  await fixture(
    (options) =>
      assert.match(
        checkStories(options).errors.join("\n"),
        /require exactly one/,
      ),
    { filename: "Controls.stories.tsx" },
  );
});
test("duplicate dedicated files are rejected", async () => {
  await fixture(async (options) => {
    await mkdir(join(options.directory, "nested"));
    await writeFile(
      join(options.directory, "nested/Button.stories.tsx"),
      valid,
    );
    assert.match(
      checkStories(options).errors.join("\n"),
      /require exactly one/,
    );
  });
});
test("aliases still refer to the actual public component", async () => {
  await fixture(
    (options) => assert.deepEqual(checkStories(options).errors, []),
    {
      source: valid
        .replace("{ Button }", "{ Button as Action }")
        .replace("component:Button", "component:Action"),
    },
  );
});
test("missing or empty entry points fail closed", async () => {
  assert.match(
    checkStories({
      indexPath: "/missing/index.ts",
      directory: "/missing",
    }).errors.join("\n"),
    /entry point/,
  );
  await fixture(async (options) => {
    await writeFile(options.indexPath, "export const spacing={small:4};");
    assert.match(
      checkStories(options).errors.join("\n"),
      /No public component/,
    );
  });
});
const manifest = [
  {
    component: "Button",
    path: "src/stories/catalogue/Button.stories.tsx",
    title: "Actions/Button",
    exports: ["Default", "Disabled"],
  },
];
const entries = {
  default: {
    type: "story",
    title: "Actions/Button",
    importPath: "./src/stories/catalogue/Button.stories.tsx",
    exportName: "Default",
    id: "actions-button--default",
  },
  disabled: {
    type: "story",
    title: "Actions/Button",
    importPath: "./src/stories/catalogue/Button.stories.tsx",
    exportName: "Disabled",
    id: "actions-button--disabled",
  },
  docs: {
    type: "docs",
    title: "Actions/Button",
    importPath: "./src/stories/catalogue/Button.stories.tsx",
    id: "actions-button--docs",
  },
};
test("requires every source example and autodocs to appear in the built index", () => {
  assert.deepEqual(checkBuiltStories(manifest, { entries }).errors, []);
  for (const omitted of ["default", "disabled", "docs"]) {
    const remaining = Object.fromEntries(
      Object.entries(entries).filter(([key]) => key !== omitted),
    );
    assert.equal(
      checkBuiltStories(manifest, { entries: remaining }).errors.length,
      1,
    );
  }
});
test("unrelated and duplicate built entries cannot satisfy coverage", () => {
  const wrong = Object.fromEntries(
    Object.entries(entries).map(([key, value]) => [
      key,
      { ...value, importPath: "./src/stories/catalogue/Controls.stories.tsx" },
    ]),
  );
  assert.equal(
    checkBuiltStories(manifest, { entries: wrong }).errors.length,
    3,
  );
  assert.match(
    checkBuiltStories(manifest, {
      entries: { ...entries, duplicate: entries.default },
    }).errors.join("\n"),
    /Default exactly once/,
  );
  assert.equal(checkBuiltStories(manifest, {}).errors.length, 3);
});

for (const render of ["() => <p>TODO</p>", "() => null", "() => <Unused />"]) {
  test(`rejects a custom renderer that omits its component: ${render}`, async () => {
    await fixture(
      (options) =>
        assert.match(
          checkStories(options).errors.join("\n"),
          /custom render must render Button/,
        ),
      {
        source:
          valid.replace("Default = {}", `Default = {render: ${render}}`) +
          " function Unused() {return <p>TODO</p>;} function Uncalled() {return <Button/>;}",
      },
    );
  });
}
test("checks metadata render and method syntax, including variant overrides", async () => {
  await fixture(
    (options) =>
      assert.match(
        checkStories(options).errors.join("\n"),
        /custom render must render Button/,
      ),
    {
      source: valid.replace(
        "tags:['autodocs']",
        "tags:['autodocs'],render() {return <p>TODO</p>;}",
      ),
    },
  );
  await fixture(
    (options) => assert.deepEqual(checkStories(options).errors, []),
    {
      source: valid.replace(
        "tags:['autodocs']",
        "tags:['autodocs'],render() {return <Button/>;}",
      ),
    },
  );
});
test("follows local render helpers and ignores an unused component helper", async () => {
  await fixture(
    (options) => assert.deepEqual(checkStories(options).errors, []),
    {
      source:
        valid.replace("Default = {}", "Default = {render: () => <Example/>}") +
        " function Example() {return draw();} function draw() {return <Button/>;}",
    },
  );
});
test("rejects opaque story spreads that could override rendering", async () => {
  await fixture(
    (options) =>
      assert.match(checkStories(options).errors.join("\n"), /no story spreads/),
    {
      source: valid.replace(
        "Default = {}",
        "Default = {...{render: () => null}}",
      ),
    },
  );
});

for (const helper of [
  "function Unused(){return <Button/>}",
  "const Unused=()=> <Button/>;",
]) {
  test(`unused renderer-local helpers do not count: ${helper}`, async () => {
    await fixture(
      (options) =>
        assert.match(
          checkStories(options).errors.join("\n"),
          /custom render must render Button/,
        ),
      {
        source: valid.replace(
          "Default = {}",
          `Default = {render:()=>{${helper};return <p>TODO</p>}}`,
        ),
      },
    );
  });
}
for (const output of ["<p>TODO</p>", "<Button/>"]) {
  test(`checks shorthand render property returning ${output}`, async () => {
    await fixture(
      (options) => {
        const errors = checkStories(options).errors;
        if (output === "<Button/>") assert.deepEqual(errors, []);
        else
          assert.match(errors.join("\n"), /custom render must render Button/);
      },
      {
        source:
          `const render = () => ${output}; ` +
          valid.replace("Default = {}", "Default = {render}"),
      },
    );
  });
}
test("follows callbacks used to render component collections", async () => {
  await fixture(
    (options) => assert.deepEqual(checkStories(options).errors, []),
    {
      source: valid.replace(
        "Default = {}",
        "Default = {render: () => <>{[1,2].map(value => <Button key={value}/>)}</>}",
      ),
    },
  );
});
test("rejects accessor metadata that hides its renderer", async () => {
  await fixture(
    (options) =>
      assert.match(checkStories(options).errors.join("\n"), /explicit default/),
    {
      source: valid.replace(
        "tags:['autodocs']",
        "tags:['autodocs'],get render(){return () => <p>TODO</p>}",
      ),
    },
  );
});

test("rejects computed render keys that hide custom rendering", async () => {
  await fixture(
    (options) =>
      assert.match(checkStories(options).errors.join("\n"), /computed keys/),
    {
      source: valid.replace(
        "Default = {}",
        "Default = {['render']: () => <p>TODO</p>}",
      ),
    },
  );
  await fixture(
    (options) =>
      assert.match(checkStories(options).errors.join("\n"), /computed keys/),
    {
      source: valid.replace(
        "tags:['autodocs']",
        "tags:['autodocs'],['render']: () => <p>TODO</p>",
      ),
    },
  );
});
