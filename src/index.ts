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
import FONTS, { ENDINGS_FONT } from "./fonts";
import LOGO, {
  COLORS_LOGO,
  FILE_LOGO,
  MISUSES_LOGO,
  PRINCIPLES_LOGO,
} from "./logo";
import MOTION, {
  getEntranceTime,
  MOTION_REDUCED,
  TIME_FLOW,
  TIME_INSTANT,
} from "./motion";
import SHAPE, { HEIGHT_FINGER, UNIT } from "./shape";
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
export type { Font, FontID, FontWeight } from "./fonts";
export type { LogoRule } from "./logo";
export type { StoryID, StoryPart, StoryQuote } from "./story";
export type { Offer, StrategyPoint } from "./strategy";
export type { Leading, TypeStep, TypeStepID } from "./type";
export type { VoiceLayer, VoicePlace, VoicePoint } from "./voice";

export {
  COLORS,
  COLORS_LOGO,
  CONTRAST_PARTS,
  CONTRAST_WORDS,
  ENDINGS_FONT,
  FILE_LOGO,
  FONTS,
  getContrast,
  getContrastShown,
  getEntranceTime,
  getLuminance,
  getScaled,
  getSize,
  GROUND_DARK,
  GROUND_LIGHT,
  HEIGHT_FINGER,
  LOGO,
  MISUSES_LOGO,
  MOTION,
  MOTION_REDUCED,
  PRINCIPLES_LOGO,
  SCREEN_LAPTOP,
  SCREEN_PHONE,
  SHAPE,
  SIZE_LEAST,
  SLATE,
  STORY,
  STRATEGY,
  TIME_FLOW,
  TIME_INSTANT,
  TYPE,
  UNIT,
  VOICE,
  WORDS_HYPE,
};
