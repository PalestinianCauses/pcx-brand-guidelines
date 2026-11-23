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
// on the released commit by the last step, after all checks.
const PATTERN_STATUS =
  /\n {8}run: pnpm check\n[\s\S]+statuses\/\$\{\{ github\.sha \}\}\n[\s\S]+-f state=success\n\s+-f context=released\n[^\n]+\n$/;

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
