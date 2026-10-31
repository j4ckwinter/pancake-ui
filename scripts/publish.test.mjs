import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { parse } from "yaml";
import { validateSource } from "./publish-source.mjs";
import { validatePublishArtifact } from "./publish-artifact.mjs";

const sha = "a".repeat(40);
const repository = "j4ckwinter/pancake-ui";
const source = {
  runId: "123",
  repository,
  sha,
  ref: "refs/heads/main",
  workflow: { id: 7, path: ".github/workflows/verify.yml" },
  main: { commit: { sha } },
  run: {
    id: 123,
    workflow_id: 7,
    path: ".github/workflows/verify.yml",
    repository: { full_name: repository },
    head_repository: { full_name: repository },
    event: "push",
    head_branch: "main",
    status: "completed",
    conclusion: "success",
    head_sha: sha,
  },
};
test("source gate accepts a successful Verify push on current main", () =>
  validateSource(source));
for (const [field, value] of Object.entries({
  id: 124,
  workflow_id: 8,
  path: ".github/workflows/other.yml",
  repository: { full_name: "fork/pancake-ui" },
  head_repository: { full_name: "fork/pancake-ui" },
  event: "pull_request",
  head_branch: "feature",
  status: "in_progress",
  conclusion: "failure",
  head_sha: "b".repeat(40),
})) {
  test(`source gate rejects changed ${field}`, () =>
    assert.throws(() =>
      validateSource({ ...source, run: { ...source.run, [field]: value } }),
    ));
}
test("source gate rejects untrusted dispatch and stale main", () => {
  for (const mutation of [
    { ref: "refs/heads/feature" },
    { runId: "123\nattack" },
    { repository: "fork/pancake-ui" },
    { main: { commit: { sha: "b".repeat(40) } } },
    { workflow: { id: 7, path: "wrong.yml" } },
  ])
    assert.throws(() => validateSource({ ...source, ...mutation }));
});

const manifest = {
  name: "@jack.winter/pancake-ui",
  version: "0.1.0",
  license: "MIT",
  repository: {
    type: "git",
    url: "git+https://github.com/j4ckwinter/pancake-ui.git",
  },
  publishConfig: { access: "public", registry: "https://registry.npmjs.org/" },
};
const license = "MIT License\nCopyright Example\n";
async function fixture(t, change = () => {}) {
  const root = await mkdtemp(join(tmpdir(), "pancake-publish-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const directory = join(root, "artifact");
  await mkdir(join(root, "package", "dist", "fonts"), { recursive: true });
  await mkdir(directory);
  const metadata = structuredClone(manifest);
  change(metadata);
  await writeFile(
    join(root, "package", "package.json"),
    JSON.stringify(metadata),
  );
  await writeFile(join(root, "package", "LICENSE"), license);
  await writeFile(
    join(root, "package", "dist", "fonts", "OFL.txt"),
    "Font license",
  );
  const files = ["package.json", "LICENSE", "dist/fonts/OFL.txt"];
  const filename = "jack.winter-pancake-ui-0.1.0.tgz";
  const archive = join(directory, filename);
  execFileSync(
    "tar",
    ["-czf", archive, ...files.map((file) => `package/${file}`)],
    { cwd: root },
  );
  const packed = {
    name: manifest.name,
    version: manifest.version,
    filename,
    files,
    sha256: createHash("sha256")
      .update(await readFile(archive))
      .digest("hex"),
  };
  const save = () =>
    writeFile(join(directory, "packed.json"), JSON.stringify(packed));
  await save();
  return { directory, archive, packed, save };
}
test("artifact gate accepts the unchanged tested archive", async (t) => {
  const { directory, archive } = await fixture(t);
  assert.equal(
    (await validatePublishArtifact(directory, manifest, license)).archive,
    archive,
  );
});
test("artifact gate rejects altered archive bytes", async (t) => {
  const { directory, archive } = await fixture(t);
  await writeFile(archive, "corrupt archive");
  await assert.rejects(
    validatePublishArtifact(directory, manifest, license),
    /SHA-256/,
  );
});
for (const [field, value] of Object.entries({
  name: "@other/pancake-ui",
  version: "9.0.0",
  filename: "../elsewhere.tgz",
  files: ["package.json"],
})) {
  test(`artifact gate rejects altered manifest ${field}`, async (t) => {
    const { directory, packed, save } = await fixture(t);
    packed[field] = value;
    await save();
    await assert.rejects(validatePublishArtifact(directory, manifest, license));
  });
}
for (const [field, value] of Object.entries({
  name: "@other/pancake-ui",
  version: "9.0.0",
  private: true,
  license: "UNLICENSED",
  repository: { url: "wrong" },
  publishConfig: { registry: "https://other.example" },
})) {
  test(`artifact gate rejects packed ${field} even with a valid checksum`, async (t) => {
    const { directory } = await fixture(t, (metadata) => {
      metadata[field] = value;
    });
    await assert.rejects(validatePublishArtifact(directory, manifest, license));
  });
}
test("artifact gate rejects unexpected files", async (t) => {
  const { directory } = await fixture(t);
  await writeFile(join(directory, "extra.tgz"), "unexpected");
  await assert.rejects(validatePublishArtifact(directory, manifest, license));
});
test("artifact gate rejects changed license text", async (t) => {
  const { directory } = await fixture(t);
  await assert.rejects(
    validatePublishArtifact(directory, manifest, "different license"),
  );
});

function checkWorkflow(workflow) {
  assert.deepEqual(Object.keys(workflow.on), ["workflow_dispatch"]);
  assert.equal(
    workflow.on.workflow_dispatch.inputs.verify_run_id.required,
    true,
  );
  assert.deepEqual(workflow.permissions, { contents: "read" });
  const job = workflow.jobs.publish;
  assert.equal(job.if, "github.ref == 'refs/heads/main'");
  assert.equal(job["runs-on"], "ubuntu-latest");
  assert.deepEqual(job.permissions, {
    contents: "read",
    actions: "read",
    "id-token": "write",
  });
  assert.equal(workflow.concurrency["cancel-in-progress"], false);
  const steps = job.steps;
  assert.deepEqual(steps.map((step) => step.run).filter(Boolean), [
    "npm install --global npm@11.5.1",
    "node scripts/publish-source.mjs",
    "node scripts/publish-artifact.mjs artifacts/publish",
    'npm publish "$ARCHIVE" --ignore-scripts --provenance --access public --registry https://registry.npmjs.org/',
  ]);
  const download = steps.find((step) =>
    step.uses?.startsWith("actions/download-artifact@"),
  );
  assert.equal(download.with.name, "pancake-ui-package");
  assert.equal(download.with["run-id"], "${{ steps.source.outputs.run-id }}");
  assert.equal(download.with.path, "artifacts/publish");
  assert(
    steps.findIndex((step) => step.id === "source") < steps.indexOf(download),
  );
  assert(
    steps.indexOf(download) < steps.findIndex((step) => step.id === "artifact"),
  );
  assert.equal(
    steps.at(-1).env.ARCHIVE,
    "${{ steps.artifact.outputs.archive }}",
  );
  assert(!job["continue-on-error"]);
  for (const step of steps) {
    assert(!step["continue-on-error"]);
    assert(!step.if);
  }
}
const workflow = parse(
  await readFile(
    new URL("../.github/workflows/publish.yml", import.meta.url),
    "utf8",
  ),
);
test("workflow publishes only the checked artifact with OIDC", () =>
  checkWorkflow(workflow));
for (const [label, mutate] of [
  [
    "rebuild",
    (job) => {
      job.steps.at(-1).run = "npm publish";
    },
  ],
  [
    "ignored failure",
    (job) => {
      job.steps.find((step) => step.id === "source")["continue-on-error"] =
        true;
    },
  ],
  [
    "wrong artifact run",
    (job) => {
      job.steps.find((step) =>
        step.uses?.startsWith("actions/download-artifact@"),
      ).with["run-id"] = "999";
    },
  ],
  [
    "unverified branch",
    (job) => {
      delete job.if;
    },
  ],
  [
    "self-hosted publishing",
    (job) => {
      job["runs-on"] = "self-hosted";
    },
  ],
])
  test(`workflow guardrail catches ${label}`, () => {
    const altered = structuredClone(workflow);
    mutate(altered.jobs.publish);
    assert.throws(() => checkWorkflow(altered));
  });
