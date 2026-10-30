import { copyFile, cp, readFile, writeFile } from "node:fs/promises";
await copyFile("src/theme.css", "dist/theme.css");
await writeFile(
  "dist/fonts.css",
  (await readFile("src/fonts.css", "utf8")).replaceAll(
    "../assets/fonts/",
    "./fonts/",
  ),
);
await cp("assets/fonts", "dist/fonts", { recursive: true });
