// The parts that hold content of the PCX brand: the sheet of points, the
// numbered row and the separator. A card holds one thing that is pressed
// as a whole, and a page is not built from cards. These parts are what a
// page is built from. None of them is pressed, and none has a fill. Every
// size is in pixels.
//
// They add no colour: their words have the colours of the words on their
// ground, and their lines are the thin line of that ground.

import SHAPE from "./shape";
import type { TypeStepID } from "./type";

// A sheet of points: short statements in cells that thin lines divide. It
// is a list.
export const POINTS = {
  // The step of the type scale for the title of a point and for its words.
  // The words are never larger than the title.
  type: {
    title: "sub-heading",
    words: "body",
  } as Record<"title" | "words", TypeStepID>,

  // The room inside a cell, and the room between its title and its words.
  room: SHAPE.spaces.inside,
  gap: 8,

  // The line where two cells meet: the thin line of the brand.
  line: SHAPE.lines.thin,

  // Where the lines run: between the cells only. So a sheet is open at its
  // edges, where it joins the lines of the page around it, and it can't be
  // taken for a set of cards.
  lines: "between",
} as const;

// A numbered row: a step or a thing in an order, with a number, a title
// and a line of words. Its list is an ordered list, which counts its rows
// itself.
export const ROWS = {
  // The step of the type scale for the number, the title and the words.
  // The number is set as a label is: in the mono font.
  type: {
    number: "label",
    title: "sub-heading",
    words: "body",
  } as Record<"number" | "title" | "words", TypeStepID>,

  // How many digits the number has: a row is 01, and not 1.
  digits: 2,

  // The room above and under a row, the room between its number and its
  // title, and the room between its title and its words.
  room: SHAPE.spaces.inside,
  gap: 24,
  gapWords: 8,

  // The line above every row: the thin line of the brand.
  line: SHAPE.lines.thin,

  // Where the number stands: in a column of its own, beside the title. So
  // the numbers stand under each other, and the title and the words line
  // up at one edge.
  place: "beside",
} as const;

// A separator: a thin line between two groups, lying or standing. It is
// decoration, so a screen reader skips it, unless a project says that it
// carries meaning.
export const SEPARATOR = {
  line: SHAPE.lines.thin,
  isDecoration: true,
} as const;

// The number of a row as it is shown, with the digits that a row has.
export const getNumber = function getNumber(place: number): string {
  const number = String(place).padStart(ROWS.digits, "0");
  return number;
};
