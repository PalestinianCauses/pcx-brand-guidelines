// Everything the package gives. Each value is imported and then exported by
// its name, so that the built code names every export where Node can read
// it.

import COLORS, { GROUND_DARK, GROUND_LIGHT, GROUNDS, SLATE } from "./colors";
import getContrast, {
  CONTRAST_PARTS,
  CONTRAST_WORDS,
  getContrastShown,
  getLuminance,
} from "./contrast";
import FIELD, { COLOR_WRONG, getWrong, GROUNDS_WRONG } from "./field";
import FILLS, {
  COLOR_ACTION,
  COLORS_PALE,
  getFill,
  getFillsClear,
  getMainFill,
  SHARES_QUIET,
} from "./fills";
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
import SHADOW, { getLines, getLinesOn } from "./shadow";
import SHAPE, {
  getFocusColor,
  HEIGHT_FINGER,
  isFocusAround,
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

export type { Color, ColorID, GroundsID } from "./colors";
export type { PartField, Wrong } from "./field";
export type { Fill, MainFill } from "./fills";
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
  COLOR_WRONG,
  COLORS,
  COLORS_LOGO,
  COLORS_PALE,
  CONTRAST_PARTS,
  CONTRAST_WORDS,
  ENDINGS_FONT,
  FIELD,
  FILE_LOGO,
  FILLS,
  FONTS,
  getColor,
  getContrast,
  getContrastShown,
  getEntranceTime,
  getFill,
  getFillsClear,
  getFocusColor,
  getLines,
  getLinesOn,
  getLuminance,
  getMainFill,
  getOklch,
  getScaled,
  getShades,
  getSize,
  getStep,
  getWords,
  getWordsOn,
  getWrong,
  GROUND_DARK,
  GROUND_LIGHT,
  GROUNDS,
  GROUNDS_ORDER,
  GROUNDS_WRONG,
  HEIGHT_FINGER,
  ICONS,
  isFocusAround,
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
  SHARES_QUIET,
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
