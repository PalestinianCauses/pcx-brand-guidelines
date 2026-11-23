import assert from "node:assert/strict";
import test from "node:test";

import getContrast, { CONTRAST_WORDS, getLuminance } from "./contrast";

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
