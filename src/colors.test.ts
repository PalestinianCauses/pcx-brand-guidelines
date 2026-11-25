import assert from "node:assert/strict";
import test from "node:test";

import colorsTailwind from "tailwindcss/colors";

import COLORS, { GROUND_DARK, GROUND_LIGHT, SLATE } from "./colors";
import getContrast, { CONTRAST_WORDS } from "./contrast";
import getColor from "./oklch";

const PATTERN_OKLCH = /^oklch\(([\d.]+)% ([\d.]+) ([\d.]+)\)$/;

// A colour in OKLCH, as Tailwind CSS writes it, as a hex value.
const getHex = function getHex(color: string): string {
  const [, lightness, chroma, hue] = (PATTERN_OKLCH.exec(color) || []).map(
    Number,
  );

  const hex = getColor({ lightness: lightness / 100, chroma, hue });
  return hex;
};

test("the four brand colours keep their names, their roles and their values", () => {
  const colors = Object.fromEntries(
    Object.entries(COLORS).map(([id, color]) => [
      id,
      [color.name, color.role, color.value],
    ]),
  );

  assert.deepEqual(colors, {
    purple: ["Deep Tech Purple", "Structure", "#2e1a72"],
    blue: ["Electric Blue", "Action", "#1f8bff"],
    pink: ["Digital Pink", "Creative", "#ff4fa3"],
    yellow: ["Innovation Yellow", "Signal", "#ffd84d"],
  });
});

test("every colour says truly on which ground it can carry words", () => {
  Object.entries(COLORS).forEach(([id, color]) => {
    const isReadableOnDark =
      getContrast(color.value, GROUND_DARK) >= CONTRAST_WORDS;

    const isReadableOnLight =
      getContrast(color.value, GROUND_LIGHT) >= CONTRAST_WORDS;

    assert.equal(color.isReadableOnDark, isReadableOnDark, id);
    assert.equal(color.isReadableOnLight, isReadableOnLight, id);
  });
});

test("the greys are the slate of Tailwind CSS", () => {
  const slateTailwind = Object.fromEntries(
    Object.entries(colorsTailwind.slate).map(([step, color]) => [
      step,
      getHex(color),
    ]),
  );

  assert.deepEqual({ ...SLATE }, slateTailwind);
});

test("the two grounds are the darkest and the lightest grey", () => {
  const contrasts = Object.values(SLATE).map((grey) =>
    getContrast(grey, "#ffffff"),
  );

  assert.equal(getContrast(GROUND_DARK, "#ffffff"), Math.max(...contrasts));
  assert.equal(getContrast(GROUND_LIGHT, "#ffffff"), Math.min(...contrasts));
});
