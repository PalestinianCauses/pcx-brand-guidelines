import assert from "node:assert/strict";
import test from "node:test";

import COLORS, { SLATE } from "./colors";
import getColor, { getOklch } from "./oklch";

const WHITE = "#ffffff";
const BLACK = "#000000";

// How far a measured value may lie from the one that is asked for. A hex
// value has 256 steps for each channel, so a colour that is written and
// read again is a little off.
const ROOM_LIGHTNESS = 0.005;
const ROOM_HUE = 2;
const ROOM_GREY = 0.0005;

// A light tint that asks for more strength than a screen can show.
const LIGHTNESS_TINT = 0.96;

// A colour that asks for far more strength than any screen has, and the
// least strength that it has to keep.
const COLOR_WILD = { lightness: 0.5, chroma: 100, hue: 0 };
const CHROMA_KEPT = 0.15;

const COLORS_BRAND = Object.values(COLORS).map((color) => color.value);
const GREYS: string[] = Object.values(SLATE);

test("white is as light as a colour gets, black is as dark, and neither has a hue to speak of", () => {
  const white = getOklch(WHITE);
  const black = getOklch(BLACK);

  assert.ok(Math.abs(white.lightness - 1) < ROOM_GREY);
  assert.ok(white.chroma < ROOM_GREY);
  assert.equal(black.lightness, 0);
  assert.equal(black.chroma, 0);
});

test("a colour that is read and written again is the same colour", () => {
  const colors = [...COLORS_BRAND, ...GREYS, WHITE, BLACK];

  assert.deepEqual(
    colors.map((color) => getColor(getOklch(color))),
    colors,
  );
});

test("the hue of a colour is an angle of one turn", () => {
  COLORS_BRAND.forEach((color) => {
    const { hue } = getOklch(color);

    assert.ok(hue >= 0 && hue < 360, color);
  });
});

test("a darker colour is less light, in every brand colour against white", () => {
  COLORS_BRAND.forEach((color) => {
    assert.ok(getOklch(color).lightness < getOklch(WHITE).lightness, color);
    assert.ok(getOklch(color).lightness > getOklch(BLACK).lightness, color);
  });
});

test("a colour that a screen can't show keeps its lightness and its hue, and loses strength", () => {
  COLORS_BRAND.forEach((color) => {
    const { chroma, hue } = getOklch(color);
    const tint = getOklch(getColor({ lightness: LIGHTNESS_TINT, chroma, hue }));
    const turn = Math.abs(tint.hue - hue);

    assert.ok(
      Math.abs(tint.lightness - LIGHTNESS_TINT) < ROOM_LIGHTNESS,
      color,
    );
    assert.ok(Math.min(turn, 360 - turn) < ROOM_HUE, color);
    assert.ok(tint.chroma < chroma, color);
    assert.ok(tint.chroma > 0, color);
  });
});

test("a colour that asks for far too much strength keeps the most that a screen can show", () => {
  const shown = getOklch(getColor(COLOR_WILD));

  assert.ok(shown.chroma > CHROMA_KEPT);
  assert.ok(Math.abs(shown.lightness - COLOR_WILD.lightness) < ROOM_LIGHTNESS);
});

test("a colour with no strength is a grey", () => {
  const grey = getColor({ lightness: 0.5, chroma: 0, hue: 0 });
  const pairs = grey.slice(1).match(/.{2}/g) || [];

  assert.equal(new Set(pairs).size, 1);
});

test("a value that is no hex colour with six digits is refused", () => {
  assert.throws(() => getOklch("#fff"), /not a hex colour/);
  assert.throws(() => getOklch("blue"), /not a hex colour/);
});
