import assert from "node:assert/strict";
import test from "node:test";

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

const DESCRIPTION = [
  "## Summary",
  "The page has a footer.",
  "## Testing",
  "All checks pass.",
  "## Limitations",
  "None.",
  "## Links",
  "Closes #12",
].join("\n");

const NOTES = [
  "## What is new",
  "The page has a footer.",
  "## Approval",
  "Approved for release on 2026-11-22.",
].join("\n");

test("a branch name in your style passes", () => {
  assert.deepEqual(inspectBranch("building-avatar-component"), []);
  assert.deepEqual(inspectBranch("setting-up-payload-cms"), []);
});

test("a branch name in another style is refused", () => {
  const names = [
    "main",
    "avatar-component",
    "building",
    "Building-avatar-component",
    "feature/avatar",
    "building_avatar",
  ];

  names.forEach((name) => assert.equal(inspectBranch(name).length, 1, name));
});

test("the main branch of this computer is not a pull request's branch", () => {
  assert.deepEqual(inspectCurrentBranch("main"), []);
});

test("another branch of this computer is inspected like a pull request's branch", () => {
  assert.deepEqual(inspectCurrentBranch("building-avatar-component"), []);
  assert.equal(inspectCurrentBranch("avatar-component").length, 1);
});

test("a commit message in your style passes", () => {
  const subjects = [
    "New: Enhance through adding `README.md` file",
    "Update: Enhance through updating `Hotels` collection",
    "Fix: Enhance through fixing `defaultValue` field in `Hotels` collection",
    "Docs: Enhance through documenting the checks",
  ];

  subjects.forEach((subject) =>
    assert.deepEqual(inspectCommit(subject), [], subject),
  );
});

test("a commit message in another style is refused", () => {
  const subjects = [
    "",
    "Fix the footer",
    "fix: Enhance through fixing the footer",
    "Feat: Enhance through adding a footer",
    "Fix: fixing the footer",
    "Fix: Enhance through ",
  ];

  subjects.forEach((subject) =>
    assert.equal(inspectCommit(subject).length, 1, subject),
  );
});

test("a pull request title follows the commit style", () => {
  assert.deepEqual(inspectTitle("New: Enhance through adding a footer"), []);
  assert.equal(inspectTitle("Add a footer").length, 1);
});

test("a full description passes", () => {
  assert.deepEqual(inspectDescription(DESCRIPTION), []);
});

test("a description with an empty section is refused", () => {
  const description = DESCRIPTION.replace("All checks pass.", "");
  const problems = inspectDescription(description);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /Testing/);
});

test("a section that holds only a comment counts as empty", () => {
  const description = DESCRIPTION.replace("None.", "<!-- say it here -->");
  const problems = inspectDescription(description);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /Limitations/);
});

test("an empty section before an indented heading is refused", () => {
  const description = DESCRIPTION.replace("All checks pass.", "").replace(
    "## Limitations",
    "  ## Limitations",
  );

  const problems = inspectDescription(description);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /Testing/);
});

test("a description that does not close its issue is refused", () => {
  const description = DESCRIPTION.replace("Closes #12", "");
  const problems = inspectDescription(description);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /close its issue/);
});

test("a description in the sections of an older kit is refused", () => {
  const description = DESCRIPTION.replace("## Summary", "## What changed")
    .replace("## Testing", "## How it was checked")
    .replace("## Limitations", "## What is not done");

  assert.equal(inspectDescription(description).length, 3);
});

test("an empty description is refused on every point", () => {
  assert.equal(inspectDescription("").length, 4);
});

test("exact versions pass", () => {
  const packageText = JSON.stringify({
    dependencies: { next: "16.4.6", react: "19.0.0-rc-66855b96-20241106" },
    devDependencies: { eslint: "9.39.5" },
  });

  assert.deepEqual(inspectVersions(packageText), []);
});

test("a version with a specifier is refused", () => {
  const versions = ["^1.2.3", "~1.2.3", ">=1.2.3", "1.x", "1.2", "*", "latest"];
  const problems = versions.flatMap((version) =>
    inspectVersions(JSON.stringify({ dependencies: { sample: version } })),
  );

  assert.equal(problems.length, versions.length);
});

test("a package file without dependencies passes", () => {
  assert.deepEqual(inspectVersions(JSON.stringify({ name: "sample" })), []);
});

test("a settings file that turns off deploys from main passes", () => {
  const samples = [
    { git: { deploymentEnabled: { main: false } } },
    { git: { deploymentEnabled: { "main": false, "release-*": false } } },
  ];

  samples.forEach((sample) => {
    const settingsText = JSON.stringify(sample);

    assert.deepEqual(inspectDeploys(settingsText), [], settingsText);
  });
});

test("a settings file that turns off deploys from every branch passes", () => {
  const settingsText = JSON.stringify({ git: { deploymentEnabled: false } });

  assert.deepEqual(inspectDeploys(settingsText), []);
});

test("a settings file that lets main deploy is refused", () => {
  const samples = [
    null,
    {},
    { git: null },
    { git: {} },
    { git: { deploymentEnabled: null } },
    { git: { deploymentEnabled: true } },
    { git: { deploymentEnabled: {} } },
    { git: { deploymentEnabled: { main: true } } },
    { git: { deploymentEnabled: { preview: false } } },
  ];

  samples.forEach((sample) => {
    const settingsText = JSON.stringify(sample);

    assert.equal(inspectDeploys(settingsText).length, 1, settingsText);
  });
});

test("a pattern alone is refused, because the guard does not read patterns", () => {
  const samples = [
    { git: { deploymentEnabled: { "*": false } } },
    { git: { deploymentEnabled: { "ma*": false } } },
  ];

  samples.forEach((sample) => {
    const settingsText = JSON.stringify(sample);

    assert.equal(inspectDeploys(settingsText).length, 1, settingsText);
  });
});

test("a rule that is true is refused, because its pattern can reach main", () => {
  const samples = [
    { git: { deploymentEnabled: { "main": false, "*": true } } },
    { git: { deploymentEnabled: { "main": false, "ma*": true } } },
    { git: { deploymentEnabled: { main: false, preview: true } } },
  ];

  samples.forEach((sample) => {
    const settingsText = JSON.stringify(sample);

    assert.equal(inspectDeploys(settingsText).length, 1, settingsText);
  });
});

test("a release in your style passes", () => {
  const versions = ["v1.0.0", "v0.1.0", "v10.20.30"];

  versions.forEach((version) =>
    assert.deepEqual(inspectRelease(version, NOTES, true), [], version),
  );
});

test("a version in another style is refused", () => {
  const versions = [
    "",
    "1.0.0",
    "v1.0",
    "v1.0.0.0",
    "v1.0.0-beta",
    "v01.0.0",
    "V1.0.0",
    "version-1",
  ];

  versions.forEach((version) => {
    const problems = inspectRelease(version, NOTES, true);

    assert.equal(problems.length, 1, version);
    assert.match(problems[0], /three numbers/);
  });
});

test("notes that do not say when the release was approved are refused", () => {
  const samples = [
    "",
    "The page has a footer.",
    NOTES.replace("2026-11-22", "22 Nov 2026"),
    NOTES.replace("2026-11-22", "2026-02-30"),
    NOTES.replace("2026-11-22", "2026-99-99"),
    NOTES.replace("2026-11-22", "2026-00-10"),
    NOTES.replace("Approved for release", "Not Approved for release"),
    NOTES.replace("2026-11-22.", "2026-11-22, once the checks pass."),
    NOTES.replace(
      "Approved for release on 2026-11-22.",
      "<!-- Approved for release on 2026-11-22. -->",
    ),
  ];

  samples.forEach((sample) => {
    const problems = inspectRelease("v1.0.0", sample, true);

    assert.equal(problems.length, 1, sample);
    assert.match(problems[0], /approved/);
  });
});

test("the approval line passes with or without its period, and with spaces around it", () => {
  const samples = [
    NOTES,
    NOTES.replace("2026-11-22.", "2026-11-22"),
    NOTES.replace("Approved for release", "  Approved for release"),
  ];

  samples.forEach((sample) => {
    assert.deepEqual(inspectRelease("v1.0.0", sample, true), [], sample);
  });
});

test("a release whose commit is not on main is refused", () => {
  const problems = inspectRelease("v1.0.0", NOTES, false);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /not on the main branch/);
});

test("a release with every fault is refused on every point", () => {
  assert.equal(inspectRelease("1.0", "", false).length, 3);
});

test("a release with the version of the VERSION file passes", () => {
  assert.deepEqual(inspectVersionFile("v1.0.2", "1.0.2"), []);
  assert.deepEqual(inspectVersionFile("v1.0.2", "1.0.2\n"), []);
});

test("a release with another version than the VERSION file is refused", () => {
  const texts = ["1.0.1", "v1.0.2", "1.0", ""];

  texts.forEach((text) => {
    const problems = inspectVersionFile("v1.0.2", text);

    assert.equal(problems.length, 1, text);
    assert.match(problems[0], /VERSION file/);
  });
});
