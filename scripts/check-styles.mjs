import { readdir, readFile } from "node:fs/promises";
import { checkCss } from "./style-css.mjs";
import { checkTsx } from "./style-tsx.mjs";

async function inspect(directory) {
  const results = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (file === "src/stories") continue;
    if (entry.isDirectory()) {
      results.push(...(await inspect(file)));
      continue;
    }
    if (/\.(?:stories|spec)\.[jt]sx?$/.test(file)) continue;
    if (
      file === "src/foundations/theme.css" ||
      file === "src/foundations/fonts.css" ||
      file === "src/foundations/tokens.ts"
    )
      continue;
    const checker = file.endsWith(".css")
      ? checkCss
      : /\.[jt]sx?$/.test(file)
        ? checkTsx
        : undefined;
    if (checker) results.push(...checker(await readFile(file, "utf8"), file));
  }
  return results;
}

const diagnostics = await inspect("src");
if (diagnostics.length) {
  console.error(diagnostics.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Library styling follows the token and namespace rules.");
}
