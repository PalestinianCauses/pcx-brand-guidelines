// Everything the package gives. Each value is imported and then exported by
// its name, so that the built code names every export where Node can read
// it.

import COLORS, { GROUND_DARK, GROUND_LIGHT, SLATE } from "./colors";
import getContrast, {
  CONTRAST_PARTS,
  CONTRAST_WORDS,
  getContrastShown,
  getLuminance,
} from "./contrast";
import FILLS, { COLOR_ACTION, COLORS_PALE, getFill } from "./fills";
import FONTS, { ENDINGS_FONT } from "./fonts";
import ICONS from "./icons";
import LOGO, {
  COLORS_LOGO,
  FILE_LOGO,
  MISUSES_LOGO,
  PRINCIPLES_LOGO,
} from "./logo";
import LOOK, { GROUNDS_ORDER } from "./look";
import getColor, { getOklch } from "./oklch";
import MOTION, {
  getEntranceTime,
  MOTION_REDUCED,
  TIME_FLOW,
  TIME_INSTANT,
} from "./motion";
import SHADES, {
  getShades,
  getStep,
  getWords,
  getWordsOn,
  LIGHTNESS_SHADE,
  STEP_WHITE,
  STEPS_SHADE,
  WORDS_INK,
  WORDS_WHITE,
} from "./shades";
import SHADOW, { getLines } from "./shadow";
import SHAPE, {
  HEIGHT_FINGER,
  POINTER_PRESS,
  SIDE_LEAST,
  SIZES_CONTROL,
  STEP_CONTROL,
  UNIT,
} from "./shape";
import STORY from "./story";
import STRATEGY from "./strategy";
import TYPE, {
  getScaled,
  getSize,
  SCREEN_LAPTOP,
  SCREEN_PHONE,
  SIZE_LEAST,
} from "./type";
import VOICE, { WORDS_HYPE } from "./voice";

export type { Color, ColorID } from "./colors";
export type { Fill } from "./fills";
export type { Font, FontID, FontWeight } from "./fonts";
export type { IconFamily } from "./icons";
export type { LogoRule } from "./logo";
export type { GroundsKind, TraitLook } from "./look";
export type { Oklch } from "./oklch";
export type { Shades, ShadeStep } from "./shades";
export type { ShadowState } from "./shadow";
export type { SizeID } from "./shape";
export type { StoryID, StoryPart, StoryQuote } from "./story";
export type { Offer, StrategyPoint } from "./strategy";
export type { Leading, TypeStep, TypeStepID } from "./type";
export type { VoiceLayer, VoicePlace, VoicePoint } from "./voice";

export {
  COLOR_ACTION,
  COLORS,
  COLORS_LOGO,
  COLORS_PALE,
  CONTRAST_PARTS,
  CONTRAST_WORDS,
  ENDINGS_FONT,
  FILE_LOGO,
  FILLS,
  FONTS,
  getColor,
  getContrast,
  getContrastShown,
  getEntranceTime,
  getFill,
  getLines,
  getLuminance,
  getOklch,
  getScaled,
  getShades,
  getSize,
  getStep,
  getWords,
  getWordsOn,
  GROUND_DARK,
  GROUND_LIGHT,
  GROUNDS_ORDER,
  HEIGHT_FINGER,
  ICONS,
  LIGHTNESS_SHADE,
  LOGO,
  LOOK,
  MISUSES_LOGO,
  MOTION,
  MOTION_REDUCED,
  POINTER_PRESS,
  PRINCIPLES_LOGO,
  SCREEN_LAPTOP,
  SCREEN_PHONE,
  SHADES,
  SHADOW,
  SHAPE,
  SIDE_LEAST,
  SIZE_LEAST,
  SIZES_CONTROL,
  SLATE,
  STEP_CONTROL,
  STEP_WHITE,
  STEPS_SHADE,
  STORY,
  STRATEGY,
  TIME_FLOW,
  TIME_INSTANT,
  TYPE,
  UNIT,
  VOICE,
  WORDS_HYPE,
  WORDS_INK,
  WORDS_WHITE,
};
