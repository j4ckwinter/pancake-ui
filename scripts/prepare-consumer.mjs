import { execFileSync } from "node:child_process";
import { cp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
const run = (args, cwd = process.cwd()) =>
  execFileSync("npm", args, { cwd, stdio: "inherit" });
await mkdir("artifacts", { recursive: true });
const packResult = JSON.parse(
  execFileSync("npm", ["pack", "--json", "--pack-destination", "artifacts"], {
    encoding: "utf8",
  }),
);
const packed = Array.isArray(packResult)
  ? packResult[0]
  : packResult["pancake-ui"];
const consumer = resolve(".tmp/consumer");
await rm(consumer, { recursive: true, force: true });
await cp("examples/web", consumer, {
  recursive: true,
  filter: (path) =>
    !/(?:^|\/)(node_modules|dist|package-lock.json)(?:\/|$)/.test(path),
});
const manifest = JSON.parse(await readFile(`${consumer}/package.json`, "utf8"));
manifest.dependencies["pancake-ui"] =
  `file:${resolve("artifacts", packed.filename)}`;
await writeFile(`${consumer}/package.json`, JSON.stringify(manifest, null, 2));
run(["install", "--ignore-scripts", "--no-audit", "--no-fund"], consumer);
run(["run", "build"], consumer);
