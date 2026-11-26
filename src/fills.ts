// The fill of a main button in each of the four brand colours: the step of
// the colour's scale that fills it, the step under the pointer, and the
// words on it.
//
// A fill is the first step of a scale that takes white words, and one step
// darker under the pointer. A pale colour is the exception: it keeps its own
// step, with ink words.

import COLORS, {
  type ColorID,
  GROUND_DARK,
  GROUND_LIGHT,
  type GroundsID,
  GROUNDS,
  SLATE,
} from "./colors";
import getContrast, { CONTRAST_PARTS } from "./contrast";
import SHADES, {
  getStep,
  getWords,
  getWordsOn,
  type ShadeStep,
  STEP_WHITE,
  STEPS_SHADE,
  WORDS_INK,
  WORDS_WHITE,
} from "./shades";

// A fill: its step and its colour, at rest and under the pointer, the
// colour of its words, and whether it stands out as a shape from the
// darkest and from the lightest grey.
export type Fill = {
  step: ShadeStep;
  stepHover: ShadeStep;
  color: string;
  colorHover: string;
  words: string;
  isClearOnDark: boolean;
  isClearOnLight: boolean;
};

// The colours that keep their own step as a fill, with ink words. A yellow
// that is dark enough for white words is no yellow any more.
export const COLORS_PALE: ColorID[] = ["yellow"];

// The colour of the main button of a view: the brand's colour of an action.
export const COLOR_ACTION: ColorID = "blue";

// The next darker step of a scale. The darkest step has none, and gives
// itself.
const getDarker = function getDarker(step: ShadeStep): ShadeStep {
  const place = STEPS_SHADE.indexOf(step);
  const stepDarker = STEPS_SHADE[place + 1] || step;

  return stepDarker;
};

// The fill of a main button in one brand colour.
export const getFill = function getFill(id: ColorID): Fill {
  const isPale = COLORS_PALE.includes(id);
  const step = isPale ? getStep(COLORS[id].value) : STEP_WHITE;
  const stepHover = getDarker(step);
  const color = SHADES[id][step];

  const fill = {
    step,
    stepHover,
    color,
    colorHover: SHADES[id][stepHover],
    words: getWords(step),
    isClearOnDark: getContrast(color, GROUND_DARK) >= CONTRAST_PARTS,
    isClearOnLight: getContrast(color, GROUND_LIGHT) >= CONTRAST_PARTS,
  };

  return fill;
};

const FILLS: Record<ColorID, Fill> = {
  purple: getFill("purple"),
  blue: getFill("blue"),
  pink: getFill("pink"),
  yellow: getFill("yellow"),
};

// The brand colours whose fill stands out from a ground: the two reach the
// contrast that a part needs. From the blue and from the pink ground no
// fill in a brand colour stands out.
export const getFillsClear = function getFillsClear(
  ground: GroundsID,
): ColorID[] {
  const ids = Object.keys(FILLS) as ColorID[];
  const clear = ids.filter(
    (id) => getContrast(FILLS[id].color, GROUNDS[ground]) >= CONTRAST_PARTS,
  );

  return clear;
};

// The fill of the main button of a ground: its colour, at rest and under
// the pointer, and the colour of its words.
export type MainFill = {
  color: string;
  colorHover: string;
  words: string;
};

// The main button of a ground. On the dark and on the light ground it is
// the fill of the brand's colour of an action. No fill in a brand colour
// stands out from every ground in a brand colour, so there the main button
// has the colour of the words on that ground, white or ink. Its own words
// have the other of the two, and under the pointer it is the grey one step
// from its fill.
export const getMainFill = function getMainFill(ground: GroundsID): MainFill {
  const { color, colorHover, words } = FILLS[COLOR_ACTION];
  const strong = getWordsOn(GROUNDS[ground]);
  const isWhite = strong === WORDS_WHITE;

  const fill =
    ground === "dark" || ground === "light"
      ? { color, colorHover, words }
      : {
          color: strong,
          colorHover: isWhite ? SLATE[200] : SLATE[800],
          words: isWhite ? WORDS_INK : WORDS_WHITE,
        };

  return fill;
};

// How much of the colour of the words on a ground in a brand colour a
// quiet fill takes, of 100, from the strongest to the weakest: a secondary
// button at rest, and an outline or a ghost button under the pointer. A
// ground takes the strongest share at which the words on the fill still
// reach what words need. `mixed` is how much of the text colour a secondary
// button mixes into its fill under the pointer.
export const SHARES_QUIET = {
  rest: [8, 6, 4],
  pointer: [12, 10, 8],
  mixed: 5,
} as const;

export default FILLS;
