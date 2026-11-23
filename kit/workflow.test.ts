import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const FILE_CHECKS = ".github/workflows/checks.yml";
const FILE_RELEASE = ".github/workflows/release.yml";
const FILES_WORKFLOW = [FILE_CHECKS, FILE_RELEASE];

// The checkout step, then its settings, with the credentials setting among
// them.
const PATTERN_CHECKOUT =
  /uses: actions\/checkout@[0-9a-f]{40}\n\s+with:\n(?:\s+[a-z-]+: .+\n)*?\s+persist-credentials: false\n/;

// A workflow that may write to the repository could move a branch or a
// version on its own. The checks workflow may only read. The release workflow
// may also put a status on a commit, and nothing else.
const PATTERN_PERMISSIONS = /\npermissions:\n {2}contents: read\n\n/;
const PATTERN_PERMISSIONS_RELEASE =
  /\npermissions:\n {2}contents: read\n {2}statuses: write\n\n/;

// What the release workflow hands to the guards: the released commit, the
// notes and the version.
const PATTERNS_RELEASE = [
  /\non:\n {2}release:\n {4}types: \[published\]\n/,
  /\n {6}GUARD_HEAD: \$\{\{ github\.sha \}\}\n/,
  /\n {6}GUARD_NOTES: \$\{\{ github\.event\.release\.body \}\}\n/,
  /\n {6}GUARD_VERSION: \$\{\{ github\.event\.release\.tag_name \}\}\n/,
  /\n {8}run: pnpm check\n/,
];

// The status that GitHub's rule for the production branch asks for. It is put
// on the released commit by the last step of the release job, after all
// checks. The publish job is what follows it.
const PATTERN_STATUS =
  /\n {8}run: pnpm check\n[\s\S]+statuses\/\$\{\{ github\.sha \}\}\n[\s\S]+-f state=success\n\s+-f context=released\n[^\n]+\n\n(?: {2}#[^\n]*\n)+ {2}publish:\n/;

// The publish job: it waits for the release job, it may only read the
// repository, and it finds out whether the project is a package.
const PATTERN_PUBLISH =
  /\n {2}publish:\n {4}name: publish\n {4}needs: release\n[\s\S]+?\n {4}permissions:\n {6}contents: read\n {4}env:\n/;
const PATTERN_PACKAGE =
  /\n {8}id: package\n[\s\S]+?\.publishConfig\.access == "public" and \.private != true/;

// A step of the publish job that only a package runs, and a step in all.
const PATTERN_STEP_PACKAGE =
  /\n {8}if: steps\.package\.outputs\.is_package == 'true'\n/g;
const PATTERN_STEP = /\n {6}- /g;

// The key of npm, and the one step that may hold it.
const PATTERN_KEY = /secrets\.NPM_TOKEN/g;
const PATTERN_KEY_STEP =
  /\n {6}- name: Publish the package to npm\n {8}if: [^\n]+\n {8}env:\n {10}NODE_AUTH_TOKEN: \$\{\{ secrets\.NPM_TOKEN \}\}\n {8}run: pnpm publish --no-git-checks\n$/;

const PATTERN_CHECKOUTS = /uses: actions\/checkout@/g;
const PATTERN_CREDENTIALS = /persist-credentials: false/g;

FILES_WORKFLOW.forEach((file) => {
  test(`${file} does not keep the token of the checkout step`, async () => {
    const text = await readFile(file, "utf8");
    assert.match(text, PATTERN_CHECKOUT);
  });
});

test("the checks workflow may only read the repository", async () => {
  const text = await readFile(FILE_CHECKS, "utf8");
  assert.match(text, PATTERN_PERMISSIONS);
});

test("the release workflow may read the repository and put a status on a commit", async () => {
  const text = await readFile(FILE_RELEASE, "utf8");
  assert.match(text, PATTERN_PERMISSIONS_RELEASE);
});

test("the release workflow runs all checks on a published release", async () => {
  const text = await readFile(FILE_RELEASE, "utf8");

  PATTERNS_RELEASE.forEach((pattern) => assert.match(text, pattern));
});

test("the release workflow marks the commit as released after all checks", async () => {
  const text = await readFile(FILE_RELEASE, "utf8");
  assert.match(text, PATTERN_STATUS);
});

FILES_WORKFLOW.forEach((file) => {
  test(`every checkout step of ${file} leaves its token out`, async () => {
    const text = await readFile(file, "utf8");
    const checkouts = text.match(PATTERN_CHECKOUTS) || [];
    const credentials = text.match(PATTERN_CREDENTIALS) || [];

    assert.ok(checkouts.length > 0);
    assert.equal(credentials.length, checkouts.length);
  });
});

test("the publish job waits for the release job and may only read the repository", async () => {
  const text = await readFile(FILE_RELEASE, "utf8");
  assert.match(text, PATTERN_PUBLISH);
});

test("the publish job asks package.json whether the project is a package", async () => {
  const text = await readFile(FILE_RELEASE, "utf8");
  assert.match(text, PATTERN_PACKAGE);
});

test("every step of the publish job after the first two runs for a package only", async () => {
  const text = await readFile(FILE_RELEASE, "utf8");
  const [, job] = text.split("\n  publish:\n");
  const steps = job.match(PATTERN_STEP) || [];
  const stepsPackage = job.match(PATTERN_STEP_PACKAGE) || [];

  assert.equal(steps.length, 8);
  assert.equal(stepsPackage.length, steps.length - 2);
});

test("only the last step of the release workflow holds the key of npm", async () => {
  const text = await readFile(FILE_RELEASE, "utf8");
  const keys = text.match(PATTERN_KEY) || [];

  assert.equal(keys.length, 1);
  assert.match(text, PATTERN_KEY_STEP);
});

test("the checks workflow holds no key of npm", async () => {
  const text = await readFile(FILE_CHECKS, "utf8");
  assert.doesNotMatch(text, PATTERN_KEY);
});
