import assert from "node:assert/strict";
import test from "node:test";

import {
  getStateRun,
  inspectDraft,
  joinRuns,
  runRelease,
  selectRelease,
  type Draft,
  type Release,
  type Run,
  type Steps,
} from "./release";

const COMMIT = "0123456789abcdef0123456789abcdef01234567";
const COMMIT_OTHER = "89abcdef0123456789abcdef0123456789abcdef";
const TIME_PUBLISHED = "2026-11-21T17:30:00Z";

const DRAFT: Draft = {
  changes: "",
  commitHead: COMMIT,
  commitTarget: COMMIT,
  tagRemote: "",
  version: "v1.0.0",
};

const RELEASE: Release = {
  body: "Approved for release on 2026-11-22.",
  draft: true,
  html_url: "https://github.com/sample/sample/releases/tag/v1.0.0",
  id: 1,
  published_at: null,
  tag_name: "v1.0.0",
  target_commitish: COMMIT,
};

const RELEASE_PUBLISHED: Release = {
  ...RELEASE,
  draft: false,
  published_at: TIME_PUBLISHED,
};

const RUN: Run = {
  conclusion: "success",
  id: 2,
  name: "release",
  started_at: "2026-11-21T17:30:05Z",
  status: "completed",
};

// The steps of the release command, without git and GitHub. The log holds
// what the command did. A draft becomes a published release when it is
// published.
const makeSteps = function makeSteps(parts: Partial<Steps> = {}) {
  const log: string[] = [];
  const releases = [RELEASE];

  const steps: Steps = {
    getCommit: () => COMMIT,
    getDraft: () => DRAFT,
    getRelease: () => releases[releases.length - 1],
    getRuns: () => [RUN],
    isDraftSound: () => true,
    isHosted: () => true,
    moveLive: (commit) => {
      log.push(`move ${commit}`);
    },
    publish: () => {
      releases.push(RELEASE_PUBLISHED);
      log.push("publish");
    },
    refresh: () => undefined,
    say: () => undefined,
    wait: async () => {
      log.push("wait");
    },
    ...parts,
  };

  return { log, steps };
};

test("a release run that passed after the release was published passes", () => {
  assert.equal(getStateRun([RUN], TIME_PUBLISHED), "passed");
});

test("a commit without a release run is waited for", () => {
  const runs = [{ ...RUN, name: "checks" }];

  assert.equal(getStateRun([], TIME_PUBLISHED), "waiting");
  assert.equal(getStateRun(runs, TIME_PUBLISHED), "waiting");
});

test("a release run that has not ended is waited for", () => {
  const statuses = ["queued", "in_progress"];

  statuses.forEach((status) => {
    const runs = [{ ...RUN, conclusion: null, status }];

    assert.equal(getStateRun(runs, TIME_PUBLISHED), "waiting", status);
  });
});

test("a release run that ended in any other way fails", () => {
  const conclusions = ["failure", "cancelled", "timed_out", "skipped", null];

  conclusions.forEach((conclusion) => {
    const runs = [{ ...RUN, conclusion }];

    assert.equal(getStateRun(runs, TIME_PUBLISHED), "failed", `${conclusion}`);
  });
});

test("a run from before the release was published says nothing about it", () => {
  const runs = [{ ...RUN, started_at: "2026-11-20T09:00:00Z" }];

  assert.equal(getStateRun(runs, TIME_PUBLISHED), "waiting");
});

test("the newest release run decides", () => {
  const runFailed = { ...RUN, conclusion: "failure", id: 3 };

  assert.equal(getStateRun([RUN, runFailed], TIME_PUBLISHED), "failed");
  assert.equal(getStateRun([runFailed, RUN], TIME_PUBLISHED), "failed");
});

test("a draft on a later page of GitHub's answer is found", () => {
  const releaseOther = { ...RELEASE, id: 2, tag_name: "v0.9.0" };
  const pages = [[releaseOther], [RELEASE]];

  assert.equal(selectRelease(pages, "v1.0.0"), RELEASE);
  assert.equal(selectRelease(pages, "v2.0.0"), undefined);
  assert.equal(selectRelease([], "v1.0.0"), undefined);
});

test("the runs of every page of GitHub's answer are read", () => {
  const runOther = { ...RUN, id: 1, name: "checks" };
  const pages = [{ check_runs: [runOther] }, { check_runs: [RUN] }];

  assert.deepEqual(joinRuns(pages), [runOther, RUN]);
  assert.equal(getStateRun(joinRuns(pages), TIME_PUBLISHED), "passed");
});

test("a draft at the commit of this folder passes", () => {
  assert.deepEqual(inspectDraft(DRAFT), []);
});

test("a draft that names a branch in place of a commit is refused", () => {
  const targets = ["main", COMMIT.slice(0, 7), ""];

  targets.forEach((target) => {
    const problems = inspectDraft({ ...DRAFT, commitTarget: target });

    assert.match(problems[0], /in full/, target);
  });
});

test("a draft whose tag is on GitHub already is refused", () => {
  const tagRemote = [COMMIT_OTHER, "refs/tags/v1.0.0"].join("\t");
  const problems = inspectDraft({ ...DRAFT, tagRemote });

  assert.equal(problems.length, 1);
  assert.match(problems[0], /already has a tag/);
});

test("a folder at another commit than the draft is refused", () => {
  const problems = inspectDraft({ ...DRAFT, commitHead: COMMIT_OTHER });

  assert.equal(problems.length, 1);
  assert.match(problems[0], /not at the commit/);
});

test("a folder with changes that are not committed is refused", () => {
  const problems = inspectDraft({ ...DRAFT, changes: " M vercel.json" });

  assert.equal(problems.length, 1);
  assert.match(problems[0], /not committed/);
});

test("a sound draft is published, and the live branch moves after the run passed", async () => {
  const { log, steps } = makeSteps();

  assert.deepEqual(await runRelease("v1.0.0", steps), []);
  assert.deepEqual(log, ["publish", `move ${COMMIT}`]);
});

test("the release command stops without a version or without a release", async () => {
  const { log, steps } = makeSteps({ getRelease: () => undefined });

  assert.equal((await runRelease(undefined, steps)).length, 1);
  assert.equal((await runRelease("v1.0.0", steps)).length, 1);
  assert.deepEqual(log, []);
});

test("a draft in a folder at another commit is not published", async () => {
  const draft = { ...DRAFT, commitHead: COMMIT_OTHER };
  const { log, steps } = makeSteps({ getDraft: () => draft });
  const problems = await runRelease("v1.0.0", steps);

  assert.match(problems[0], /not at the commit/);
  assert.deepEqual(log, []);
});

test("a draft that fails the guards is not published", async () => {
  const { log, steps } = makeSteps({ isDraftSound: () => false });
  const problems = await runRelease("v1.0.0", steps);

  assert.match(problems[0], /was not published/);
  assert.deepEqual(log, []);
});

test("a release run that failed moves no branch", async () => {
  const runs = [{ ...RUN, conclusion: "failure" }];
  const { log, steps } = makeSteps({ getRuns: () => runs });
  const problems = await runRelease("v1.0.0", steps);

  assert.match(problems[0], /failed/);
  assert.deepEqual(log, ["publish"]);
});

test("a release run that does not end in time moves no branch", async () => {
  const { log, steps } = makeSteps({ getRuns: () => [] });
  const problems = await runRelease("v1.0.0", steps);
  const waits = log.filter((line) => line === "wait");

  assert.match(problems[0], /did not end in time/);
  assert.equal(waits.length, 90);
  assert.equal(log.includes(`move ${COMMIT}`), false);
});

test("a version that is published already is not published again", async () => {
  const { log, steps } = makeSteps({
    getDraft: () => ({ ...DRAFT, commitHead: COMMIT_OTHER }),
    getRelease: () => RELEASE_PUBLISHED,
    isDraftSound: () => false,
  });

  assert.deepEqual(await runRelease("v1.0.0", steps), []);
  assert.deepEqual(log, [`move ${COMMIT}`]);
});

test("a released commit without the settings file of the host moves no branch", async () => {
  const lines: string[] = [];
  const { log, steps } = makeSteps({
    isHosted: () => false,
    say: (line) => {
      lines.push(line);
    },
  });

  assert.deepEqual(await runRelease("v1.0.0", steps), []);
  assert.deepEqual(log, ["publish"]);
  assert.match(lines[lines.length - 1], /no branch was moved/);
});

test("nothing is asked of git before the version is known", async () => {
  const calls: string[] = [];
  const { steps } = makeSteps({
    refresh: () => {
      calls.push("refresh");
    },
  });

  await runRelease(undefined, steps);
  assert.deepEqual(calls, []);

  await runRelease("v1.0.0", steps);
  assert.deepEqual(calls, ["refresh"]);
});
