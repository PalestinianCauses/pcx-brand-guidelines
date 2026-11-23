import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const FILE_REVIEW = ".coderabbit.yaml";

const KEY_TOP = "reviews:";
const KEY_REVIEW = "  auto_review:";

// The one setting of the automatic review. With no other setting next to it,
// CodeRabbit still reviews a pull request when it opens: that is its default.
const SETTINGS = ["auto_incremental_review: false"];

const PATTERN_COMMENT = /^\s*#/;
const PATTERN_INSIDE = /^ {3,}\S/;
const PATTERN_TOP = /^\S/;

const isEmpty = function isEmpty(line: string): boolean {
  const isBlank = line.trim() === "" || PATTERN_COMMENT.test(line);
  return isBlank;
};

// The settings of the automatic review: every line below auto_review that
// sits deeper than it, up to the first line that does not. An empty line does
// not end them. Empty lines and comments are left out.
const getSettings = function getSettings(text: string): string[] {
  const lines = text.split("\n");
  const start = lines.indexOf(KEY_REVIEW);
  const linesBelow = start === -1 ? [] : lines.slice(start + 1);

  const end = linesBelow.findIndex(
    (line) => !isEmpty(line) && !PATTERN_INSIDE.test(line),
  );

  const linesInside = end === -1 ? linesBelow : linesBelow.slice(0, end);
  const settings = linesInside
    .filter((line) => !isEmpty(line))
    .map((line) => line.trim());

  return settings;
};

// The top-level key that auto_review sits under: the last line before it
// that starts at the left edge.
const getParent = function getParent(text: string): string | undefined {
  const lines = text.split("\n");
  const linesAbove = lines.slice(0, lines.indexOf(KEY_REVIEW));
  const parent = linesAbove.filter((line) => PATTERN_TOP.test(line)).pop();

  return parent;
};

const SAMPLE = [
  KEY_TOP,
  "  profile: chill",
  "  # A comment.",
  KEY_REVIEW,
  "    # A comment.",
  "    auto_incremental_review: false",
  "",
  "    enabled: false",
  "  poem: false",
  "    enabled: true",
].join("\n");

test("CodeRabbit reviews a pull request when it opens, and no later push by itself", async () => {
  const text = await readFile(FILE_REVIEW, "utf8");
  const count = text.split("\n").filter((line) => line === KEY_REVIEW).length;

  assert.equal(count, 1);
  assert.equal(getParent(text), KEY_TOP);
  assert.deepEqual(getSettings(text), SETTINGS);
});

test("a setting below an empty line still counts as a setting of the review", () => {
  const settings = ["auto_incremental_review: false", "enabled: false"];

  assert.deepEqual(getSettings(SAMPLE), settings);
  assert.notDeepEqual(getSettings(SAMPLE), SETTINGS);
});

test("a file without the settings of the review has none", () => {
  assert.deepEqual(getSettings([KEY_TOP, "  poem: false"].join("\n")), []);
  assert.equal(getParent(["chat:", KEY_REVIEW].join("\n")), "chat:");
});
