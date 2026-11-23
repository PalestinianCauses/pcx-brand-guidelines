// The release command: what it reads, and the order of what it does. Nothing
// here reaches git, GitHub or the network. The steps that do are handed in, so
// the tests can hand in their own.

const CONCLUSION_PASSED = "success";
const NAME_RUN = "release";
const PATTERN_COMMIT_FULL = /^[0-9a-f]{40}$/;
const STATUS_ENDED = "completed";

// The release run is asked for 90 times at most. The command waits 10 seconds
// between two times, which makes 15 minutes.
const TIMES_MAXIMUM = 90;

// A release, with the fields as GitHub names them.
export type Release = {
  body: string | null;
  draft: boolean;
  html_url: string;
  id: number;
  published_at: string | null;
  tag_name: string;
  target_commitish: string;
};

// A run of a commit, with the fields as GitHub names them.
export type Run = {
  conclusion: string | null;
  id: number;
  name: string;
  started_at: string;
  status: string;
};

// A draft, and what git says about this folder and about the tag on GitHub.
export type Draft = {
  changes: string;
  commitHead: string;
  commitTarget: string;
  tagRemote: string;
  version: string;
};

export type StateRun = "failed" | "passed" | "waiting";

// What the release command does to git and GitHub, and how it waits.
export type Steps = {
  getCommit: (version: string) => string;
  getDraft: (release: Release) => Draft;
  getRelease: (version: string) => Release | undefined;
  getRuns: (commit: string) => Run[];
  isDraftSound: (draft: Release) => boolean;
  isHosted: (commit: string) => boolean;
  moveLive: (commit: string) => void;
  publish: (draft: Release) => void;
  refresh: () => void;
  say: (line: string) => void;
  wait: () => Promise<void>;
};

// GitHub answers in pages. The draft may sit on any of them.
export const selectRelease = function selectRelease(
  pages: Release[][],
  version: string,
): Release | undefined {
  const release = pages.flat().find((element) => element.tag_name === version);
  return release;
};

export const joinRuns = function joinRuns(
  pages: { check_runs: Run[] }[],
): Run[] {
  const runs = pages.flatMap((page) => page.check_runs);
  return runs;
};

// The guards read the files of this folder, and GitHub tags the commit that
// the draft names. The two have to be the same commit. So the draft names its
// commit in full, GitHub has no tag of that version yet, and this folder is at
// that commit with nothing changed. GitHub ignores the commit of a draft whose
// tag exists already, and a branch name can move before the draft is
// published.
export const inspectDraft = function inspectDraft(draft: Draft): string[] {
  const { changes, commitHead, commitTarget, tagRemote, version } = draft;
  const problems: string[] = [];

  if (!PATTERN_COMMIT_FULL.test(commitTarget))
    problems.push(
      `The draft of ${version} does not name its commit in full, with all 40 characters.`,
    );

  if (tagRemote !== "")
    problems.push(
      `GitHub already has a tag ${version}. A draft brings its own tag.`,
    );

  if (commitHead !== commitTarget)
    problems.push(`This folder is not at the commit of ${version}.`);

  if (changes !== "")
    problems.push("This folder has changes that are not committed.");

  return problems;
};

// The newest release run that started after the release was published
// decides. A commit keeps its older runs, such as the run of an earlier
// version on the same commit, and those say nothing about this release.
export const getStateRun = function getStateRun(
  runs: Run[],
  timePublished: string,
): StateRun {
  const [runNewest] = runs
    .filter((run) => run.name === NAME_RUN)
    .filter((run) => run.started_at >= timePublished)
    .sort((first, second) => second.id - first.id);

  if (runNewest === undefined) return "waiting";
  if (runNewest.status !== STATUS_ENDED) return "waiting";
  if (runNewest.conclusion === CONCLUSION_PASSED) return "passed";

  return "failed";
};

const waitRun = async function waitRun(
  steps: Steps,
  commit: string,
  timePublished: string,
  timesLeft: number,
): Promise<StateRun> {
  const state = getStateRun(steps.getRuns(commit), timePublished);
  if (state !== "waiting" || timesLeft === 0) return state;

  await steps.wait();
  const stateNext = await waitRun(steps, commit, timePublished, timesLeft - 1);

  return stateNext;
};

// Publishes a draft, waits for the release run, and then moves the live branch
// of a project with a page. A version that is published already is not
// published again: the command goes on from the run.
export const runRelease = async function runRelease(
  version: string | undefined,
  steps: Steps,
): Promise<string[]> {
  if (version === undefined)
    return ["Name the version, such as: pnpm release v1.2.4"];

  // Nothing is asked of git or GitHub before the version is known.
  steps.refresh();

  const draft = steps.getRelease(version);
  if (draft === undefined)
    return [`GitHub has no release ${version}. Prepare it as a draft first.`];

  const problems = draft.draft ? inspectDraft(steps.getDraft(draft)) : [];
  if (problems.length > 0) return problems;

  if (draft.draft && !steps.isDraftSound(draft))
    return [`The draft of ${version} was not published.`];

  if (draft.draft) steps.publish(draft);

  const release = steps.getRelease(version);
  if (!release?.published_at)
    return [`GitHub does not show ${version} as published.`];

  steps.say(`${version} is published: ${release.html_url}`);

  const commit = steps.getCommit(version);
  const state = await waitRun(
    steps,
    commit,
    release.published_at,
    TIMES_MAXIMUM,
  );

  if (state === "waiting")
    return [`The release run of ${version} did not end in time.`];

  if (state === "failed")
    return [`The release run of ${version} failed. Nothing went live.`];

  steps.say(`The release run of ${version} passed.`);

  // The settings file of the host is looked for in the released commit, not
  // in this folder, which can change while the command waits.
  const isHosted = steps.isHosted(commit);
  if (isHosted) steps.moveLive(commit);

  steps.say(
    isHosted
      ? `The live branch is at ${commit}. Vercel builds it from there.`
      : `The commit of ${version} has no settings file of the host, so no branch was moved.`,
  );

  return [];
};
