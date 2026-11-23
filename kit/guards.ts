// The guards of a pull request: its branch, commits, title, description and
// package versions, and the settings file of the host where a project has one.
// The guard of a release: its version, its notes and its commit, and the
// VERSION file where a project has one.
// Each one returns the problems it found, in plain words.

const BRANCH_MAIN = "main";

// The approval of a release, on a line of its own.
const PATTERN_APPROVAL =
  /^[ \t]*Approved for release on (\d{4})-(\d{2})-(\d{2})\.?[ \t]*$/m;
const PATTERN_BRANCH = /^[a-z]+ing(?:-[a-z0-9]+)+$/;
const PATTERN_COMMENT = /<!--[\s\S]*?-->/g;
const PATTERN_COMMIT = /^(?:New|Update|Fix|Docs): Enhance through \S.*$/;
const PATTERN_ISSUE = /\b(?:Closes|Fixes|Resolves) #\d+\b/;
const PATTERN_RELEASE = /^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/;
const PATTERN_VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

const FIELDS_DEPENDENCIES = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
];

const SECTIONS = ["Summary", "Testing", "Limitations"];

type PackageFile = Partial<Record<string, Record<string, string>>>;

type Deploys = boolean | Partial<Record<string, boolean>> | null | undefined;

type SettingsHost = {
  git?: { deploymentEnabled?: Deploys } | null;
} | null;

export const inspectBranch = function inspectBranch(name: string): string[] {
  if (PATTERN_BRANCH.test(name)) return [];

  return [
    `The branch name "${name}" is not in lower case with hyphens, starting with what is being done, such as building-avatar-component.`,
  ];
};

// The branch that is checked out on this computer. The main branch is where
// work starts, not a pull request's branch, so its name is not inspected.
export const inspectCurrentBranch = function inspectCurrentBranch(
  name: string,
): string[] {
  if (name === BRANCH_MAIN) return [];

  return inspectBranch(name);
};

export const inspectCommit = function inspectCommit(subject: string): string[] {
  if (PATTERN_COMMIT.test(subject)) return [];

  return [
    `The commit message "${subject}" does not start with New, Update, Fix or Docs, a colon, and "Enhance through".`,
  ];
};

export const inspectTitle = function inspectTitle(title: string): string[] {
  if (PATTERN_COMMIT.test(title)) return [];

  return [
    `The pull request title "${title}" does not follow the commit style.`,
  ];
};

const getSection = function getSection(
  description: string,
  section: string,
): string {
  const lines = description.replace(PATTERN_COMMENT, "").split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${section}`);
  if (start === -1) return "";

  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.trim().startsWith("## "));
  const linesSection = end === -1 ? rest : rest.slice(0, end);

  return linesSection.join("\n").trim();
};

export const inspectDescription = function inspectDescription(
  description: string,
): string[] {
  const sectionsEmpty = SECTIONS.filter(
    (section) => getSection(description, section) === "",
  );

  const problems = sectionsEmpty.map(
    (section) => `The description says nothing under "${section}".`,
  );

  if (!PATTERN_ISSUE.test(description))
    problems.push(
      'The description does not close its issue, such as "Closes #12".',
    );

  return problems;
};

export const inspectVersions = function inspectVersions(
  packageText: string,
): string[] {
  const packageFile = JSON.parse(packageText) as PackageFile;

  return FIELDS_DEPENDENCIES.flatMap((field) =>
    Object.entries(packageFile[field] || {})
      .filter(([, version]) => !PATTERN_VERSION.test(version))
      .map(
        ([name, version]) =>
          `${name} is set to "${version}" in ${field}. A package is installed at an exact version.`,
      ),
  );
};

// Vercel reads each name in the rules as a pattern for branch names, and one
// rule that is true is enough for a deploy. The guard does not read patterns.
// It asks for the plain way instead: a rule that names the main branch itself
// and is false, and no rule that is true. A pattern alone is refused, even
// one that would turn off the main branch.
const isMainOff = function isMainOff(deploys: Deploys): boolean {
  if (deploys === false) return true;
  if (typeof deploys !== "object" || deploys === null) return false;

  return (
    deploys[BRANCH_MAIN] === false &&
    Object.values(deploys).every((rule) => rule === false)
  );
};

// The settings file of the host, vercel.json. Vercel deploys every branch
// that the file does not turn off. So the file has to turn off the main
// branch, or every branch. Then a merge deploys nothing.
export const inspectDeploys = function inspectDeploys(
  settingsText: string,
): string[] {
  const settings = JSON.parse(settingsText) as SettingsHost;
  if (isMainOff(settings?.git?.deploymentEnabled)) return [];

  return [
    `vercel.json has to turn off Vercel's deploys from the ${BRANCH_MAIN} branch by name: set git.deploymentEnabled.${BRANCH_MAIN} to false, and set no rule to true. Then a merge deploys nothing.`,
  ];
};

// Whether a year, a month and a day name a day of the calendar. The 30th of
// February does not.
const isDay = function isDay(
  year: number,
  month: number,
  day: number,
): boolean {
  const date = new Date(Date.UTC(year, month - 1, day));
  const isSame =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  return isSame;
};

// Whether the notes of a release say on which day it was approved, on a line
// of their own. A line that says more, such as a denial, does not count.
const isApproved = function isApproved(notes: string): boolean {
  const [, year, month, day] = (PATTERN_APPROVAL.exec(notes) || []).map(Number);
  const isNamed = isDay(year, month, day);

  return isNamed;
};

// A release. Its version is a v and three numbers. Its notes say on which day
// the release was approved. Its commit is on the main branch.
export const inspectRelease = function inspectRelease(
  version: string,
  notes: string,
  isOnMain: boolean,
): string[] {
  const problems: string[] = [];

  if (!PATTERN_RELEASE.test(version))
    problems.push(
      `The version "${version}" is not written as a v and three numbers, such as v1.2.4.`,
    );

  if (!isApproved(notes.replace(PATTERN_COMMENT, "")))
    problems.push(
      'The notes have no line of its own that says when the release was approved, such as "Approved for release on 2026-11-22."',
    );

  if (!isOnMain)
    problems.push(
      `The commit of the release is not on the ${BRANCH_MAIN} branch.`,
    );

  return problems;
};

// A project whose code has to know its own version, such as a command line
// tool, keeps it in a file named VERSION. The file holds the three numbers
// without the v. A release has to carry the same version.
export const inspectVersionFile = function inspectVersionFile(
  version: string,
  fileText: string,
): string[] {
  const versionFile = fileText.trim();
  if (version === `v${versionFile}`) return [];

  return [
    `The release is ${version}, and the VERSION file says "${versionFile}". The file has to hold the same version, without the v.`,
  ];
};
