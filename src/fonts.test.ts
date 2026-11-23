import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";

import FONTS, { ENDINGS_FONT } from "./fonts";

// Folders that hold installed packages and git's own files, not this
// repository's files.
const FOLDERS_LEFT_OUT = ["node_modules", ".git"];

const isFontFile = function isFontFile(path: string): boolean {
  const isFont = ENDINGS_FONT.some((ending) =>
    path.toLowerCase().endsWith(ending),
  );

  return isFont;
};

test("the two fonts keep their names, their weights and their licenses", () => {
  assert.deepEqual(FONTS, {
    sans: {
      name: "Gilroy",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      weights: [
        { name: "Thin", value: 100 },
        { name: "UltraLight", value: 200 },
        { name: "Light", value: 300 },
        { name: "Regular", value: 400 },
        { name: "Medium", value: 500 },
        { name: "SemiBold", value: 600 },
        { name: "Bold", value: 700 },
        { name: "ExtraBold", value: 800 },
        { name: "Black", value: 900 },
        { name: "Heavy", value: 950 },
      ],
      license: "Commercial",
      isFreeToShare: false,
    },
    mono: {
      name: "JetBrains Mono",
      fallbacks: ["ui-monospace", "SFMono-Regular", "monospace"],
      weights: [
        { name: "Regular", value: 400 },
        { name: "Medium", value: 500 },
        { name: "SemiBold", value: 600 },
        { name: "Bold", value: 700 },
      ],
      license: "SIL Open Font License 1.1",
      isFreeToShare: true,
    },
  });
});

test("the weights of a font go from the lightest to the heaviest", () => {
  Object.values(FONTS).forEach((font) => {
    const values = font.weights.map((weight) => weight.value);
    const valuesSorted = [...values].sort((one, two) => one - two);

    assert.deepEqual(values, valuesSorted);
    assert.equal(new Set(values).size, values.length);
  });
});

test("Gilroy is not free to share, and JetBrains Mono is", () => {
  assert.equal(FONTS.sans.isFreeToShare, false);
  assert.equal(FONTS.mono.isFreeToShare, true);
});

test("this repository holds no font file", async () => {
  const paths = await readdir(".", { recursive: true });
  const fontFiles = paths.filter(
    (path) =>
      isFontFile(path) &&
      !FOLDERS_LEFT_OUT.some((folder) => path.split("/").includes(folder)),
  );

  assert.deepEqual(fontFiles, []);
});

test("a file is a font file by the ending of its name", () => {
  assert.equal(isFontFile("assets/gilroy-heavy.woff2"), true);
  assert.equal(isFontFile("assets/Gilroy-Heavy.OTF"), true);
  assert.equal(isFontFile("src/fonts.ts"), false);
});
