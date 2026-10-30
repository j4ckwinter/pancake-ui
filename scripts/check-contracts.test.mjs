import assert from "node:assert/strict";
import test from "node:test";
import { checkContracts } from "./check-contracts.mjs";
const source = `import {test, expect} from "./fixtures";
test("Button: contracts", async () => { expect(true).toBe(true); });`;
const contract = Object.fromEntries(
  ["semantics", "keyboard", "state", "form", "ref"].map((name) => [
    name,
    { test: "Button: contracts" },
  ]),
);
test("requires every new public component to have contracts", () => {
  assert.deepEqual(
    checkContracts(["Button"], { Button: contract }, source),
    [],
  );
  assert.match(
    checkContracts(
      ["Button", "NewControl"],
      { Button: contract },
      source,
    ).join(),
    /NewControl/,
  );
});
test("rejects missing, focused, nested and assertion-free test references", () => {
  for (const candidate of [
    "",
    source.replace('test("', 'test.only("'),
    source.replace("expect(true).toBe(true);", ""),
    `function unregistered(){${source.replace('import {test, expect} from "./fixtures";', "")}}`,
  ]) {
    assert.ok(
      checkContracts(["Button"], { Button: contract }, candidate).length,
    );
  }
});
test("requires semantics tests and specific non-applicability explanations", () => {
  const passive = {
    ...Object.fromEntries(
      Object.entries(contract).map(([key]) => [
        key,
        { test: "Text: contracts" },
      ]),
    ),
    keyboard: {
      notApplicable: "Presentation component has no keyboard interaction.",
    },
  };
  assert.deepEqual(
    checkContracts(
      ["Text"],
      { Text: passive },
      source.replaceAll("Button:", "Text:"),
    ),
    [],
  );
  assert.ok(
    checkContracts(
      ["Text"],
      {
        Text: {
          ...passive,
          semantics: {
            notApplicable:
              "Presentation component has no keyboard interaction.",
          },
        },
      },
      source,
    ).length,
  );
  assert.ok(
    checkContracts(
      ["Text"],
      { Text: { ...passive, keyboard: { notApplicable: "none" } } },
      source,
    ).length,
  );
});
test("rejects stale component contracts", () => {
  assert.match(
    checkContracts([], { Button: contract }, source).join(),
    /no public component/,
  );
});

test("rejects reusing another component's contract without a component-specific witness", () => {
  assert.ok(
    checkContracts(["NewControl"], { NewControl: contract }, source).length,
  );
});
