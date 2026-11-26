// The fill of a main button in each of the four brand colours: the step of
// the colour's scale that fills it, the step under the pointer, and the
// words on it.
//
// A fill is the first step of a scale that takes white words, and one step
// darker under the pointer. A pale colour is the exception: it keeps its own
// step, with ink words.

import COLORS, { type ColorID, GROUND_DARK, GROUND_LIGHT } from "./colors";
import getContrast, { CONTRAST_PARTS } from "./contrast";
import SHADES, {
  getStep,
  getWords,
  type ShadeStep,
  STEP_WHITE,
  STEPS_SHADE,
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

export default FILLS;
