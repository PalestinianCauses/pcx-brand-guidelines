// The shape of the PCX brand: square corners, thin lines and spaces in steps
// of one unit. Every value is in pixels.

import COLORS from "./colors";

// Every space and every height is a multiple of this unit.
export const UNIT = 4;

// The least height of a part that a finger presses.
export const HEIGHT_FINGER = 44;

const SHAPE = {
  // The radius of every corner. Buttons, fields, cards and tags are square.
  corner: 0,

  // The thin line goes around blocks and between rows. It is the thinnest
  // line a screen draws. The thick line marks emphasis.
  lines: { thin: 1, thick: 2 },

  // The height of a button or a field, on every screen.
  heightControl: 44,

  // The ring around the part that the keyboard is on: how thick it is, how
  // far from the part it sits, and its colour.
  ringFocus: { width: 2, offset: 2, color: COLORS.blue.value },

  // The room between things: inside a card, between two cards, between a
  // heading and what follows it, and above and below a section. The room
  // around a section is set for a phone and for a laptop, and between the two
  // it grows evenly with the screen, as a size does.
  spaces: {
    inside: 24,
    between: 16,
    heading: 28,
    sectionAbovePhone: 48,
    sectionAboveLaptop: 96,
    sectionBelowPhone: 56,
    sectionBelowLaptop: 96,

    /** @deprecated Use `sectionAbovePhone` and `sectionBelowPhone`. */
    sectionPhone: 48,

    /** @deprecated Use `sectionAboveLaptop` and `sectionBelowLaptop`. */
    sectionLaptop: 96,
  },
} as const;

export default SHAPE;
