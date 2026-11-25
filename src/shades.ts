// The shades and tints of the four brand colours. Each colour has a scale of
// steps, named as the slate is: from 50, the lightest, to 950, the darkest.
// The lighter steps are tints, and the darker steps are shades.
//
// A brand colour itself does not change. It is one step of its own scale:
// the step whose lightness is nearest to its own. Every other step has the
// hue of the colour, the lightness of the step, and as much of the colour's
// strength as a screen can show. A test holds every value.

import COLORS, { type ColorID, SLATE } from "./colors";
import getColor, { getOklch } from "./oklch";

export type ShadeStep =
  50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type Shades = Record<ShadeStep, string>;

// The steps of a scale, from the lightest to the darkest.
export const STEPS_SHADE: ShadeStep[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
];

// How light each step is, from 0 for black to 1 for white. The steps of
// 600 and darker are dark enough for white words, and the lighter ones are
// light enough for ink words. A test measures both.
export const LIGHTNESS_SHADE: Record<ShadeStep, number> = {
  50: 0.96,
  100: 0.92,
  200: 0.86,
  300: 0.8,
  400: 0.72,
  500: 0.64,
  600: 0.56,
  700: 0.48,
  800: 0.4,
  900: 0.32,
  950: 0.22,
};

// The first step that takes white words. A lighter step takes ink words.
export const STEP_WHITE: ShadeStep = 600;

// The two colours of words on a step: white, and the darkest grey as ink.
export const WORDS_WHITE = "#ffffff";
export const WORDS_INK = SLATE[950];

// The step of a scale that a colour sits at: the one whose lightness is
// nearest to the colour's own.
export const getStep = function getStep(color: string): ShadeStep {
  const { lightness } = getOklch(color);

  const [step] = [...STEPS_SHADE].sort(
    (stepOne, stepTwo) =>
      Math.abs(LIGHTNESS_SHADE[stepOne] - lightness) -
      Math.abs(LIGHTNESS_SHADE[stepTwo] - lightness),
  );

  return step;
};

// The scale of a colour. The colour keeps its own value at its own step.
export const getShades = function getShades(color: string): Shades {
  const { chroma, hue } = getOklch(color);
  const stepOwn = getStep(color);

  const entries = STEPS_SHADE.map((step) => [
    step,
    step === stepOwn
      ? color.toLowerCase()
      : getColor({ lightness: LIGHTNESS_SHADE[step], chroma, hue }),
  ]);

  const shades = Object.fromEntries(entries) as Shades;
  return shades;
};

// The colour of the words on a step, in every scale: white on a step of
// 600 or darker, and ink on a lighter one.
export const getWords = function getWords(step: ShadeStep): string {
  const words = step >= STEP_WHITE ? WORDS_WHITE : WORDS_INK;
  return words;
};

const SHADES: Record<ColorID, Shades> = {
  purple: getShades(COLORS.purple.value),
  blue: getShades(COLORS.blue.value),
  pink: getShades(COLORS.pink.value),
  yellow: getShades(COLORS.yellow.value),
};

export default SHADES;
