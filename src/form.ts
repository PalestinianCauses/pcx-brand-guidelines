// The other parts of a form of the PCX brand: a ticking box, a radio, a
// switch, and the list that a select opens. Most of them follows what the
// button and the field settled: the line and the fill of a field, the focus
// of every part, and how a thing that is wrong looks. This file holds what
// is their own: their sizes, their shapes, and the colour of a control that
// is on. Every size is in pixels.

import { type GroundsID } from "./colors";
import { getMainFill } from "./fills";
import SHAPE, { HEIGHT_FINGER } from "./shape";

const FORM = {
  // The side of a ticking box and of a radio. They stand beside words of
  // 16 pixels and more.
  side: 20,

  // The tick of a ticking box, and the dot of a radio.
  tick: 14,
  dot: 8,

  // A switch: its track, its thumb, and how far the thumb stands from the
  // line of the track. The track is as high as a ticking box.
  track: { width: 36, height: 20 },
  thumb: 14,
  gap: 2,

  // The corners. A ticking box and a switch are square, as every part of
  // PCX is. A radio is round, the one round part: its shape is what tells
  // it from a ticking box.
  corner: SHAPE.corner,
  isRadioRound: true,

  // How far the place of a press reaches past a small control, to each
  // side, and above and below. With it the place is larger than the least
  // side that a pointer needs.
  reach: { sides: 12, ends: 8 },

  // The list of a select. It has the colour of its ground and the line of
  // a field, and it opens this far under the select. An item is as high as
  // a finger needs. The pointed item has the fill of a quiet button under
  // the pointer, and a line of this width at its start, in the colour of
  // the words on the ground, so that a person with the keyboard sees where
  // they are. The chosen item has a tick.
  list: { away: 4, item: HEIGHT_FINGER, linePointed: SHAPE.lines.thick },
} as const;

// A control that is on: the colour of its fill, and the colour of the mark
// on that fill. The mark is the tick of a ticking box, the dot of a radio
// and the thumb of a switch.
export type On = {
  color: string;
  mark: string;
};

// A control that is on, on a ground. It takes the fill of the main button
// of that ground, and its mark takes the words of that button. So it is no
// one colour: it is the brand's colour of an action on the dark and on the
// light ground, and the colour of the words on a ground in a brand colour.
// A control never rests on its colour: the tick, the dot and the place of
// the thumb say that it is on.
export const getOn = function getOn(ground: GroundsID): On {
  const { color, words } = getMainFill(ground);
  const on = { color, mark: words };

  return on;
};

export default FORM;
