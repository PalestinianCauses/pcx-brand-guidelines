// Runs git and GitHub's command line tool, and returns what they print.

import { execFileSync } from "child_process";

// git runs in this folder, or in the folder that is named.
export const runGit = function runGit(
  options: string[],
  folder?: string,
): string {
  const output = execFileSync("git", options, {
    cwd: folder,
    encoding: "utf8",
  });

  return output.trim();
};

export const runGitHub = function runGitHub(options: string[]): string {
  const output = execFileSync("gh", options, { encoding: "utf8" });
  return output.trim();
};

// Whether a commit has a file. The file is looked for in the commit, not in
// the folder. git prints the name of the file when the commit has it.
export const isInCommit = function isInCommit(
  file: string,
  commit: string,
  folder?: string,
): boolean {
  const name = runGit(["ls-tree", "--name-only", commit, file], folder);
  return name !== "";
};
