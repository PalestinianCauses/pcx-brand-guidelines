// Runs the guards on the pull request that GitHub is checking, on the current
// branch of this computer, or on a release. A release is meant when
// GUARD_VERSION is set.

import { existsSync, readFileSync } from "fs";

import { runGit } from "./commands";
import {
  inspectBranch,
  inspectCommit,
  inspectCurrentBranch,
  inspectDeploys,
  inspectDescription,
  inspectRelease,
  inspectTitle,
  inspectVersionFile,
  inspectVersions,
} from "./guards";

const BASE_DEFAULT = "origin/main";
const HEAD_DEFAULT = "HEAD";

// The settings file of the host. Only a project with a page has one.
const FILE_HOST = "vercel.json";

// The file that holds the version of a project whose code has to know it.
const FILE_VERSION = "VERSION";

const getBranch = function getBranch(): string {
  const branch = runGit(["rev-parse", "--abbrev-ref", HEAD_DEFAULT]);
  return branch;
};

const getCommits = function getCommits(base: string, head: string): string[] {
  const output = runGit([
    "log",
    "--no-merges",
    ["--format", "%s"].join("="),
    [base, head].join(".."),
  ]);

  return output.split("\n").filter((subject) => subject !== "");
};

// A commit is on the main branch when the two meet at the commit itself.
const isOnMain = function isOnMain(commit: string): boolean {
  const commitMeeting = runGit(["merge-base", commit, BASE_DEFAULT]);
  const commitFull = runGit(["rev-parse", [commit, "{commit}"].join("^")]);
  const isOn = commitMeeting === commitFull;

  return isOn;
};

// The guards on the files of the project. They hold for a pull request and for
// a release.
const inspectFiles = function inspectFiles(): string[] {
  const problems = [
    ...inspectVersions(readFileSync("package.json", "utf8")),
    ...(existsSync(FILE_HOST)
      ? inspectDeploys(readFileSync(FILE_HOST, "utf8"))
      : []),
  ];

  return problems;
};

const runGuardsRelease = function runGuardsRelease(version: string): string[] {
  const { GUARD_HEAD, GUARD_NOTES } = process.env;

  const problems = [
    ...inspectRelease(
      version,
      GUARD_NOTES || "",
      isOnMain(GUARD_HEAD || HEAD_DEFAULT),
    ),
    ...(existsSync(FILE_VERSION)
      ? inspectVersionFile(version, readFileSync(FILE_VERSION, "utf8"))
      : []),
    ...inspectFiles(),
  ];

  return problems;
};

const runGuards = function runGuards(): string[] {
  const {
    GUARD_BASE,
    GUARD_BRANCH,
    GUARD_DESCRIPTION,
    GUARD_HEAD,
    GUARD_TITLE,
  } = process.env;

  const commits = getCommits(
    GUARD_BASE || BASE_DEFAULT,
    GUARD_HEAD || HEAD_DEFAULT,
  );

  return [
    ...(GUARD_BRANCH
      ? inspectBranch(GUARD_BRANCH)
      : inspectCurrentBranch(getBranch())),
    ...commits.flatMap((subject) => inspectCommit(subject)),
    ...(GUARD_TITLE === undefined ? [] : inspectTitle(GUARD_TITLE)),
    ...(GUARD_DESCRIPTION === undefined
      ? []
      : inspectDescription(GUARD_DESCRIPTION)),
    ...inspectFiles(),
  ];
};

const { GUARD_VERSION } = process.env;
const problems =
  GUARD_VERSION === undefined ? runGuards() : runGuardsRelease(GUARD_VERSION);

const report =
  problems.length === 0 ? ["The guards found no problem."] : problems;

process.stdout.write([...report, ""].join("\n"));
process.exitCode = problems.length === 0 ? 0 : 1;
