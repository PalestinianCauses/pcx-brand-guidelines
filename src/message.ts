// A message of the PCX brand: a block that says what happened, or what to
// mind. It has an icon, a heading and words, and four kinds: wrong,
// warning, success and note. This file holds its type, its sizes, and the
// colour that each kind takes on each ground. Every size is in pixels.

import COLORS, { type ColorID, type GroundsID, GROUNDS } from "./colors";
import getContrast, { CONTRAST_PARTS } from "./contrast";
import { COLOR_WRONG, getWrong, GROUNDS_WRONG } from "./field";
import SHADES, {
  getWordsOn,
  type ShadeStep,
  STEPS_SHADE,
  WORDS_WHITE,
} from "./shades";
import SHAPE from "./shape";
import type { TypeStepID } from "./type";

// A kind of a message.
export type KindsID = "note" | "success" | "warning" | "wrong";

// How urgent a kind is to a screen reader: an alert is read at once when it
// comes onto a page that runs, and a status waits for its turn.
export type Urgency = "alert" | "status";

// What each kind is: the name of the icon of Lucide that it draws, how
// urgent it is, and the brand colour that it takes. A success takes none:
// the brand has no colour that says that a thing went well, and a tick and
// a heading say it.
type Kind = {
  icon: string;
  urgency: Urgency;
  color: ColorID | undefined;
};

// The grounds on which a kind takes its colour. On the other three no
// colour can be read and still be told for what it is, as for a field that
// is wrong.
export const GROUNDS_TINTED: GroundsID[] = GROUNDS_WRONG;

const MESSAGE = {
  // The four kinds, in the order of how urgent they are. Yellow is the
  // brand's colour of a signal, so it is the colour of a warning. Blue is
  // calm, so it is the colour of a note. A message that is wrong takes the
  // colour of a thing that is wrong.
  kinds: {
    wrong: { icon: "circle-alert", urgency: "alert", color: COLOR_WRONG },
    warning: { icon: "triangle-alert", urgency: "alert", color: "yellow" },
    success: { icon: "circle-check", urgency: "status", color: undefined },
    note: { icon: "info", urgency: "status", color: "blue" },
  } as Record<KindsID, Kind>,

  // The step of the type scale for the heading and for the words. Both
  // have one size, so the words are never larger than the heading: the
  // heading leads by its weight and by the strong colour of its ground.
  type: {
    heading: "button",
    words: "note",
  } as Record<"heading" | "words", TypeStepID>,

  // A message has a line at its start, in the colour of its kind, and no
  // box. Only that line and the icon take the colour: the heading and the
  // words keep theirs.
  lineStart: SHAPE.lines.thick,

  // The icon, the room between the icon and the words, and the room
  // between the line and the icon.
  icon: 20,
  gap: 12,
  room: 16,
} as const;

// The colour of a kind on a ground: the colour of its line and of its icon,
// the brand colour that it comes from, and the step of that colour. With
// no brand colour the line and the icon have the colour of the words on
// the ground. With a brand colour and no step they have the brand colour
// itself.
export type Tint = {
  color: string;
  source: ColorID | undefined;
  step: ShadeStep | undefined;
};

// A brand colour itself, and the steps of its scale that are darker than
// it, from the lightest on.
const getDarker = function getDarker(
  source: ColorID,
): [string, ShadeStep | undefined][] {
  const { value } = COLORS[source];
  const scale = SHADES[source];

  // A darker colour stands out more from white.
  const reach = getContrast(value, WORDS_WHITE);

  const steps = STEPS_SHADE.filter(
    (step) => getContrast(scale[step], WORDS_WHITE) > reach,
  ).map((step): [string, ShadeStep | undefined] => [scale[step], step]);

  const darker: [string, ShadeStep | undefined][] = [
    [value, undefined],
    ...steps,
  ];

  return darker;
};

// The colour of a kind on a ground. A message that is wrong takes what a
// field that is wrong takes. A warning and a note take their brand colour
// itself where that stands out from the ground, and the nearest darker
// step where it does not. A success has no colour, and neither has any
// kind on a ground where no colour can be read. A message never rests on
// its colour: its icon and its heading say what kind it is.
export const getTint = function getTint(
  kind: KindsID,
  ground: GroundsID,
): Tint {
  const under = GROUNDS[ground];
  const bare = { color: getWordsOn(under), source: undefined, step: undefined };
  const source = MESSAGE.kinds[kind].color;

  if (kind === "wrong") {
    const { color, step } = getWrong(ground);
    const wrong = step === undefined ? bare : { color, source, step };

    return wrong;
  }

  if (source === undefined || !GROUNDS_TINTED.includes(ground)) return bare;

  const [color, step] =
    getDarker(source).find(
      ([each]) => getContrast(each, under) >= CONTRAST_PARTS,
    ) ?? [];

  const tint = color === undefined ? bare : { color, source, step };
  return tint;
};

export default MESSAGE;
