import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { SLATE } from "./colors";
import LOGO, {
  COLORS_LOGO,
  FILE_LOGO,
  MISUSES_LOGO,
  PRINCIPLES_LOGO,
} from "./logo";

const PATTERN_PATH = /<path\s+d="([^"]+)"/;
const PATTERN_VIEW = /viewBox="([^"]+)"/;
const PATTERN_SPACE = /\s+/g;

test("the mark's file and the mark's path are the same drawing", async () => {
  const file = await readFile(FILE_LOGO, "utf8");
  const [, path] = PATTERN_PATH.exec(file) || [];
  const [, viewBox] = PATTERN_VIEW.exec(file) || [];

  assert.equal(path.replace(PATTERN_SPACE, " ").trim(), LOGO.path);
  assert.equal(viewBox, LOGO.viewBox);
  assert.equal(file.split("<path").length, 2);
});

test("the grid of the mark matches its view box", () => {
  assert.equal(LOGO.viewBox, ["0 0", LOGO.width, LOGO.height].join(" "));
});

test("the mark is white or the darkest grey", () => {
  assert.deepEqual(COLORS_LOGO, ["#ffffff", SLATE[950]]);
});

test("the mark keeps a quarter of its height clear, and its least heights", () => {
  assert.equal(LOGO.spaceClear, 0.25);
  assert.deepEqual(LOGO.heightLeast, { screen: 16, print: 5 });
});

test("the principles and the misuses of the mark keep their words", () => {
  assert.deepEqual(PRINCIPLES_LOGO, [
    {
      name: "One shape.",
      note: "No wordmark, no tagline, and no second version.",
    },
    {
      name: "Two braces.",
      note: "The upper keeps its point. The lower lies flat.",
    },
    {
      name: "One color.",
      note: "White or slate 950. On purple or dark, one accent.",
    },
    {
      name: "Any size.",
      note: "Sharp from 16 px on a screen to a printed banner.",
    },
  ]);

  assert.deepEqual(MISUSES_LOGO, [
    "Never stretch or squeeze it",
    "Never rotate it",
    "Never outline it",
    "Never add a shadow or a glow",
    "Never use a color outside the system",
    "Never place it on a busy ground",
    "Never crop it and call it the logo",
    "Never rebuild it from type",
  ]);
});
