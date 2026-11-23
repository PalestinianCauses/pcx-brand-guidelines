// The release command. It publishes a release that is prepared as a draft on
// GitHub, waits for the release run on GitHub, and then moves the production
// branch of a project with a page to the released commit. It runs in a folder
// that is at the commit of the release.
//
//   pnpm release v1.2.4
//
// The order of the steps is in release.ts. This file holds the steps
// themselves: what is asked of git and GitHub.

import { spawnSync } from "child_process";
import { setTimeout as wait } from "timers/promises";

import { isInCommit, runGit, runGitHub } from "./commands";
import {
  joinRuns,
  runRelease,
  selectRelease,
  type Draft,
  type Release,
  type Run,
  type Steps,
} from "./release";

const BRANCH_LIVE = "production";

// The settings file of the host. Only a project with a page has one.
const FILE_HOST = "vercel.json";

// The run of the release workflow, as GitHub's list of runs is asked for it.
const FILTER_RUN = ["check_name", "release"].join("=");

const PATH_COMMITS = "repos/{owner}/{repo}/commits";
const PATH_RELEASES = "repos/{owner}/{repo}/releases";

// The release run is asked for every 10 seconds.
const INTERVAL = 10_000;

const getCommit = function getCommit(version: string): string {
  const path = [PATH_COMMITS, version].join("/");
  const commit = runGitHub(["api", path, "--jq", ".sha"]);

  return commit;
};

// What git says about this folder and about the tag of the draft on GitHub.
const getDraft = function getDraft(release: Release): Draft {
  const tag = ["refs", "tags", release.tag_name].join("/");

  const draft = {
    changes: runGit(["status", "--porcelain"]),
    commitHead: runGit(["rev-parse", "HEAD"]),
    commitTarget: release.target_commitish,
    tagRemote: runGit(["ls-remote", "--tags", "origin", tag]),
    version: release.tag_name,
  };

  return draft;
};

// GitHub lists drafts among the releases. Every page of the list is read.
const getRelease = function getRelease(version: string): Release | undefined {
  const answer = runGitHub(["api", "--paginate", "--slurp", PATH_RELEASES]);
  const release = selectRelease(JSON.parse(answer) as Release[][], version);

  return release;
};

const getRuns = function getRuns(commit: string): Run[] {
  const answer = runGitHub([
    "api",
    "--method",
    "GET",
    "--paginate",
    "--slurp",
    [PATH_COMMITS, commit, "check-runs"].join("/"),
    "--field",
    FILTER_RUN,
  ]);

  const runs = joinRuns(JSON.parse(answer) as { check_runs: Run[] }[]);
  return runs;
};

// The guards run on the draft first. A release that would fail them is not
// published, because a published version stays.
const isDraftSound = function isDraftSound(draft: Release): boolean {
  const { status } = spawnSync("pnpm", ["guards"], {
    env: {
      ...process.env,
      GUARD_HEAD: draft.target_commitish,
      GUARD_NOTES: draft.body || "",
      GUARD_VERSION: draft.tag_name,
    },
    stdio: "inherit",
  });

  return status === 0;
};

// A project with a page has the settings file of the host in the released
// commit.
const isHosted = function isHosted(commit: string): boolean {
  const isIn = isInCommit(FILE_HOST, commit);
  return isIn;
};

const moveLive = function moveLive(commit: string): void {
  const branch = ["refs", "heads", BRANCH_LIVE].join("/");
  runGit(["push", "--quiet", "origin", [commit, branch].join(":")]);
};

const publish = function publish(draft: Release): void {
  runGitHub([
    "api",
    "--method",
    "PATCH",
    [PATH_RELEASES, draft.id].join("/"),
    "--field",
    ["draft", "false"].join("="),
  ]);
};

// The main branch and the released commit are read from GitHub.
const refresh = function refresh(): void {
  runGit(["fetch", "--quiet", "origin"]);
};

const say = function say(line: string): void {
  process.stdout.write([line, ""].join("\n"));
};

const steps: Steps = {
  getCommit,
  getDraft,
  getRelease,
  getRuns,
  isDraftSound,
  isHosted,
  moveLive,
  publish,
  refresh,
  say,
  wait: () => wait(INTERVAL),
};

runRelease(process.argv[2], steps).then((problems) => {
  process.stdout.write(problems.map((problem) => `${problem}\n`).join(""));
  process.exitCode = problems.length === 0 ? 0 : 1;
});
