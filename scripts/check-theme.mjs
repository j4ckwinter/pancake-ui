import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import { compile } from "tailwindcss";

const requireFromConsumer = createRequire(
  new URL("../.tmp/consumer/package.json", import.meta.url),
);
const theme = await readFile(
  requireFromConsumer.resolve("pancake-ui/theme.css"),
  "utf8",
);
const result = await compile(`${theme}\n@tailwind utilities;`);
const css = result.build([
  "bg-pancake-accent",
  "p-pancake-24",
  "text-pancake-body",
]);
for (const className of [
  "bg-pancake-accent",
  "p-pancake-24",
  "text-pancake-body",
]) {
  assert(
    css.includes(`.${className}`),
    `Installed theme did not generate ${className}`,
  );
}
await writeFile(".tmp/theme-proof.css", css);
console.log("Installed theme generates consumer Tailwind utilities.");
