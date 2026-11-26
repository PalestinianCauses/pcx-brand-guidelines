import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { getCard } from "./card";
import COLORS, { type GroundsID, GROUNDS } from "./colors";
import getContrast, { CONTRAST_WORDS, getContrastShown } from "./contrast";
import { COLOR_ACTION } from "./fills";
import LINK, { getLink, GROUNDS_LINK } from "./link";
import SHADES, { getWordsOn } from "./shades";
import SHAPE from "./shape";

const FILE_README = "README.md";

const IDS = Object.keys(GROUNDS) as GroundsID[];

const PATTERN_SPACES = /\s+/g;

const getShown = function getShown(color: string, under: string): string {
  const shown = getContrastShown(getContrast(color, under));
  return shown;
};

const getTitle = function getTitle(word: string): string {
  const title = `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  return title;
};

// The colour of a link on a ground, as the README names it.
const getName = function getName(ground: GroundsID): string {
  const { color, source, step } = getLink(ground);
  const stepped = `${getTitle(source ?? "")} ${step}`;
  const own = `The brand's ${source}`;
  const written = step === undefined ? own : stepped;

  const name =
    source === undefined
      ? `The colour of the words, \`${color}\``
      : `${written}, \`${color}\``;

  return name;
};

test("a link keeps its values: a line that is thin at rest and thick under the pointer, and a dark step of the colour of an action on the light ground", () => {
  assert.deepEqual(LINK.line, {
    rest: SHAPE.lines.thin,
    pointer: SHAPE.lines.thick,
    away: 4,
  });
  assert.ok(LINK.line.pointer > LINK.line.rest);
  assert.equal(LINK.stepLight, 700);
  assert.deepEqual(GROUNDS_LINK, ["dark", "light"]);
  assert.equal(COLOR_ACTION, "blue");
});

test("a link has the colour of an action on the dark and on the light ground, and the colour of the words on a ground in a brand colour", () => {
  const links = Object.fromEntries(IDS.map((id) => [id, getLink(id)]));
  const bare = { source: undefined, step: undefined };

  assert.deepEqual(links, {
    dark: { color: COLORS.blue.value, source: "blue", step: undefined },
    light: { color: SHADES.blue[700], source: "blue", step: 700 },
    purple: { color: getWordsOn(GROUNDS.purple), ...bare },
    blue: { color: getWordsOn(GROUNDS.blue), ...bare },
    pink: { color: getWordsOn(GROUNDS.pink), ...bare },
    yellow: { color: getWordsOn(GROUNDS.yellow), ...bare },
  });

  // The colour of an action itself can't be read as words on the light
  // ground, and the step of a link there can.
  assert.ok(getContrast(COLORS.blue.value, GROUNDS.light) < CONTRAST_WORDS);
  assert.ok(getContrast(SHADES.blue[700], GROUNDS.light) >= CONTRAST_WORDS);
});

test("a link can be read on every ground and on the fill of a card there, and on a ground in a brand colour only its line tells it from the words", () => {
  IDS.forEach((id) => {
    const { color } = getLink(id);
    const words = getWordsOn(GROUNDS[id]);

    assert.ok(getContrast(color, GROUNDS[id]) >= CONTRAST_WORDS, id);
    assert.ok(getContrast(color, getCard(id).fill) >= CONTRAST_WORDS, id);

    // On a ground in a brand colour a link has the colour of the words, so
    // its line alone tells it from them.
    assert.equal(color === words, !GROUNDS_LINK.includes(id), id);
  });
});

test("the README shows the colour of a link on every ground, with what was measured", async () => {
  const readme = (await readFile(FILE_README, "utf8")).replace(
    PATTERN_SPACES,
    " ",
  );

  IDS.forEach((id) => {
    const { color } = getLink(id);

    const row = [
      getTitle(id),
      getName(id),
      getShown(color, GROUNDS[id]),
      getShown(color, getCard(id).fill),
    ].join(" | ");

    assert.ok(readme.includes(`| ${row} |`), row);
  });

  [
    `It is ${LINK.line.rest} pixel thick and runs ${LINK.line.away} pixels under the words`,
    `Under the pointer it is ${LINK.line.pointer} pixels thick`,
    `step ${LINK.stepLight} of it on the light ground`,
    `${SHAPE.focus.outlineWidth} pixel wide and ${SHAPE.focus.outlineOffset} pixels away`,
  ].forEach((words) => {
    assert.ok(readme.includes(words), words);
  });
});
