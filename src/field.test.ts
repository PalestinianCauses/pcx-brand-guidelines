import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { type GroundsID, GROUNDS } from "./colors";
import getContrast, {
  CONTRAST_PARTS,
  CONTRAST_WORDS,
  getContrastShown,
} from "./contrast";
import FIELD, { COLOR_WRONG, getWrong, GROUNDS_WRONG } from "./field";
import SHADES, { getWordsOn } from "./shades";
import SHAPE from "./shape";
import TYPE from "./type";

const FILE_README = "README.md";

const IDS = Object.keys(GROUNDS) as GroundsID[];

const PATTERN_SPACES = /\s+/g;

test("a field keeps its values", () => {
  assert.deepEqual(FIELD.type, {
    label: "button",
    words: "body",
    hint: "note",
    error: "note",
  });

  assert.equal(FIELD.sizeLeast, 16);
  assert.equal(FIELD.wrong.color, "pink");
  assert.deepEqual(FIELD.wrong.grounds, ["dark", "light", "purple"]);
  assert.equal(FIELD.wrong.thicker, 1);
  assert.deepEqual(FIELD.wrong.stepsLighter, [600, 500, 400, 300]);
  assert.deepEqual(FIELD.wrong.stepsDarker, [600, 700, 800]);
  assert.equal(COLOR_WRONG, FIELD.wrong.color);
  assert.equal(GROUNDS_WRONG, FIELD.wrong.grounds);
});

test("the label of a field is Gilroy in sentence case at the weight of a button, and the words in a field are never too small for a phone", () => {
  const label = TYPE[FIELD.type.label];
  const words = TYPE[FIELD.type.words];

  assert.equal(label.font, "sans");
  assert.equal(label.isUppercase, false);
  assert.equal(label.weight, TYPE.button.weight);
  assert.equal(label.sizePhone, TYPE.button.sizePhone);

  assert.ok(words.sizePhone >= FIELD.sizeLeast);
  assert.ok(words.sizeLaptop >= FIELD.sizeLeast);

  Object.values(FIELD.type).forEach((step) => {
    assert.equal(TYPE[step].font, "sans", step);
  });
});

test("a field that is wrong is pink on the dark, the light and the purple ground, at the step nearest to 600 in which its words can be read", () => {
  const wrong = Object.fromEntries(
    IDS.map((ground) => [ground, getWrong(ground)]),
  );

  assert.deepEqual(wrong, {
    dark: { color: SHADES.pink[500], step: 500, thicker: 0 },
    light: { color: SHADES.pink[600], step: 600, thicker: 0 },
    purple: { color: SHADES.pink[400], step: 400, thicker: 0 },
    blue: { color: getWordsOn(GROUNDS.blue), step: undefined, thicker: 1 },
    pink: { color: getWordsOn(GROUNDS.pink), step: undefined, thicker: 1 },
    yellow: { color: getWordsOn(GROUNDS.yellow), step: undefined, thicker: 1 },
  });

  GROUNDS_WRONG.forEach((ground) => {
    const { color, step } = getWrong(ground);
    const steps =
      getWordsOn(GROUNDS[ground]) === getWordsOn(GROUNDS.dark)
        ? FIELD.wrong.stepsLighter
        : FIELD.wrong.stepsDarker;

    // No step nearer to 600 reaches what words need.
    steps.slice(0, steps.indexOf(step || 600)).forEach((each) => {
      assert.ok(
        getContrast(SHADES.pink[each], GROUNDS[ground]) < CONTRAST_WORDS,
        `${ground} at ${each}`,
      );
    });

    assert.ok(getContrast(color, GROUNDS[ground]) >= CONTRAST_WORDS, ground);
  });
});

test("the pink of a wrong field can be told from the words of its ground, and a field with no colour has a thicker line instead", () => {
  IDS.forEach((ground) => {
    const { color, step, thicker } = getWrong(ground);
    const strong = getWordsOn(GROUNDS[ground]);
    const hasColor = GROUNDS_WRONG.includes(ground);

    assert.equal(step !== undefined, hasColor, ground);
    assert.equal(thicker > 0, !hasColor, ground);

    // The words of an error can be read on every ground.
    assert.ok(getContrast(color, GROUNDS[ground]) >= CONTRAST_WORDS, ground);

    if (hasColor) {
      assert.ok(getContrast(color, strong) >= CONTRAST_PARTS, ground);
    } else {
      assert.equal(color, strong, ground);
    }
  });

  // With no colour the line of a wrong field is as wide as a thick line.
  assert.equal(SHAPE.lines.thin + FIELD.wrong.thicker, SHAPE.lines.thick);
});

test("the README shows a wrong field on every ground, as it is measured", async () => {
  const readme = (await readFile(FILE_README, "utf8")).replace(
    PATTERN_SPACES,
    " ",
  );

  IDS.forEach((ground) => {
    const name = `${ground.charAt(0).toUpperCase()}${ground.slice(1)}`;
    const { color, step, thicker } = getWrong(ground);
    const shown = getContrastShown(getContrast(color, GROUNDS[ground]));

    const row =
      step === undefined
        ? `| ${name} | No colour | ${shown} | ${SHAPE.lines.thin + thicker} pixels |`
        : `| ${name} | Pink ${step}, \`${color}\` | ${shown} | ${SHAPE.lines.thin} pixel |`;

    assert.ok(readme.includes(row), row);
  });

  assert.ok(readme.includes(`never smaller than ${FIELD.sizeLeast} pixels`));
});
