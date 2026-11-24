import assert from "node:assert/strict";
import test from "node:test";

import COLORS, { SLATE } from "./colors";
import getContrast, {
  CONTRAST_PARTS,
  CONTRAST_WORDS,
  getContrastShown,
  getLuminance,
} from "./contrast";

const WHITE = "#ffffff";
const BLACK = "#000000";

// A contrast with two decimals, the way a report shows it.
const getRounded = function getRounded(contrast: number): number {
  const rounded = Math.round(contrast * 100) / 100;
  return rounded;
};

test("white on black has the greatest contrast, and a colour on itself the least", () => {
  assert.equal(getRounded(getContrast(WHITE, BLACK)), 21);
  assert.equal(getContrast(WHITE, WHITE), 1);
});

test("a known pair gives the figure that the formula of WCAG 2 gives", () => {
  assert.equal(getRounded(getContrast("#767676", WHITE)), 4.54);
  assert.equal(getContrast("#767676", WHITE) >= CONTRAST_WORDS, true);
  assert.equal(getContrast("#777777", WHITE) >= CONTRAST_WORDS, false);
});

test("the order of the two colours does not change the contrast", () => {
  assert.equal(getContrast("#1f8bff", BLACK), getContrast(BLACK, "#1f8bff"));
});

test("capital and small hex digits are the same colour", () => {
  assert.equal(getLuminance("#FFD84D"), getLuminance("#ffd84d"));
});

test("a value that is not a hex colour with six digits is refused", () => {
  assert.throws(() => getLuminance("#fff"), /not a hex colour/);
  assert.throws(() => getLuminance("blue"), /not a hex colour/);
  assert.throws(() => getContrast(WHITE, "#12345g"), /not a hex colour/);
});

// Every colour of the brand, and white and black.
const COLORS_ALL: string[] = [
  ...Object.values(SLATE),
  ...Object.values(COLORS).map((color) => color.value),
  WHITE,
  BLACK,
];

// The contrast of every colour on every other one.
const CONTRASTS = COLORS_ALL.flatMap((colorOne) =>
  COLORS_ALL.map((colorTwo) => getContrast(colorOne, colorTwo)),
);

// The last digits that a shown contrast may never end in.
const PATTERN_ODD = /[1379]$/;

test("a contrast is shown rounded down to one digit that is even or 5", () => {
  const shown = [9.33, 14.57, 4.55, 4.49, 2.91, 3.24, 20.16, 4.6, 7.19].map(
    getContrastShown,
  );

  assert.deepEqual(shown, [
    "9.2",
    "14.5",
    "4.5",
    "4.4",
    "2.8",
    "3.2",
    "20.0",
    "4.6",
    "7.0",
  ]);
});

test("a whole contrast keeps its digit after the point, so it never ends in an odd digit", () => {
  assert.equal(getContrastShown(3), "3.0");
  assert.equal(getContrastShown(1), "1.0");
  assert.equal(getContrastShown(21), "21.0");
  assert.equal(getContrastShown(getContrast(WHITE, BLACK)), "21.0");
});

test("no shown contrast ends in an odd digit other than 5", () => {
  const contrastsOdd = CONTRASTS.map(getContrastShown).filter((shown) =>
    PATTERN_ODD.test(shown),
  );

  assert.ok(CONTRASTS.length > 200);
  assert.deepEqual(contrastsOdd, []);
});

test("a shown contrast is never more than the measured one, and at most two tenths less", () => {
  CONTRASTS.forEach((contrast) => {
    const shown = Number(getContrastShown(contrast));

    assert.ok(shown <= contrast, `${contrast}`);
    assert.ok(contrast - shown < 0.2, `${contrast}`);
  });
});

test("a contrast just under a limit is not shown as reaching it", () => {
  const contrasts = [4.49999998, 2.99999998, 4.499999999999999, 6.999999];
  const shown = contrasts.map(getContrastShown);

  assert.deepEqual(shown, ["4.4", "2.8", "4.4", "6.8"]);

  contrasts.forEach((contrast, index) => {
    assert.ok(Number(shown[index]) <= contrast, `${contrast}`);
  });
});

test("a contrast that is a whole number of tenths is shown as it is", () => {
  const tenths = Array.from({ length: 201 }, (_, index) => index + 10);
  const tenthsAllowed = tenths.filter(
    (value) => ![1, 3, 7, 9].includes(value % 10),
  );

  tenthsAllowed.forEach((value) => {
    assert.equal(
      getContrastShown(value / 10),
      (value / 10).toFixed(1),
      `${value}`,
    );
  });
});

test("a shown contrast reaches a limit exactly when the measured one does", () => {
  CONTRASTS.forEach((contrast) => {
    const shown = Number(getContrastShown(contrast));

    assert.equal(
      shown >= CONTRAST_WORDS,
      contrast >= CONTRAST_WORDS,
      `${contrast}`,
    );
    assert.equal(
      shown >= CONTRAST_PARTS,
      contrast >= CONTRAST_PARTS,
      `${contrast}`,
    );
  });

  assert.equal(getContrastShown(CONTRAST_WORDS), "4.5");
  assert.equal(getContrastShown(CONTRAST_PARTS), "3.0");
  assert.equal(getContrastShown(CONTRAST_WORDS - 0.01), "4.4");
  assert.equal(getContrastShown(CONTRAST_PARTS - 0.01), "2.8");
});
