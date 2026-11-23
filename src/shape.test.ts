import assert from "node:assert/strict";
import test from "node:test";

import COLORS, { GROUND_DARK, GROUND_LIGHT } from "./colors";
import getContrast, { CONTRAST_PARTS } from "./contrast";
import SHAPE, { HEIGHT_FINGER, UNIT } from "./shape";

test("the shape keeps its corners, lines, heights and spaces", () => {
  assert.deepEqual(SHAPE, {
    corner: 0,
    lines: { thin: 1, thick: 2 },
    heightControl: 44,
    ringFocus: { width: 2, offset: 2, color: "#1f8bff" },
    spaces: {
      inside: 20,
      between: 0,
      heading: 24,
      sectionPhone: 48,
      sectionLaptop: 64,
    },
  });
});

test("the unit, the height for a finger and the contrast for parts keep their values", () => {
  assert.equal(UNIT, 4);
  assert.equal(HEIGHT_FINGER, 44);
  assert.equal(CONTRAST_PARTS, 3);
});

test("every space and the height of a control are multiples of the unit", () => {
  const sizes = [...Object.values(SHAPE.spaces), SHAPE.heightControl];
  const sizesUnfit = sizes.filter((size) => size % UNIT !== 0);

  assert.deepEqual(sizesUnfit, []);
});

test("a control is high enough for a finger", () => {
  assert.ok(SHAPE.heightControl >= HEIGHT_FINGER);
});

test("the thick line is twice the thin line", () => {
  assert.equal(SHAPE.lines.thick, SHAPE.lines.thin * 2);
});

test("a section gets more room on a laptop than on a phone", () => {
  assert.ok(SHAPE.spaces.sectionLaptop > SHAPE.spaces.sectionPhone);
});

test("the focus ring is the brand's blue, and it shows on both grounds", () => {
  const { color } = SHAPE.ringFocus;

  assert.equal(color, COLORS.blue.value);
  assert.ok(getContrast(color, GROUND_DARK) >= CONTRAST_PARTS);
  assert.ok(getContrast(color, GROUND_LIGHT) >= CONTRAST_PARTS);
});
