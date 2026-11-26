import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import COLORS, { type GroundsID, GROUNDS } from "./colors";
import getContrast, { CONTRAST_PARTS, getContrastShown } from "./contrast";
import FILLS, { COLOR_ACTION, getMainFill } from "./fills";
import FORM, { getOn } from "./form";
import { getWordsOn, WORDS_INK, WORDS_WHITE } from "./shades";
import SHAPE, { HEIGHT_FINGER, SIDE_LEAST } from "./shape";

const FILE_README = "README.md";

const IDS = Object.keys(GROUNDS) as GroundsID[];

const PATTERN_SPACES = /\s+/g;

// The names of the colours of a control that is on, as the README writes
// them.
const NAMES: Record<string, string> = {
  [WORDS_WHITE]: "White",
  [WORDS_INK]: "Ink",
};

test("the other parts of a form keep their values", () => {
  assert.deepEqual(FORM, {
    side: 20,
    tick: 14,
    dot: 8,
    track: { width: 36, height: 20 },
    thumb: 14,
    gap: 2,
    corner: 0,
    isRadioRound: true,
    reach: { sides: 12, ends: 8 },
    list: { away: 4, item: 44, linePointed: 2 },
  });
});

test("a switch is as high as a ticking box, its thumb stands in the middle of its track, and a ticking box and a switch are square as every part is", () => {
  const { gap, thumb, track } = FORM;
  const lines = SHAPE.lines.thin * 2;

  assert.equal(track.height, FORM.side);
  assert.equal(thumb + gap * 2 + lines, track.height);
  assert.ok(track.width - lines - gap * 2 >= thumb * 2);
  assert.equal(FORM.corner, SHAPE.corner);
  assert.equal(FORM.tick < FORM.side - lines, true);
  assert.equal(FORM.dot < FORM.tick, true);
});

test("the place of a press around a small control is larger than the least side that a pointer needs, and an item of a list is as high as a finger needs", () => {
  const { reach, side, track } = FORM;
  const lines = SHAPE.lines.thin * 2;

  [side, track.width].forEach((width) => {
    assert.ok(width - lines + reach.sides * 2 >= SIDE_LEAST);
  });

  assert.ok(side - lines + reach.ends * 2 >= SIDE_LEAST);
  assert.equal(FORM.list.item, HEIGHT_FINGER);
  assert.equal(FORM.list.linePointed, SHAPE.lines.thick);
});

test("a control that is on takes the fill and the words of the main button of its ground: the colour of an action on the dark and on the light ground, and the colour of the words on a ground in a brand colour", () => {
  const ons = Object.fromEntries(IDS.map((ground) => [ground, getOn(ground)]));
  const action = FILLS[COLOR_ACTION];

  assert.deepEqual(ons, {
    dark: { color: action.color, mark: action.words },
    light: { color: action.color, mark: action.words },
    purple: { color: WORDS_WHITE, mark: WORDS_INK },
    blue: { color: WORDS_INK, mark: WORDS_WHITE },
    pink: { color: WORDS_INK, mark: WORDS_WHITE },
    yellow: { color: WORDS_INK, mark: WORDS_WHITE },
  });

  IDS.forEach((ground) => {
    const main = getMainFill(ground);

    assert.deepEqual(getOn(ground), { color: main.color, mark: main.words });
  });

  (Object.keys(COLORS) as GroundsID[]).forEach((ground) => {
    assert.equal(getOn(ground).color, getWordsOn(GROUNDS[ground]), ground);
  });
});

test("a control that is on stands out from its ground, and its mark stands out from its fill, on every ground", () => {
  IDS.forEach((ground) => {
    const { color, mark } = getOn(ground);

    assert.ok(getContrast(color, GROUNDS[ground]) >= CONTRAST_PARTS, ground);
    assert.ok(getContrast(mark, color) >= CONTRAST_PARTS, ground);
  });
});

test("the README shows a control that is on, on every ground, with what was measured, and the sizes of the parts", async () => {
  const readme = (await readFile(FILE_README, "utf8")).replace(
    PATTERN_SPACES,
    " ",
  );

  IDS.forEach((ground) => {
    const { color, mark } = getOn(ground);
    const name = `${ground.charAt(0).toUpperCase()}${ground.slice(1)}`;
    const fill = NAMES[color] || `Blue ${FILLS[COLOR_ACTION].step}`;

    const row = [
      name,
      `${fill}, \`${color}\``,
      getContrastShown(getContrast(color, GROUNDS[ground])),
      getContrastShown(getContrast(mark, color)),
    ].join(" | ");

    assert.ok(readme.includes(`| ${row} |`), row);
  });

  [
    `A ticking box and a radio are ${FORM.side} pixels`,
    `The track of a switch is ${FORM.track.width} pixels by ${FORM.track.height}`,
    `its thumb is ${FORM.thumb} pixels`,
    `${FORM.reach.sides} pixels to each side and ${FORM.reach.ends} above and below`,
    `An item is ${FORM.list.item} pixels high`,
    `a line of ${FORM.list.linePointed} pixels at its start`,
  ].forEach((words) => {
    assert.ok(readme.includes(words), words);
  });
});
