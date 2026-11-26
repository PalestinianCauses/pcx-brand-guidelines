import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import COLORS, {
  type ColorID,
  GROUND_DARK,
  GROUND_LIGHT,
  type GroundsID,
  GROUNDS as GROUNDS_NAMED,
  SLATE,
} from "./colors";
import getContrast, { CONTRAST_PARTS, getContrastShown } from "./contrast";
import FILLS, { getMainFill } from "./fills";
import { WORDS_INK } from "./shades";
import SHADOW, { getLines, getLinesOn } from "./shadow";
import SHAPE, { UNIT } from "./shape";

const FILE_README = "README.md";

const IDS = Object.keys(COLORS) as ColorID[];

// The two grounds that a hard shadow is measured on, with the colour of
// each.
const GROUNDS = [
  ["dark", GROUND_DARK],
  ["light", GROUND_LIGHT],
] as const;

test("the hard shadow keeps its values", () => {
  assert.deepEqual(SHADOW, {
    reach: 6,
    line: 1,
    step: 4,
    angle: 135,
    colorDark: "#cad5e2",
    colorLight: "#020618",
    colorPale: "#62748e",
    without: ["pressed", "focus", "off"],
  });
});

test("the lines of the hard shadow are thin lines, one unit apart, and the band holds more than one", () => {
  assert.equal(SHADOW.line, SHAPE.lines.thin);
  assert.equal(SHADOW.step, UNIT);
  assert.ok(SHADOW.step > SHADOW.line);
  assert.ok(SHADOW.reach > SHADOW.step);
});

test("the lines are slate 300 on a dark ground, ink on a light one, and slate 500 beside a pale part", () => {
  assert.equal(SHADOW.colorDark, SLATE[300]);
  assert.equal(SHADOW.colorLight, WORDS_INK);
  assert.equal(SHADOW.colorPale, SLATE[500]);
});

test("the lines stand out from the ground that they are for", () => {
  assert.ok(getContrast(SHADOW.colorDark, GROUND_DARK) >= CONTRAST_PARTS);
  assert.ok(getContrast(SHADOW.colorPale, GROUND_DARK) >= CONTRAST_PARTS);
  assert.ok(getContrast(SHADOW.colorLight, GROUND_LIGHT) >= CONTRAST_PARTS);
});

test("only a part that takes ink words gets the darker lines, and only on a dark ground", () => {
  IDS.forEach((id) => {
    const fill = FILLS[id];
    const isPale = fill.words === WORDS_INK;
    const colorDark = isPale ? SHADOW.colorPale : SHADOW.colorDark;

    assert.equal(getLines(fill.color, "dark"), colorDark, id);
    assert.equal(getLines(fill.colorHover, "dark"), colorDark, id);
    assert.equal(getLines(fill.color, "light"), SHADOW.colorLight, id);
    assert.equal(getLines(fill.colorHover, "light"), SHADOW.colorLight, id);
  });

  assert.equal(getLines(GROUND_LIGHT, "dark"), SHADOW.colorPale);
  assert.equal(getLines(GROUND_DARK, "dark"), SHADOW.colorDark);
});

test("light lines would not stand out from a pale part, and the darker ones do", () => {
  const pale = FILLS.yellow.color;

  assert.ok(getContrast(SHADOW.colorDark, pale) < CONTRAST_PARTS);
  assert.ok(getContrast(SHADOW.colorPale, pale) >= CONTRAST_PARTS);
});

test("beside the fill of every main button at rest, the lines stand out on both grounds", () => {
  IDS.forEach((id) => {
    const { color } = FILLS[id];

    GROUNDS.forEach(([ground]) => {
      const contrast = getContrast(getLines(color, ground), color);

      assert.ok(contrast >= CONTRAST_PARTS, `${id} on ${ground}`);
    });
  });
});

test("under the pointer, the lines fall under what a part needs beside two fills on a light ground, and nowhere else", () => {
  const weak = IDS.flatMap((id) =>
    GROUNDS.map(([ground]) => {
      const { colorHover } = FILLS[id];
      const contrast = getContrast(getLines(colorHover, ground), colorHover);

      return [id, ground, contrast] as const;
    }),
  ).filter(([, , contrast]) => contrast < CONTRAST_PARTS);

  assert.deepEqual(
    weak.map(([id, ground]) => [id, ground]),
    [
      ["purple", "light"],
      ["pink", "light"],
    ],
  );

  // There the lines still stand out from the ground, and so does the fill.
  weak.forEach(([id]) => {
    const { colorHover } = FILLS[id];

    assert.ok(getContrast(colorHover, GROUND_LIGHT) >= CONTRAST_PARTS, id);
  });
});

test("a part has no hard shadow while it is pressed, with the keyboard on it, or off", () => {
  assert.deepEqual([...SHADOW.without].sort(), ["focus", "off", "pressed"]);
});

test("the README shows the hard shadow as it is", async () => {
  const readme = await readFile(FILE_README, "utf8");
  const { angle, colorDark, colorLight, colorPale, line, reach, step } = SHADOW;

  const [purple, pink] = [FILLS.purple, FILLS.pink].map((fill) =>
    getContrastShown(getContrast(colorLight, fill.colorHover)),
  );

  assert.ok(readme.includes(`below it, ${reach} pixels wide`));

  assert.ok(
    readme.includes(
      `${line} pixel wide, ${step} pixels from one to the next, at ${angle} degrees`,
    ),
  );

  assert.ok(readme.includes(`Slate 300, \`${colorDark}\``));
  assert.ok(readme.includes(`Ink, \`${colorLight}\``));
  assert.ok(readme.includes(`Slate 500, \`${colorPale}\``));
  assert.ok(readme.includes(`It moves ${reach} pixels, into the place`));

  assert.ok(
    readme.includes(
      `against the purple and the pink fill on a light ground, at ${purple} and ${pink}`,
    ),
  );
});

test("on a ground in a brand colour the lines are ink where the words are ink, and the lines of a dark ground on the purple one", () => {
  const { colorDark, colorLight, colorPale } = SHADOW;
  const blue = FILLS.blue.color;
  const yellow = FILLS.yellow.color;

  assert.equal(getLinesOn(blue, "dark"), getLines(blue, "dark"));
  assert.equal(getLinesOn(blue, "light"), getLines(blue, "light"));
  assert.equal(getLinesOn(yellow, "dark"), colorPale);

  assert.equal(getLinesOn(blue, "purple"), colorDark);
  assert.equal(getLinesOn(yellow, "purple"), colorPale);

  (["blue", "pink", "yellow"] as GroundsID[]).forEach((ground) => {
    assert.equal(getLinesOn(blue, ground), colorLight, ground);
    assert.equal(getLinesOn(yellow, ground), colorLight, ground);
  });
});

test("beside the main button of a ground in a brand colour the lines are the plain lines of the ground, and they stand out from it", () => {
  const { colorDark, colorLight } = SHADOW;
  const grounds = Object.keys(COLORS) as GroundsID[];

  grounds.forEach((ground) => {
    const main = getMainFill(ground);
    const lines = getLinesOn(main.color, ground);

    assert.equal(lines, ground === "purple" ? colorDark : colorLight, ground);
    assert.ok(getContrast(lines, GROUNDS_NAMED[ground]) >= CONTRAST_PARTS);

    // The lines have the colour of the button, or one close to it. The
    // band reads because it is hatched.
    assert.ok(getContrast(lines, main.color) < CONTRAST_PARTS, ground);
  });
});

test("the lines beside a pale part fall just under what a part needs on the purple ground, where the part itself stands out", () => {
  const yellow = FILLS.yellow.color;
  const lines = getLinesOn(yellow, "purple");

  assert.ok(getContrast(lines, GROUNDS_NAMED.purple) < CONTRAST_PARTS);
  assert.ok(getContrast(yellow, GROUNDS_NAMED.purple) >= CONTRAST_PARTS);
  assert.ok(getContrast(lines, yellow) >= CONTRAST_PARTS);
});

test("the README says the lines on a ground in a brand colour, as they are measured", async () => {
  const readme = await readFile(FILE_README, "utf8");
  const lines = getLinesOn(FILLS.yellow.color, "purple");
  const shown = getContrastShown(getContrast(lines, GROUNDS_NAMED.purple));

  assert.ok(readme.includes("Ink on the blue, the pink and the yellow ground"));
  assert.ok(readme.includes(`reach ${shown} against the purple ground`));
});
