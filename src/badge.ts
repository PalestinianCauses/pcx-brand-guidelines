// A badge of the PCX brand: one or two words that mark a state or a kind.
// It is not pressed. This file holds its kinds, its type, its sizes, and
// its colours on each ground. Every size is in pixels.

import getBlend from "./blend";
import { type ColorID, type GroundsID, GROUNDS, SLATE } from "./colors";
import getContrast, { CONTRAST_PARTS, CONTRAST_WORDS } from "./contrast";
import { COLORS_PALE, SHARES_QUIET } from "./fills";
import { getTint, type KindsID } from "./message";
import SHADES, {
  getWordsOn,
  type ShadeStep,
  STEPS_SHADE,
  WORDS_WHITE,
} from "./shades";
import SHAPE from "./shape";
import type { TypeStepID } from "./type";

// A kind of a badge: a plain one, which marks a kind of thing, and one for
// each kind of a message, which marks a state.
export type BadgesID = "plain" | KindsID;

const BADGE = {
  // The five kinds. A badge of a state draws the icon of that state before
  // its words, the icon that a message of that kind has. So a badge never
  // rests on its colour: its icon and its words say the state. A plain
  // badge has no icon.
  kinds: ["plain", "wrong", "warning", "success", "note"] as BadgesID[],

  // The step of the type scale for its words: Gilroy in sentence case, as
  // the label of a field is.
  type: "button" as TypeStepID,

  // How high a badge is, the room before and after its words, its icon,
  // and the room between its icon and its words.
  height: 24,
  room: 8,
  icon: 14,
  gap: 6,

  // The line around a badge of a state that has a colour: the thin line of
  // the brand.
  line: SHAPE.lines.thin,

  // The step of its scale that the soft fill of a state takes: a deep one
  // on the dark ground, and a pale one on the light ground. A pale colour
  // has the pale step as its own, so that step would be the colour in
  // full: on the light ground it takes the palest step. The light step is
  // for the icon and the line of a state on a deep fill.
  steps: { deep: 900, light: 300, pale: 100, palest: 50 } as Record<
    "deep" | "light" | "pale" | "palest",
    ShadeStep
  >,
} as const;

// The grounds on which a badge of a state has a soft fill in the colour of
// its state, and a line. On a ground in a brand colour a soft fill in
// another colour has no place: there a badge keeps its quiet fill.
export const GROUNDS_SOFT: GroundsID[] = ["dark", "light"];

// The quiet fill of a badge on the two grounds of grey.
const FILLS_GREY: Partial<Record<GroundsID, string>> = {
  dark: SLATE[800],
  light: SLATE[200],
};

// The quiet fill on a ground, as a solid colour. On the dark and on the
// light ground it is a step of the greys. On a ground in a brand colour it
// is the colour of the words on that ground at the share of a quiet
// button: the first of those shares at which words on it can be read.
export const getQuiet = function getQuiet(ground: GroundsID): string {
  const under = GROUNDS[ground];
  const words = getWordsOn(under);

  const blends = SHARES_QUIET.rest.map((share) =>
    getBlend(under, words, share),
  );

  const blend =
    blends.find((each) => getContrast(words, each) >= CONTRAST_WORDS) ?? under;

  const quiet = FILLS_GREY[ground] ?? blend;
  return quiet;
};

// A badge on a ground: its fill, the colour of its words, the colour of
// its icon, and the colour of its line. A plain badge has no icon. A badge
// has a line only where it has a soft fill. `source` is the brand colour
// of its state, where the state shows one. `stepFill` is the step of that
// colour's scale which fills the badge, where its fill is soft. `stepIcon`
// is the step of the icon: with a brand colour and no step, the icon has
// the brand colour itself.
export type Badge = {
  fill: string;
  words: string;
  icon: string | undefined;
  line: string | undefined;
  source: ColorID | undefined;
  stepFill: ShadeStep | undefined;
  stepIcon: ShadeStep | undefined;
};

// The colour of a state where it stands on the fill of a badge: the colour
// that a message of that kind has on the ground, or the first darker step
// of its scale that stands out from the fill.
const getOnFill = function getOnFill(
  color: string,
  source: ColorID,
  fill: string,
): [string, ShadeStep | undefined] {
  // A darker colour stands out more from white.
  const reach = getContrast(color, WORDS_WHITE);

  const darker = STEPS_SHADE.filter(
    (step) => getContrast(SHADES[source][step], WORDS_WHITE) > reach,
  ).map((step): [string, ShadeStep | undefined] => [
    SHADES[source][step],
    step,
  ]);

  const found = darker.find(
    ([each]) => getContrast(each, fill) >= CONTRAST_PARTS,
  );

  const isClear = getContrast(color, fill) >= CONTRAST_PARTS;
  const colored: [string, ShadeStep | undefined] = [color, undefined];
  const tone = isClear ? colored : (found ?? colored);

  return tone;
};

// The colour of a state where it stands on a deep fill of its own colour:
// the light step of its scale, or the colour that a message of that kind
// has on the ground where that is the lighter of the two. A colour of
// middle lightness looks weak on a deep fill of its own colour, also where
// what was measured is enough for a part. So the icon is lighter there.
const getOnDeep = function getOnDeep(
  color: string,
  source: ColorID,
  step: ShadeStep | undefined,
): [string, ShadeStep | undefined] {
  const { light } = BADGE.steps;
  const lighter = SHADES[source][light];

  // A lighter colour stands out less from white.
  const isLighter =
    getContrast(lighter, WORDS_WHITE) < getContrast(color, WORDS_WHITE);

  const tone: [string, ShadeStep | undefined] = isLighter
    ? [lighter, light]
    : [color, step];

  return tone;
};

// The step of the soft fill of a colour on a ground.
const getSoft = function getSoft(
  source: ColorID,
  ground: GroundsID,
): ShadeStep {
  const { deep, pale, palest } = BADGE.steps;
  const light = COLORS_PALE.includes(source) ? palest : pale;
  const step = ground === "dark" ? deep : light;

  return step;
};

// A badge of a kind on a ground.
//
// Its words have the colour of the words on the ground, whatever its kind
// is: no words take the colour of a state.
//
// A plain badge marks no state, and a success has no colour, as in a
// message. Both have the quiet fill, and so has every badge on a ground
// where no colour can be read. There the icon has the colour of the words.
//
// On the dark and on the light ground a state that has a colour has a soft
// fill in that colour, and a thin line in the colour of its icon. A deep
// fill can't carry its colour alone on the dark ground, so the line
// carries it, and the light ground has the same line.
//
// On the purple ground a state keeps the quiet fill, and its icon alone
// has its colour.
//
// The icon takes the colour that a message of that kind has on the ground
// where that stands out from the fill, and a darker step where it does
// not. On the deep fill of the dark ground it takes the light step of its
// scale, where that is lighter than the colour of the state.
export const getBadge = function getBadge(
  kind: BadgesID,
  ground: GroundsID,
): Badge {
  const quiet = getQuiet(ground);
  const words = getWordsOn(GROUNDS[ground]);

  const bare = {
    fill: quiet,
    words,
    line: undefined,
    source: undefined,
    stepFill: undefined,
    stepIcon: undefined,
  };

  if (kind === "plain") return { ...bare, icon: undefined };

  const tint = getTint(kind, ground);
  const { source } = tint;

  if (source === undefined) return { ...bare, icon: words };

  const isSoft = GROUNDS_SOFT.includes(ground);
  const stepFill = isSoft ? getSoft(source, ground) : undefined;
  const fill = stepFill === undefined ? quiet : SHADES[source][stepFill];
  const [found, darker] = getOnFill(tint.color, source, fill);
  const stepFound = found === tint.color ? tint.step : darker;

  const [icon, stepIcon] =
    stepFill === BADGE.steps.deep
      ? getOnDeep(found, source, stepFound)
      : [found, stepFound];

  const badge = {
    fill,
    words,
    icon,
    line: isSoft ? icon : undefined,
    source,
    stepFill,
    stepIcon,
  };

  return badge;
};

export default BADGE;
