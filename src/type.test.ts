import assert from "node:assert/strict";
import test from "node:test";

import FONTS from "./fonts";
import TYPE, {
  getScaled,
  getSize,
  SCREEN_LAPTOP,
  SCREEN_PHONE,
  SIZE_LEAST,
} from "./type";
import type { TypeStepID } from "./type";

// The four headings, from the largest to the smallest.
const STEPS_HEADING: TypeStepID[] = [
  "display",
  "title",
  "heading",
  "subheading",
];

// The least line height of reading text, as a percentage of its size.
const LEADING_LEAST = 150;

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
    display: ["sans", 950, 54, 98, 92, "percent", -0.032, true],
    title: ["sans", 950, 46, 88, 94, "percent", -0.032, true],
    heading: ["sans", 950, 38, 80, 96, "percent", -0.032, true],
    subheading: ["sans", 950, 24, 24, 100, "percent", -0.02, true],
    body: ["sans", 500, 16, 18, 160, "percent", 0, false],
    note: ["sans", 500, 15, 15, 150, "percent", 0, false],
    label: ["mono", 500, 12, 12, 16, "pixels", 0.14, true],
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

test("the four headings and the label are shown in capitals, and no other step is", () => {
  const stepsUppercase = Object.entries(TYPE)
    .filter(([, step]) => step.isUppercase)
    .map(([id]) => id);

  assert.deepEqual(stepsUppercase, [...STEPS_HEADING, "label"]);
});

test("every heading is set in the heaviest weight of Gilroy", () => {
  const weights = FONTS.sans.weights.map((weight) => weight.value);
  const weightHeaviest = Math.max(...weights);

  STEPS_HEADING.forEach((id) => {
    assert.equal(TYPE[id].weight, weightHeaviest, id);
  });
});

test("a line of reading text is at least one and a half times its size", () => {
  const leadings = [TYPE.body.leading, TYPE.note.leading];

  leadings.forEach((leading) => {
    assert.equal(leading.unit, "percent");
    assert.ok(leading.value >= LEADING_LEAST);
  });
});

test("a value grows evenly from the phone to the laptop, and no further", () => {
  const screenMiddle = (SCREEN_PHONE + SCREEN_LAPTOP) / 2;

  assert.equal(getScaled(48, 96, SCREEN_PHONE), 48);
  assert.equal(getScaled(48, 96, screenMiddle), 72);
  assert.equal(getScaled(48, 96, SCREEN_LAPTOP), 96);
  assert.equal(getScaled(48, 96, 320), 48);
  assert.equal(getScaled(48, 96, 1920), 96);
  assert.equal(getScaled(96, 96, screenMiddle), 96);
});

test("the size of a step grows in the same way", () => {
  const screenMiddle = (SCREEN_PHONE + SCREEN_LAPTOP) / 2;

  assert.equal(getSize(TYPE.display, SCREEN_PHONE), 54);
  assert.equal(getSize(TYPE.display, screenMiddle), 76);
  assert.equal(getSize(TYPE.display, SCREEN_LAPTOP), 98);
  assert.equal(getSize(TYPE.display, 320), 54);
  assert.equal(getSize(TYPE.display, 1920), 98);
  assert.equal(getSize(TYPE.body, screenMiddle), 17);
  assert.equal(getSize(TYPE.note, screenMiddle), 15);
});
