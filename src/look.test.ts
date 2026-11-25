import assert from "node:assert/strict";
import test from "node:test";

import LOOK, { GROUNDS_ORDER } from "./look";
import SHAPE from "./shape";
import STRATEGY from "./strategy";
import TYPE from "./type";

// The words that the line on the grounds names its kinds with, in the
// order of the kinds.
const WORDS_GROUNDS = ["dark", "light", "brand colour"];

// The rule of a trait with this name, wherever it stands.
const getNote = function getNote(name: string): string {
  const rules = LOOK.traits.list.flatMap((trait) => trait.rules);
  const note = rules.find((rule) => rule.name === name)?.note;

  return note || "";
};

test("the look keeps every line, word for word", () => {
  assert.deepEqual(LOOK, {
    traits: {
      name: "What each trait looks like",
      list: [
        {
          trait: "Structural, not decorative.",
          rules: [
            {
              name: "Structure shown.",
              note: "A page shows its structure: divider lines between sections and margins with lines, as on the Tailwind CSS website.",
            },
            {
              name: "Nothing only to fill.",
              note: "Nothing is on a page only to fill it. A line, a shape or a picture is there because it holds something or means something.",
            },
          ],
        },
        {
          trait: "Direct, not loud.",
          rules: [
            {
              name: "Large type.",
              note: "Large type is in capitals at weight 950. The other type stays as it is.",
            },
            {
              name: "Hard shadow.",
              note: "A hard shadow only where it contrasts well with the ground and with the part, and where the part has no border.",
            },
            {
              name: "Flat or hard.",
              note: "A thing is flat, or it has the hard shadow. No soft shadow, no glow, and no gradient for effect.",
            },
          ],
        },
        {
          trait: "Precise, not showy.",
          rules: [
            {
              name: "ShadCN first.",
              note: "Every part starts from ShadCN's own, through its CLI. ShadCN is the floor for the code and the design quality.",
            },
            {
              name: "ShadCN, then PCX.",
              note: "A part starts from ShadCN and then takes the PCX theme: its type, its colours, its corners and its shadow. ShadCN gives the quality, and PCX gives the look.",
            },
            {
              name: "Numbers.",
              note: "Corners are square. Sizes, spaces and contrast are numbers, and tests hold them.",
            },
          ],
        },
        {
          trait: "Close, not corporate.",
          rules: [
            {
              name: "One person.",
              note: "The look describes the person behind PCX: an engineer who loves code, maths and logic.",
            },
          ],
        },
      ],
    },
    grounds: {
      name: "Grounds",
      note: "Grounds: mostly dark, then light, then a brand colour.",
    },
    relatives: {
      name: "Relatives",
      points: [
        {
          name: "IBM.",
          note: "The closest relative is IBM. Its design language says how IBM looks, and Carbon builds the parts on it.",
        },
        {
          name: "Two layers.",
          note: "PCX has the same two layers. The brand guidelines say how PCX looks, and the design system builds the parts on them, from ShadCN.",
        },
        {
          name: "Not Apple.",
          note: "PCX is not of Apple's kind: not soft, not round, not translucent.",
        },
        {
          name: "PCX's own.",
          note: "PCX's own, beside IBM: heavy capitals in Gilroy, four strong colours, the dark ground first, the hard shadow, and the lines of the Tailwind CSS website.",
        },
      ],
    },
    illustrations: {
      name: "Illustrations",
      points: [
        {
          name: "A meaning.",
          note: "No illustration without a meaning. No random shapes, and none from advanced calculus.",
        },
        {
          name: "A system.",
          note: "Illustrations are made by a system of rules, as the brand guidelines and the design system are. No illustrator is needed.",
        },
        {
          name: "IBM as the model.",
          note: "IBM's illustrations are the model: each has a job, and each is drawn on a grid from a few shapes and angles.",
        },
        {
          name: "A character.",
          note: "A character may stand for PCX, as Brilliant has one. That is decided with the illustrations.",
        },
      ],
    },
  });
});

test("the traits of the look are the traits of the personality, in the same order", () => {
  const traits = LOOK.traits.list.map((trait) => trait.trait);
  const traitsOwn = STRATEGY.personality.points.map((point) => point.name);

  assert.deepEqual(traits, traitsOwn);
});

test("every trait of the look has a rule, and no two rules share a name", () => {
  const rules = LOOK.traits.list.flatMap((trait) => trait.rules);
  const names = rules.map((rule) => rule.name);

  assert.ok(LOOK.traits.list.every((trait) => trait.rules.length > 0));
  assert.ok(rules.every((rule) => rule.name !== "" && rule.note !== ""));
  assert.equal(new Set(names).size, names.length);
});

test("the line on large type says what the type scale does", () => {
  const steps = Object.values(TYPE);
  const stepsLarge = steps.filter(
    (step) => step.isUppercase && step.font === "sans",
  );
  const weights = [...new Set(stepsLarge.map((step) => step.weight))];
  const note = getNote("Large type.");

  // Every step that is set in capitals in the brand's own font has one
  // weight, and the line names it.
  assert.ok(stepsLarge.length > 0);
  assert.equal(weights.length, 1);
  assert.ok(note.includes("capitals"));
  assert.ok(note.includes(String(weights[0])));
});

test("the line on corners says what the shape does", () => {
  assert.equal(SHAPE.corner, 0);
  assert.ok(getNote("Numbers.").includes("Corners are square."));
});

test("the grounds are in order: dark, then light, then a brand colour", () => {
  const places = WORDS_GROUNDS.map((word) => LOOK.grounds.note.indexOf(word));

  assert.deepEqual(GROUNDS_ORDER, ["dark", "light", "color"]);
  assert.equal(WORDS_GROUNDS.length, GROUNDS_ORDER.length);
  assert.ok(places.every((place) => place >= 0));
  assert.deepEqual(
    [...places].sort((one, two) => one - two),
    places,
  );
});
