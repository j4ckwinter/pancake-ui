import assert from "node:assert/strict";
import test from "node:test";
import { ESLint } from "eslint";
import { checkStructure } from "./check-structure.mjs";

const check = (path, source) => checkStructure({ [path]: source });
test("allows cohesive component, props and private helper", () => {
  assert.deepEqual(
    check(
      "src/components/Button/Button.tsx",
      "export type ButtonProps = {}; function Icon() {return <span/>;} export function Button(){return <button><Icon/></button>}",
    ),
    [],
  );
});
for (const [path, source] of [
  ["src/New.tsx", "export function New(){return <div/>}"],
  ["src/components/Thing.tsx", "export function Thing(){return <div/>}"],
  [
    "src/components/Group/Group.tsx",
    "export function Group(){return <div/>} export function Other(){return <div/>}",
  ],
  [
    "src/components/Button/Wrong.tsx",
    "export function Button(){return <button/>}",
  ],
  ["src/components/Button/Button.stories.tsx", "export const Default = {}"],
  ["src/components/Button/index.ts", 'export {Button} from "./Button";'],
  [
    "src/components/Button/Button.tsx",
    'import {Text} from "../../index"; export function Button(){return <Text/>}',
  ],
  [
    "src/components/Button/Button.tsx",
    'export {Text} from "../../index.ts"; export function Button(){return <button/>}',
  ],
  [
    "src/components/Button/Button.tsx",
    'import {Text} from "@jack.winter/pancake-ui"; export function Button(){return <Text/>}',
  ],
  [
    "src/components/Button/Button.tsx",
    'import "../../stories/Thing"; export function Button(){return <button/>}',
  ],
  ["src/foundations/tokens.ts", 'import "../components/Button/Button";'],
  [
    "src/components/Button/Button.tsx",
    'export function Button(){return import("../../../tests/fixtures");}',
  ],
]) {
  test(`rejects structural violation: ${path} ${source.slice(0, 45)}`, () =>
    assert(check(path, source).length > 0));
}
test("stories can compose the public API; runtime helpers use direct imports", () => {
  assert.deepEqual(
    checkStructure({
      "src/stories/contracts/FormContracts.tsx":
        'import {Button} from "../../index"; export function FormContracts(){return <Button/>}',
      "src/components/layout/layout.shared.ts":
        'import {spacing} from "../../foundations/tokens"; export const space = (key) => spacing[key];',
    }),
    [],
  );
});

test("public barrel cannot expose story fixtures as library components", () => {
  assert(
    check("src/index.ts", 'export { Demo } from "./stories/Demo";').length > 0,
  );
});
test("runtime file size backstop catches accumulating implementation", async () => {
  const [result] = await new ESLint().lintText(
    Array.from({ length: 181 }, (_, i) => `const value${i} = ${i};`).join(
      "\n",
    ) + "\nexport function Button(){return <button/>;}",
    { filePath: "src/components/Button/Button.tsx" },
  );
  assert(result.messages.some((message) => message.ruleId === "max-lines"));
});

test("value re-exports cannot hide additional public components", () => {
  assert(
    check(
      "src/components/Button/Button.tsx",
      'export function Button(){return <button/>} export {Checkbox} from "../Checkbox/Checkbox";',
    ).length > 0,
  );
  assert(
    check("src/components/layout/shared.ts", 'export * from "./Stack";')
      .length > 0,
  );
});

test("colocated specs require an owner and cannot enter runtime dependencies", () => {
  const owner = "src/components/Button/Button.tsx";
  const spec = "src/components/Button/Button.spec.ts";
  const files = {
    [owner]: "export function Button(){return <button/>}",
    [spec]: 'import {test} from "../../../tests/contracts-fixture";',
  };
  assert.deepEqual(checkStructure(files), []);
  assert(checkStructure({ [spec]: files[spec] }).length > 0);
  assert(
    checkStructure({
      ...files,
      [owner]: files[owner] + '\nimport "./Button.spec";',
    }).length > 0,
  );
  assert(
    checkStructure({
      ...files,
      "src/index.ts": 'export * from "./components/Button/Button.spec";',
    }).length > 0,
  );
});
