// A link in a text of the PCX brand: words that lead to another page.
// This file holds its line and its colour on each ground. Every size is in
// pixels.

import COLORS, { type ColorID, type GroundsID, GROUNDS } from "./colors";
import { COLOR_ACTION } from "./fills";
import SHADES, { getWordsOn, type ShadeStep } from "./shades";
import SHAPE from "./shape";

const LINK = {
  // The line under a link. A link always has it, on every ground, so a
  // link never rests on its colour. The sample of the link measured why:
  // beside running text its colour stands less than a part needs, on
  // every ground. The line is the thin line of the brand at rest and the
  // thick one under the pointer, and it runs a little under the words.
  line: {
    rest: SHAPE.lines.thin,
    pointer: SHAPE.lines.thick,
    away: 4,
  },

  // The step of the brand's colour of an action that a link takes on the
  // light ground. The colour itself can't be read as words there.
  stepLight: 700 as ShadeStep,
} as const;

// The grounds on which a link has the brand's colour of an action. On a
// ground in a brand colour a link has the colour of the words, and its
// line tells it from them.
export const GROUNDS_LINK: GroundsID[] = ["dark", "light"];

// The colour of a link on a ground, with the brand colour that it comes
// from and the step of that colour. With no brand colour it has the colour
// of the words on the ground. With a brand colour and no step it has the
// brand colour itself.
export type Link = {
  color: string;
  source: ColorID | undefined;
  step: ShadeStep | undefined;
};

// A link on a ground. It keeps the type of the words around it: their
// size, their weight and their line height. With the keyboard on it, it
// has the line of the focus around it, as wide and as far away as the
// shape of the brand sets it. It has no look of its own once it was
// visited.
//
// A link is an action, so it has the brand's colour of an action where
// that can be read: the colour itself on the dark ground, and a dark step
// of it on the light ground.
export const getLink = function getLink(ground: GroundsID): Link {
  const words = getWordsOn(GROUNDS[ground]);
  const bare = { color: words, source: undefined, step: undefined };

  if (!GROUNDS_LINK.includes(ground)) return bare;

  const source = COLOR_ACTION;
  const step = ground === "light" ? LINK.stepLight : undefined;
  const color =
    step === undefined ? COLORS[source].value : SHADES[source][step];

  const link = { color, source, step };
  return link;
};

export default LINK;
