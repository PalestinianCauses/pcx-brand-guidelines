// A field of the PCX brand: a control that a person types in, with its
// label, its hint and its error. Most of a field follows what the button
// settled: its height is the height of a control, its corners are square,
// and its focus is the focus of every part. This file holds what is its
// own: its type, and the colour of a field that is wrong.

import { type ColorID, type GroundsID, GROUNDS } from "./colors";
import getContrast, { CONTRAST_WORDS } from "./contrast";
import SHADES, { getWordsOn, type ShadeStep, WORDS_WHITE } from "./shades";
import SHAPE from "./shape";
import type { TypeStepID } from "./type";

// A part of a field that is set in words.
export type PartField = "error" | "hint" | "label" | "words";

// The colour of a thing that is wrong: the brand's pink.
export const COLOR_WRONG: ColorID = "pink";

// The grounds on which a field that is wrong takes that colour. On the
// other three it has none.
export const GROUNDS_WRONG: GroundsID[] = ["dark", "light", "purple"];

const FIELD = {
  // The step of the type scale for each part. The label is Gilroy in
  // sentence case, at the size and the weight of the words of a button. The
  // words that a person types are running text, and the hint and the error
  // are notes.
  type: {
    label: "button",
    words: "body",
    hint: "note",
    error: "note",
  } as Record<PartField, TypeStepID>,

  // The least size of the words in a field, in pixels. Under it a phone
  // zooms in on a field that takes the keyboard.
  sizeLeast: 16,

  // A field that is wrong. Its line and its error take the colour, and its
  // label and its hint keep theirs. It never rests on its colour: an icon
  // and words say what is wrong. Where it has no colour, its line is this
  // much thicker, in pixels, and has the colour of the words on the ground.
  wrong: {
    color: COLOR_WRONG,
    grounds: GROUNDS_WRONG,
    thicker: SHAPE.lines.thin,

    // The steps that the colour can take, from the step that takes white
    // words away from the ground: lighter on a ground with white words,
    // and darker on every other one.
    stepsLighter: [600, 500, 400, 300] as ShadeStep[],
    stepsDarker: [600, 700, 800] as ShadeStep[],
  },
} as const;

// A field that is wrong on a ground: the colour of its line and of its
// error, the step of that colour where it has one, and how much thicker
// its line is, in pixels.
export type Wrong = {
  color: string;
  step: ShadeStep | undefined;
  thicker: number;
};

// A field that is wrong on a ground. Where it takes the colour, that is the
// step nearest to 600 at which words in it reach what words need. Where it
// takes none, its line is the colour of the words on the ground, and
// thicker.
export const getWrong = function getWrong(ground: GroundsID): Wrong {
  const { grounds, stepsDarker, stepsLighter, thicker } = FIELD.wrong;
  const color = GROUNDS[ground];
  const strong = getWordsOn(color);
  const steps = strong === WORDS_WHITE ? stepsLighter : stepsDarker;
  const scale = SHADES[COLOR_WRONG];

  const step = grounds.includes(ground)
    ? steps.find((each) => getContrast(scale[each], color) >= CONTRAST_WORDS)
    : undefined;

  const wrong =
    step === undefined
      ? { color: strong, step, thicker }
      : { color: scale[step], step, thicker: 0 };

  return wrong;
};

export default FIELD;
