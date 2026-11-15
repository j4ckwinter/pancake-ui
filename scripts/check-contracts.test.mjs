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
    `${source.replace('test("', 'function unregistered(){test("')}}`,
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
  const textSource = source.replaceAll("Button:", "Text:");
  const rejectedCategories = (contract) =>
    checkContracts(["Text"], { Text: contract }, textSource).map(
      (error) => error.split(":")[0],
    );
  assert.deepEqual(
    rejectedCategories({
      ...passive,
      semantics: {
        notApplicable: "Presentation component has no keyboard interaction.",
      },
    }),
    ["Text.semantics"],
  );
  assert.deepEqual(
    rejectedCategories({ ...passive, keyboard: { notApplicable: "none" } }),
    ["Text.keyboard"],
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

test("requires contracts in each component's own discovered spec", () => {
  const path = "src/components/Button/Button.spec.ts";
  const colocated = source.replace(
    '"./fixtures"',
    '"../../../tests/contracts-fixture"',
  );
  assert.deepEqual(
    checkContracts(["Button"], { Button: contract }, { [path]: colocated }),
    [],
  );
  for (const files of [
    {},
    { "tests/contracts.spec.ts": source },
    { "src/components/Checkbox/Checkbox.spec.ts": colocated },
    { [path]: colocated.replace("expect(true).toBe(true);", "") },
    {
      [path]: colocated.replace(
        "../../../tests/contracts-fixture",
        "./fake-fixture",
      ),
    },
  ])
    assert(checkContracts(["Button"], { Button: contract }, files).length > 0);
});
