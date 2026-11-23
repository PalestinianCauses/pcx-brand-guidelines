import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { isInCommit, runGit } from "./commands";

const FILE = "vercel.json";

// A commit in the throwaway repository needs an author, and takes no signing
// and no hooks from the settings of this computer.
const OPTIONS_COMMIT = [
  ["user.name", "Sample"],
  ["user.email", "sample@example.com"],
  ["commit.gpgsign", "false"],
  ["core.hooksPath", "/dev/null"],
].flatMap((setting) => ["-c", setting.join("=")]);

const makeCommit = function makeCommit(folder: string, subject: string) {
  runGit(
    [...OPTIONS_COMMIT, "commit", "--quiet", "--message", subject],
    folder,
  );

  const commit = runGit(["rev-parse", "HEAD"], folder);
  return commit;
};

test("a file is looked for in the commit, not in the folder", (context) => {
  const folder = mkdtempSync(join(tmpdir(), "pcx-dev-kit-"));
  context.after(() => rmSync(folder, { force: true, recursive: true }));

  runGit(["init", "--quiet"], folder);
  writeFileSync(join(folder, FILE), "{}");
  runGit(["add", FILE], folder);
  const commitFirst = makeCommit(folder, "With the file");

  runGit(["rm", "--quiet", FILE], folder);
  const commitSecond = makeCommit(folder, "Without the file");

  // The first commit has the file, and the folder does not.
  assert.equal(isInCommit(FILE, commitFirst, folder), true);

  // The second commit lacks the file, and the folder has it again.
  writeFileSync(join(folder, FILE), "{}");
  assert.equal(isInCommit(FILE, commitSecond, folder), false);
});
