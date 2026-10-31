import assert from "node:assert/strict";
import { appendFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export function validateSource({
  run,
  workflow,
  main,
  repository,
  runId,
  sha,
  ref,
}) {
  assert.match(runId, /^[1-9]\d*$/, "Expected a numeric Verify run ID");
  assert.equal(repository, "j4ckwinter/pancake-ui");
  assert.equal(ref, "refs/heads/main", "Publish must be dispatched on main");
  assert.equal(String(run.id), runId);
  assert.equal(run.repository.full_name, repository);
  assert.equal(run.head_repository.full_name, repository);
  assert.equal(run.workflow_id, workflow.id);
  assert.equal(workflow.path, ".github/workflows/verify.yml");
  assert.equal(run.path, ".github/workflows/verify.yml");
  assert.equal(run.event, "push");
  assert.equal(run.head_branch, "main");
  assert.equal(run.status, "completed");
  assert.equal(run.conclusion, "success");
  assert.match(sha, /^[a-f0-9]{40}$/);
  assert.equal(run.head_sha, sha, "Verify must test the dispatched revision");
  assert.equal(main.commit.sha, sha, "Verify must test current main");
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const repository = process.env.GITHUB_REPOSITORY;
  const runId = process.env.VERIFY_RUN_ID;
  assert.match(runId ?? "", /^[1-9]\d*$/);
  const get = async (path) => {
    const response = await fetch(
      `https://api.github.com/repos/${repository}/${path}`,
      {
        headers: {
          authorization: `Bearer ${process.env.GH_TOKEN}`,
          accept: "application/vnd.github+json",
        },
      },
    );
    assert(response.ok, `GitHub API request failed (${response.status})`);
    return response.json();
  };
  const [run, workflow, main] = await Promise.all([
    get(`actions/runs/${runId}`),
    get("actions/workflows/verify.yml"),
    get("branches/main"),
  ]);
  validateSource({
    run,
    workflow,
    main,
    repository,
    runId,
    sha: process.env.GITHUB_SHA,
    ref: process.env.GITHUB_REF,
  });
  await appendFile(process.env.GITHUB_OUTPUT, `run-id=${runId}\n`);
  console.log(`Verified successful main push ${runId} at ${run.head_sha}`);
}
