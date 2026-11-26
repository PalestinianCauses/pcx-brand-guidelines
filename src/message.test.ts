import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import COLORS, { type GroundsID, GROUNDS } from "./colors";
import getContrast, { CONTRAST_PARTS, getContrastShown } from "./contrast";
import { getWrong, GROUNDS_WRONG } from "./field";
import MESSAGE, {
  getTint,
  GROUNDS_TINTED,
  type KindsID,
  type Tint,
} from "./message";
import SHADES, { getWordsOn } from "./shades";
import SHAPE from "./shape";
import TYPE from "./type";

const FILE_README = "README.md";

const IDS = Object.keys(GROUNDS) as GroundsID[];
const KINDS = Object.keys(MESSAGE.kinds) as KindsID[];

const PATTERN_SPACES = /\s+/g;

// The colour of a kind on a ground, as the README writes it.
const getName = function getName(tint: Tint): string {
  const { color, source, step } = tint;
  const colored = source ?? "";
  const named = `${colored.charAt(0).toUpperCase()}${colored.slice(1)} ${step}`;
  const own = `The brand's ${colored}`;
  const written = step === undefined ? own : named;

  const name = source === undefined ? "No colour" : `${written}, \`${color}\``;
  return name;
};

test("a message keeps its values", () => {
  assert.deepEqual(MESSAGE.kinds, {
    wrong: { icon: "circle-alert", urgency: "alert", color: "pink" },
    warning: { icon: "triangle-alert", urgency: "alert", color: "yellow" },
    success: { icon: "circle-check", urgency: "status", color: undefined },
    note: { icon: "info", urgency: "status", color: "blue" },
  });

  assert.deepEqual(MESSAGE.type, { heading: "button", words: "note" });
  assert.equal(MESSAGE.lineStart, 2);
  assert.equal(MESSAGE.icon, 20);
  assert.equal(MESSAGE.gap, 12);
  assert.equal(MESSAGE.room, 16);
  assert.equal(MESSAGE.lineStart, SHAPE.lines.thick);
  assert.deepEqual(GROUNDS_TINTED, ["dark", "light", "purple"]);
  assert.equal(GROUNDS_TINTED, GROUNDS_WRONG);
});

test("the words of a message are never larger than its heading, and the heading leads by its weight", () => {
  const heading = TYPE[MESSAGE.type.heading];
  const words = TYPE[MESSAGE.type.words];

  assert.equal(words.sizePhone, heading.sizePhone);
  assert.equal(words.sizeLaptop, heading.sizeLaptop);
  assert.ok(heading.weight > words.weight);
  assert.equal(heading.font, "sans");
  assert.equal(words.font, "sans");
  assert.equal(heading.isUppercase, false);
});

test("every kind has an icon of its own, and a message that is wrong or that warns is the urgent one", () => {
  const icons = KINDS.map((kind) => MESSAGE.kinds[kind].icon);

  assert.equal(new Set(icons).size, KINDS.length);
  assert.deepEqual(
    KINDS.filter((kind) => MESSAGE.kinds[kind].urgency === "alert"),
    ["wrong", "warning"],
  );
  assert.deepEqual(
    KINDS.filter((kind) => MESSAGE.kinds[kind].urgency === "status"),
    ["success", "note"],
  );
});

test("a warning is yellow and a note is blue on the dark, the light and the purple ground: the brand's colour itself, or the nearest darker step where that does not stand out", () => {
  const tints = Object.fromEntries(
    GROUNDS_TINTED.map((ground) => [
      ground,
      [getTint("warning", ground), getTint("note", ground)],
    ]),
  );

  const yellow = COLORS.yellow.value;
  const blue = COLORS.blue.value;

  assert.deepEqual(tints, {
    dark: [
      { color: yellow, source: "yellow", step: undefined },
      { color: blue, source: "blue", step: undefined },
    ],
    light: [
      { color: SHADES.yellow[500], source: "yellow", step: 500 },
      { color: blue, source: "blue", step: undefined },
    ],
    purple: [
      { color: yellow, source: "yellow", step: undefined },
      { color: blue, source: "blue", step: undefined },
    ],
  });

  // On the light ground the brand's own yellow does not stand out, and
  // step 500 is the first darker step that does.
  assert.ok(getContrast(yellow, GROUNDS.light) < CONTRAST_PARTS);
  assert.ok(getContrast(SHADES.yellow[400], GROUNDS.light) < CONTRAST_PARTS);
});

test("a success has no colour, and no kind has one on the blue, the pink and the yellow ground: there the line and the icon have the colour of the words", () => {
  IDS.forEach((ground) => {
    const strong = getWordsOn(GROUNDS[ground]);
    const bare = { color: strong, source: undefined, step: undefined };

    assert.deepEqual(getTint("success", ground), bare, ground);

    if (!GROUNDS_TINTED.includes(ground)) {
      KINDS.forEach((kind) => {
        assert.deepEqual(getTint(kind, ground), bare, `${kind} ${ground}`);
      });
    }
  });
});

test("a message that is wrong takes what a field that is wrong takes, on every ground", () => {
  IDS.forEach((ground) => {
    const wrong = getWrong(ground);
    const tint = getTint("wrong", ground);

    assert.equal(tint.color, wrong.color, ground);
    assert.equal(tint.step, wrong.step, ground);
    assert.equal(tint.source !== undefined, wrong.step !== undefined, ground);
  });
});

test("the line and the icon of every kind stand out from every ground", () => {
  KINDS.forEach((kind) => {
    IDS.forEach((ground) => {
      const { color } = getTint(kind, ground);

      assert.ok(
        getContrast(color, GROUNDS[ground]) >= CONTRAST_PARTS,
        `${kind} ${ground}`,
      );
    });
  });
});

test("the README shows the colour of every kind on every ground, with what was measured", async () => {
  const readme = (await readFile(FILE_README, "utf8")).replace(
    PATTERN_SPACES,
    " ",
  );

  IDS.forEach((ground) => {
    const name = `${ground.charAt(0).toUpperCase()}${ground.slice(1)}`;

    const cells = KINDS.map((kind) => {
      const tint = getTint(kind, ground);
      const figure = getContrastShown(getContrast(tint.color, GROUNDS[ground]));

      return `${getName(tint)}, ${figure}`;
    });

    const row = [name, ...cells].join(" | ");

    assert.ok(readme.includes(`| ${row} |`), row);
  });

  [
    `a line of ${MESSAGE.lineStart} pixels at its start`,
    `The icon is ${MESSAGE.icon} pixels`,
    `${TYPE[MESSAGE.type.heading].sizePhone} pixels`,
  ].forEach((words) => {
    assert.ok(readme.includes(words), words);
  });
});
