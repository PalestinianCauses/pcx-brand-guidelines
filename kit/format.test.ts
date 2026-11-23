import assert from "node:assert/strict";
import test from "node:test";

import { format, resolveConfig } from "prettier";

const SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">',
  '<g fill="none"><path d="M4 12h16"/>',
  '<text x="1" y="2">one  two <tspan>three</tspan></text></g></svg>',
  "",
].join("");

const SVG_FORMATTED = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">',
  '  <g fill="none">',
  '    <path d="M4 12h16" />',
  '    <text x="1" y="2">one  two <tspan>three</tspan></text>',
  "  </g>",
  "</svg>",
  "",
].join("\n");

const formatFile = async function formatFile(
  text: string,
  file: string,
): Promise<string> {
  const options = await resolveConfig(file);
  const textFormatted = await format(text, { ...options, filepath: file });

  return textFormatted;
};

test("an SVG file is laid out on lines, and its text is left as it is", async () => {
  assert.equal(await formatFile(SVG, "kit/sample.svg"), SVG_FORMATTED);
});

test("the lock file is formatted like the rest", async () => {
  const text = "lockfileVersion: '9.0'\n\n\nsettings:\n  a: true\n";
  const textFormatted = 'lockfileVersion: "9.0"\n\nsettings:\n  a: true\n';

  assert.equal(await formatFile(text, "pnpm-lock.yaml"), textFormatted);
});

test("code is formatted with double quotes, semicolons and trailing commas", async () => {
  const text = "export const sample = ['one',\n'two']\n";
  const textFormatted = 'export const sample = ["one", "two"];\n';

  assert.equal(await formatFile(text, "kit/sample.ts"), textFormatted);
});
