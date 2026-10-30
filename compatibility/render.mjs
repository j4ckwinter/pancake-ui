import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App.mjs";

assert.equal(typeof window, "undefined");
assert.equal(typeof document, "undefined");
const messages = [];
const originalError = console.error;
const originalWarn = console.warn;
let html;
try {
  console.error = (...args) => messages.push(args.map(String).join(" "));
  console.warn = (...args) => messages.push(args.map(String).join(" "));
  html = renderToString(createElement(App), {
    identifierPrefix: "compatibility-",
  });
} finally {
  console.error = originalError;
  console.warn = originalWarn;
}
assert.deepEqual(
  messages,
  [],
  "Server rendering must not emit React warnings.",
);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert(ids.length >= 3, "Server output must contain generated field IDs.");
assert.equal(
  new Set(ids).size,
  ids.length,
  "Server-generated IDs must be unique.",
);
for (const [, target] of html.matchAll(
  /\b(?:for|aria-describedby)="([^"]+)"/g,
)) {
  for (const id of target.split(" "))
    assert(ids.includes(id), `Missing associated server ID ${id}.`);
}
assert.match(html, /data-hydrated="no"/);
await writeFile(
  "index.html",
  `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Hydration compatibility</title></head><body><div id="root">${html}</div><script type="module" src="/client.mjs"></script></body></html>`,
);
console.log(
  "Installed archive server-rendered without a DOM; generated associations are valid.",
);
