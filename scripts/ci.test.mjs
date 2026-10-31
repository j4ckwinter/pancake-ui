import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parse } from "yaml";
import { assertSuccessfulJobs } from "./check-ci-results.mjs";

const success = {
  checks: { result: "success" },
  build: { result: "success" },
  browsers: { result: "success" },
};

test("CI gate accepts all successful jobs", () => {
  assertSuccessfulJobs(success);
});
for (const job of Object.keys(success)) {
  for (const result of ["failure", "cancelled", "skipped", undefined]) {
    test(`CI gate rejects ${job}: ${result ?? "missing"}`, () => {
      assert.throws(() =>
        assertSuccessfulJobs({ ...success, [job]: { result } }),
      );
    });
  }
}
test("CI gate rejects absent job results", () => {
  for (const value of [null, {}, { checks: success.checks }])
    assert.throws(() => assertSuccessfulJobs(value));
});

function checkWorkflow(workflow) {
  const { checks, build, browsers, verify } = workflow.jobs;
  assert.deepEqual(workflow.on.push.branches, ["main"]);
  assert(Object.hasOwn(workflow.on, "pull_request"));
  assert.match(workflow.concurrency.group, /pull_request.number/);
  assert.equal(
    workflow.concurrency["cancel-in-progress"],
    "${{ github.event_name == 'pull_request' }}",
  );
  assert.equal(verify.if, "always()");
  assert.deepEqual([...verify.needs].sort(), Object.keys(success).sort());
  assert.equal(verify.steps[2].run, "node scripts/check-ci-results.mjs");
  assert.equal(verify.steps[2].env.NEEDS_RESULTS, "${{ toJSON(needs) }}");
  const runs = (job) => job.steps.map((step) => step.run).filter(Boolean);
  assert(runs(checks).includes("npm run check:source"));
  assert(runs(build).includes("npm run verify:build"));
  assert(runs(build).includes("npm run prepare:tests"));
  assert.equal(browsers.needs, "build");
  assert.equal(browsers["runs-on"], "xcode-27");
  assert.equal(browsers.strategy["fail-fast"], false);
  assert.deepEqual(
    browsers.strategy.matrix.include.map((entry) => entry.project).sort(),
    ["chromium", "firefox", "visual", "webkit"],
  );
  assert(
    runs(browsers).includes(
      "npx playwright test --project=${{ matrix.project }}",
    ),
  );
  const guardrails = browsers.steps.find(
    (step) => step.run === "npm run test:verification",
  );
  assert.equal(guardrails?.if, "matrix.project == 'chromium'");
  for (const job of Object.values(workflow.jobs)) {
    assert(!job["continue-on-error"]);
    for (const step of job.steps) assert(!step["continue-on-error"]);
  }
  for (const step of verify.steps.slice(3)) {
    assert.equal(
      step.if,
      "github.event_name == 'push' && github.ref == 'refs/heads/main'",
    );
  }
}

const workflow = parse(readFileSync(".github/workflows/verify.yml", "utf8"));
test("workflow retains complete coverage and a required failure gate", () => {
  checkWorkflow(workflow);
});
for (const [name, mutate] of [
  [
    "missing browser",
    (value) => value.jobs.browsers.strategy.matrix.include.pop(),
  ],
  ["skipped final gate", (value) => delete value.jobs.verify.if],
  [
    "ignored failure",
    (value) => (value.jobs.browsers["continue-on-error"] = true),
  ],
  ["missing dependency", (value) => value.jobs.verify.needs.pop()],
  [
    "missing test guardrails",
    (value) => {
      value.jobs.browsers.steps = value.jobs.browsers.steps.filter(
        (step) => step.run !== "npm run test:verification",
      );
    },
  ],
  ["duplicate push runs", (value) => delete value.on.push.branches],
  [
    "ungated package upload",
    (value) => (value.jobs.verify.steps.at(-1).if = "always()"),
  ],
]) {
  test(`workflow check rejects ${name}`, () => {
    const broken = structuredClone(workflow);
    mutate(broken);
    assert.throws(() => checkWorkflow(broken));
  });
}
