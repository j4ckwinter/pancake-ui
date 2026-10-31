import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

export function assertSuccessfulJobs(needs) {
  for (const job of ["checks", "build", "browsers"]) {
    assert.equal(needs?.[job]?.result, "success", `${job} did not succeed`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  assertSuccessfulJobs(JSON.parse(process.env.NEEDS_RESULTS ?? "null"));
