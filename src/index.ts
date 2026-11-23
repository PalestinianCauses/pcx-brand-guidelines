export { default as COLORS, GROUND_DARK, GROUND_LIGHT, SLATE } from "./colors";
export type { Color, ColorID } from "./colors";
export {
  CONTRAST_PARTS,
  CONTRAST_WORDS,
  default as getContrast,
  getLuminance,
} from "./contrast";
export { ENDINGS_FONT, default as FONTS } from "./fonts";
export type { Font, FontID, FontWeight } from "./fonts";
export {
  COLORS_LOGO,
  FILE_LOGO,
  default as LOGO,
  MISUSES_LOGO,
  PRINCIPLES_LOGO,
} from "./logo";
export type { LogoRule } from "./logo";
export {
  getEntranceTime,
  default as MOTION,
  MOTION_REDUCED,
  TIME_FLOW,
  TIME_INSTANT,
} from "./motion";
export { HEIGHT_FINGER, default as SHAPE, UNIT } from "./shape";
export { default as STORY } from "./story";
export type { StoryID, StoryPart, StoryQuote } from "./story";
export { default as STRATEGY } from "./strategy";
export type { Offer, StrategyPoint } from "./strategy";
export {
  getSize,
  SCREEN_LAPTOP,
  SCREEN_PHONE,
  SIZE_LEAST,
  default as TYPE,
} from "./type";
export type { Leading, TypeStep, TypeStepID } from "./type";
export { default as VOICE, WORDS_HYPE } from "./voice";
export type { VoiceLayer, VoicePlace, VoicePoint } from "./voice";
