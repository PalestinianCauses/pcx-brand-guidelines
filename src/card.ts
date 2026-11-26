// A card of the PCX brand: a square block with a head, a body and a foot.
// This file holds what a card is for and what it is not for, its type, its
// sizes, and its colours on each ground. Every size is in pixels.

import getBlend from "./blend";
import { type GroundsID, GROUNDS, SLATE } from "./colors";
import { getQuiet } from "./badge";
import { getWordsOn, WORDS_WHITE } from "./shades";
import type { TypeStepID } from "./type";

const CARD = {
  // What a card is for. It is one element of a design, and it has one job.
  use: "A card holds a piece of content that is one thing: mostly one that is pressed as a whole, such as a service or a case.",

  // What a card is not for. Without these limits a page turns into a wall
  // of cards, which is the look of every page and not the look of PCX.
  limits: [
    "A card is no tool for laying out a page. Spacing, columns and sections are the work of the structure of a page.",
    "A page is not built from cards. Most content stands on its ground, in blocks that thin lines divide.",
    "A card does not stand inside a card.",
  ],

  // The step of the type scale for its heading and for its words. The
  // words are never larger than the heading.
  type: {
    heading: "sub-heading",
    words: "body",
  } as Record<"heading" | "words", TypeStepID>,

  // The room inside a card, the room between its parts, and the arrow of a
  // card that can be pressed.
  room: 24,
  gap: 24,
  arrow: 20,

  // How much of the colour of the words its line takes on a ground in a
  // brand colour, in parts of a hundred: on a ground with white words, and
  // on a ground with ink words. And how much its words take on a ground
  // with white words.
  sharesLine: { white: 14, ink: 20 },
  shareWords: 88,
} as const;

// A card on a ground: its fill, its line, its line under the pointer where
// it can be pressed, and the colour of its words. Every one is a solid
// colour.
export type Card = {
  fill: string;
  line: string;
  linePointer: string;
  words: string;
};

// The cards of the two grounds of grey.
const CARDS_GREY: Partial<Record<GroundsID, Omit<Card, "linePointer">>> = {
  dark: { fill: SLATE[900], line: SLATE[800], words: SLATE[400] },
  light: { fill: WORDS_WHITE, line: SLATE[300], words: SLATE[600] },
};

// A card on a ground. Its fill is solid, so the grid of a page does not
// show through it and its words stand on what was measured: on a ground in
// a brand colour it is the quiet fill of that ground. A card that can be
// pressed has an arrow after its heading, so that it shows without a
// pointer. Under the pointer its line takes the colour of the words on the
// ground, and its fill stays.
export const getCard = function getCard(ground: GroundsID): Card {
  const under = GROUNDS[ground];
  const strong = getWordsOn(under);
  const isWhite = strong === WORDS_WHITE;
  const fill = getQuiet(ground);
  const share = isWhite ? CARD.sharesLine.white : CARD.sharesLine.ink;

  const colored = {
    fill,
    line: getBlend(under, strong, share),
    words: isWhite ? getBlend(fill, strong, CARD.shareWords) : strong,
  };

  const card = { ...(CARDS_GREY[ground] ?? colored), linePointer: strong };
  return card;
};

export default CARD;
