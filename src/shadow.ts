// The hard shadow of the PCX brand: a band of slanted lines to the right of
// a part and below it. The look says where a hard shadow may stand. This
// file says what it is. Every length is in pixels.

import { type GroundsID, GROUNDS, SLATE } from "./colors";
import type { GroundsKind } from "./look";
import { getWordsOn, WORDS_INK, WORDS_WHITE } from "./shades";
import SHAPE, { UNIT } from "./shape";

// A state of a part in which it has no hard shadow.
export type ShadowState = "focus" | "off" | "pressed";

const SHADOW = {
  // How wide the band is beside the part and below it. A part that is
  // pressed moves by as much, into the place of its shadow.
  reach: 6,

  // The lines of the band: how wide a line is, how far it is from the start
  // of one line to the start of the next, and the angle of the lines in
  // degrees.
  line: SHAPE.lines.thin,
  step: UNIT,
  angle: 135,

  // The colour of the lines on a dark ground and on a light one. Beside a
  // pale part on a dark ground, light lines would not stand out from the
  // part, so the lines are darker there.
  colorDark: SLATE[300],
  colorLight: SLATE[950],
  colorPale: SLATE[500],

  // The states in which a part has no hard shadow. A pressed part stands
  // in the place of its shadow. The focus and the hard shadow never meet.
  // A part that is off casts none.
  without: ["pressed", "focus", "off"] as ShadowState[],
} as const;

// The colour of the lines of the hard shadow beside a part, on a dark or on
// a light ground. A pale part is one that takes ink words.
export const getLines = function getLines(
  part: string,
  ground: Exclude<GroundsKind, "color">,
): string {
  const isPale = getWordsOn(part) === WORDS_INK;
  const colorDark = isPale ? SHADOW.colorPale : SHADOW.colorDark;
  const lines = ground === "dark" ? colorDark : SHADOW.colorLight;

  return lines;
};

// The colour of the lines beside a part on any ground, by the name of the
// ground. A ground whose words are white takes the lines of a dark ground,
// and every other ground takes the lines of a light one. So the lines are
// ink on the blue, the pink and the yellow ground, and those of a dark
// ground on the purple one. The main button of a ground in a brand colour
// has the colour of the words on that ground. Beside it the lines are the
// plain lines of the ground, also where it is pale: they stand out from the
// ground, and the band reads because it is hatched and the button is not.
// On the dark and on the light ground a pale part keeps the darker lines.
export const getLinesOn = function getLinesOn(
  part: string,
  ground: GroundsID,
): string {
  const strong = getWordsOn(GROUNDS[ground]);
  const isDark = strong === WORDS_WHITE;
  const plain = isDark ? SHADOW.colorDark : SHADOW.colorLight;
  const isColor = ground !== "dark" && ground !== "light";
  const isMain = isColor && part.toLowerCase() === strong.toLowerCase();
  const lines = isMain ? plain : getLines(part, isDark ? "dark" : "light");

  return lines;
};

export default SHADOW;
