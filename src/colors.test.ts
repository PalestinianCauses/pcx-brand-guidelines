import assert from "node:assert/strict";
import test from "node:test";

import colorsTailwind from "tailwindcss/colors";

import COLORS, { GROUND_DARK, GROUND_LIGHT, SLATE } from "./colors";
import getContrast, { CONTRAST_WORDS } from "./contrast";

const PATTERN_HEX = /^#[0-9a-f]{6}$/;
const PATTERN_OKLCH = /^oklch\(([\d.]+)% ([\d.]+) ([\d.]+)\)$/;

// One linear channel as two hex digits, with the curve of sRGB applied.
const getPair = function getPair(channel: number): string {
  const share = Math.min(1, Math.max(0, channel));
  const curved =
    share <= 0.0031308 ? 12.92 * share : 1.055 * share ** (1 / 2.4) - 0.055;

  const pair = Math.round(curved * 255)
    .toString(16)
    .padStart(2, "0");

  return pair;
};

// A colour in OKLCH, as Tailwind CSS writes it, as a hex value. The figures
// are the ones that define the OKLab colour space.
const getHex = function getHex(color: string): string {
  const [, lightness, chroma, hue] = (PATTERN_OKLCH.exec(color) || []).map(
    Number,
  );

  const angle = (hue * Math.PI) / 180;
  const axisRed = chroma * Math.cos(angle);
  const axisYellow = chroma * Math.sin(angle);
  const light = lightness / 100;

  const long =
    (light + 0.3963377774 * axisRed + 0.2158037573 * axisYellow) ** 3;
  const medium =
    (light - 0.1055613458 * axisRed - 0.0638541728 * axisYellow) ** 3;
  const short =
    (light - 0.0894841775 * axisRed - 1.291485548 * axisYellow) ** 3;

  const red =
    4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short;
  const green =
    -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short;
  const blue =
    -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short;

  const hex = ["#", getPair(red), getPair(green), getPair(blue)].join("");

  return hex;
};

test("the brand has its four colours, each with a name, a role and a hex value", () => {
  assert.deepEqual(Object.keys(COLORS).sort(), [
    "blue",
    "pink",
    "purple",
    "yellow",
  ]);

  Object.values(COLORS).forEach((color) => {
    assert.match(color.value, PATTERN_HEX);
    assert.notEqual(color.name, "");
    assert.notEqual(color.role, "");
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
