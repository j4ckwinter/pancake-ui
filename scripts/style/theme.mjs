import { readFileSync } from "node:fs";
import postcss from "postcss";

const theme = postcss.parse(
  readFileSync(
    new URL("../../src/foundations/theme.css", import.meta.url),
    "utf8",
  ),
);
export const themeVariables = new Set();
theme.walkDecls((declaration) => themeVariables.add(declaration.prop));
export const themeUtilities = new Set();
for (const variable of themeVariables) {
  const mappings = [
    ["--color-", ["bg-", "text-", "border-", "outline-", "fill-", "stroke-"]],
    [
      "--spacing-",
      [
        "p-",
        "px-",
        "py-",
        "pt-",
        "pr-",
        "pb-",
        "pl-",
        "ps-",
        "pe-",
        "m-",
        "mx-",
        "my-",
        "mt-",
        "mr-",
        "mb-",
        "ml-",
        "ms-",
        "me-",
        "gap-",
        "gap-x-",
        "gap-y-",
        "w-",
        "h-",
        "size-",
        "min-w-",
        "min-h-",
        "max-w-",
        "max-h-",
      ],
    ],
    ["--radius-", ["rounded-"]],
    ["--font-", ["font-"]],
    ["--text-", ["text-"]],
  ];
  for (const [prefix, utilities] of mappings) {
    if (
      variable.startsWith(prefix) &&
      !variable.slice(prefix.length).includes("--")
    ) {
      for (const utility of utilities)
        themeUtilities.add(utility + variable.slice(prefix.length));
    }
  }
}
