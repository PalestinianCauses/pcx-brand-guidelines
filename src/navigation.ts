// The frame of a page of the PCX brand: the top bar, the full-screen menu
// of a narrow place, the skip link and the footer. Every page of a website
// has them. Every size is in pixels, and every time in milliseconds.
//
// The frame is drawn with what the look already has: a structure that is
// shown, small labels with a number, large type in capitals, and the
// braces of the logo around one word. It adds one colour, the highlight of
// those braces. Its words have the colours of the words on their ground,
// and its lines are the thin line of that ground.

import COLORS, { type GroundsID, GROUNDS } from "./colors";
import MOTION from "./motion";
import { getWordsOn } from "./shades";
import SHAPE, { type SizeID } from "./shape";
import type { StrategyPoint } from "./strategy";
import type { TypeStepID } from "./type";

const RULES: StrategyPoint[] = [
  {
    name: "Cells.",
    note: "The top bar is a row of cells with a thin line between them. The logo has a cell, each link has one, and the action has one.",
  },
  {
    name: "Margins.",
    note: "The top bar, the menu and the footer stand between the hatched margins of a section, so the frame lines up with the page.",
  },
  {
    name: "A number.",
    note: "A link of the top bar and of the menu has its number before it, as a row has. A screen reader does not read it.",
  },
  {
    name: "Braces.",
    note: "The link of the page that a person is on stands between braces, so it is not marked by its colour alone.",
  },
  {
    name: "A word.",
    note: "The cell that opens the menu has a word beside its sign. A sign alone does not stand in for the word.",
  },
  {
    name: "The end.",
    note: "The frame ends with the footer. What stands above the footer is a section of the page, which each page chooses.",
  },
];

const NAVIGATION = {
  // The top bar. It is as high as a control with the room between two
  // parts above and below it, and it has the thin line of the brand under
  // it. A link is a cell as high as the bar: a small label, with the room
  // inside a block at each side. The action is the main button of its
  // ground, as high as a control.
  bar: {
    height: SHAPE.heightControl + SHAPE.spaces.between * 2,
    line: SHAPE.lines.thin,
    type: "label" as TypeStepID,
    room: SHAPE.spaces.inside,
    action: "default" as SizeID,
  },

  // The menu of a narrow place. It fills the screen, on the ground of the
  // page. Each link is a row with a thin line under it: its number, its
  // name in the step of a heading, and a few quiet words. At its foot
  // stands the action, as the main button in its large size. It opens in
  // the time of a large move, and a person who asks for less motion gets
  // none.
  menu: {
    type: {
      number: "label",
      link: "heading",
      words: "note",
    } as Record<"link" | "number" | "words", TypeStepID>,
    action: "lg" as SizeID,
    time: MOTION.times.large,
  },

  // The footer: a sheet of cells with a thin line between them, and one
  // line under it with the year and the legal links. A column of links
  // stands under a small label with its number. A link is a row as high as
  // a control, in the words of a button.
  footer: {
    type: {
      label: "label",
      link: "button",
      words: "note",
    } as Record<"label" | "link" | "words", TypeStepID>,
    height: SHAPE.heightControl,
    room: SHAPE.spaces.inside,
  },

  // The skip link: the first stop of the keyboard on a page. It is seen
  // only with the keyboard on it, and it is as high as a control.
  skip: { height: SHAPE.heightControl },

  rules: RULES,
} as const;

// The grounds whose highlight is a colour of the brand, and that colour.
// On the other grounds in a brand colour no colour of the brand stands
// out, so the highlight is the colour of the words there.
const HIGHLIGHTS: Partial<Record<GroundsID, string>> = {
  dark: COLORS.blue.value,
  light: COLORS.blue.value,
  purple: COLORS.pink.value,
};

// The colour of the highlight on a ground: the colour of the braces around
// the one word that stands out, such as the link of the page that a person
// is on. It is a mark and the colour of large words, so it needs the
// contrast of a part against its ground.
export const getHighlight = function getHighlight(ground: GroundsID): string {
  const highlight = HIGHLIGHTS[ground] ?? getWordsOn(GROUNDS[ground]);
  return highlight;
};

export default NAVIGATION;
