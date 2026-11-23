import assert from "node:assert/strict";
import test from "node:test";

import FONTS from "./fonts";
import TYPE, { getSize, SCREEN_LAPTOP, SCREEN_PHONE, SIZE_LEAST } from "./type";
import type { TypeStepID } from "./type";

// The steps set in Gilroy, from the largest to the smallest.
const STEPS_SANS: TypeStepID[] = [
  "display",
  "title",
  "heading",
  "subheading",
  "body",
  "note",
];

test("the eight steps keep their fonts, weights, sizes and line heights", () => {
  const steps = Object.fromEntries(
    Object.entries(TYPE).map(([id, step]) => [
      id,
      [
        step.font,
        step.weight,
        step.sizePhone,
        step.sizeLaptop,
        step.leading.value,
        step.leading.unit,
        step.tracking,
        step.isUppercase,
      ],
    ]),
  );

  assert.deepEqual(steps, {
    display: ["sans", 800, 44, 96, 100, "percent", -0.04, false],
    title: ["sans", 800, 36, 60, 105, "percent", -0.02, false],
    heading: ["sans", 800, 28, 40, 115, "percent", -0.02, false],
    subheading: ["sans", 700, 20, 24, 120, "percent", 0, false],
    body: ["sans", 400, 18, 18, 28, "pixels", 0, false],
    note: ["sans", 400, 14, 14, 20, "pixels", 0, false],
    label: ["mono", 500, 12, 12, 16, "pixels", 0.12, true],
    code: ["mono", 400, 14, 14, 20, "pixels", 0, false],
  });
});

test("every step keeps its name and says what it is used for", () => {
  const words = Object.fromEntries(
    Object.entries(TYPE).map(([id, step]) => [id, [step.name, step.use]]),
  );

  assert.deepEqual(words, {
    display: ["Display", "The one big line of a page."],
    title: ["Title", "Page titles."],
    heading: ["Heading", "Section headings."],
    subheading: ["Subheading", "Block and card titles."],
    body: ["Body", "Reading text."],
    note: ["Note", "Small supporting text."],
    label: ["Label", "Labels and buttons."],
    code: ["Code", "Code and figures."],
  });
});

test("every step uses a font and a weight that the brand has", () => {
  Object.entries(TYPE).forEach(([id, step]) => {
    const weights = FONTS[step.font].weights.map((weight) => weight.value);

    assert.ok(weights.includes(step.weight), id);
  });
});

test("no step is smaller than the least size, and none shrinks on a laptop", () => {
  Object.entries(TYPE).forEach(([id, step]) => {
    assert.ok(step.sizePhone >= SIZE_LEAST, id);
    assert.ok(step.sizeLaptop >= step.sizePhone, id);
  });
});

test("the steps in Gilroy run from the largest to the smallest", () => {
  STEPS_SANS.slice(1).forEach((id, index) => {
    const stepLarger = TYPE[STEPS_SANS[index]];
    const step = TYPE[id];

    assert.ok(stepLarger.sizePhone > step.sizePhone, id);
    assert.ok(stepLarger.sizeLaptop > step.sizeLaptop, id);
  });
});

test("only the label is set in capitals", () => {
  const stepsUppercase = Object.entries(TYPE)
    .filter(([, step]) => step.isUppercase)
    .map(([id]) => id);

  assert.deepEqual(stepsUppercase, ["label"]);
});

test("a size grows evenly from the phone to the laptop, and no further", () => {
  const screenMiddle = (SCREEN_PHONE + SCREEN_LAPTOP) / 2;

  assert.equal(getSize(TYPE.display, SCREEN_PHONE), 44);
  assert.equal(getSize(TYPE.display, screenMiddle), 70);
  assert.equal(getSize(TYPE.display, SCREEN_LAPTOP), 96);
  assert.equal(getSize(TYPE.display, 320), 44);
  assert.equal(getSize(TYPE.display, 1920), 96);
  assert.equal(getSize(TYPE.body, screenMiddle), 18);
});
