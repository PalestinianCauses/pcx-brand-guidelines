// The shape of the PCX brand: square corners, thin lines and spaces in steps
// of one unit. Every value is in pixels.

import COLORS from "./colors";
import { WORDS_INK, WORDS_WHITE } from "./shades";

// Every space and every height is a multiple of this unit.
export const UNIT = 4;

// The least height of a part that a finger presses.
export const HEIGHT_FINGER = 44;

// The least side of a part that a pointer presses. WCAG 2.2 asks for 24 by
// 24 pixels at its level AA.
export const SIDE_LEAST = 24;

// A size of a control, under the name that ShadCN gives it.
export type SizeID = "xs" | "sm" | "default" | "lg";

// The sizes of a control, from the smallest to the largest.
export const SIZES_CONTROL: SizeID[] = ["xs", "sm", "default", "lg"];

// One size of a control is this much higher than the size before it.
export const STEP_CONTROL = 8;

// The pointer over a part that can be pressed: the hand, as CSS names it.
export const POINTER_PRESS = "pointer";

const SHAPE = {
  // The radius of every corner. Buttons, fields, cards and tags are square.
  corner: 0,

  // The thin line goes around blocks and between rows. It is the thinnest
  // line a screen draws. The thick line marks emphasis.
  lines: { thin: 1, thick: 2 },

  // The height of a button or a field in its default size, on every screen.
  heightControl: 44,

  // The heights of a control in its four sizes. The default is the height
  // that a finger needs. The two smaller ones are for a dense screen that is
  // used with a pointer, and the large one is for the one main action of a
  // view.
  heightsControl: { xs: 28, sm: 36, default: 44, lg: 52 },

  // The focus: what a part looks like with the keyboard on it. The line of
  // the part takes the strong colour of its ground: white on a dark ground
  // and ink on a light one. It is never a brand colour, so it is not taken
  // for a part in one of them. Against a pale fill on a dark ground the
  // white line is weak, and there it stands out from the ground around it.
  // Around the line stands a soft ring of the same colour, at a share of
  // its strength. Where a device forces its own colours, neither can be
  // seen, so an outline stands around the part there, a little away from
  // it.
  focus: {
    width: 1,
    ringWidth: 1,
    ringShare: 0.5,
    colorDark: WORDS_WHITE,
    colorLight: WORDS_INK,
    outlineWidth: 1,
    outlineOffset: 2,
  },

  /**
   * @deprecated Use `focus`. A ring in a brand colour can't be told from a
   * part in that colour.
   */
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
