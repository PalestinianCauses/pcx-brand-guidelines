// The layers of the PCX brand: the parts that open above a page. A dialog
// asks or tells one thing, a side panel holds more beside the page, and a
// menu lists what can be done. Every size is in pixels, and every time in
// milliseconds.
//
// A layer adds no colour. It has the fill, the line and the words of a card
// on its ground, as solid colours, so its words stand on what was measured.
// It is flat: the look has no soft shadow, and it gives its hard shadow
// only to a part with no border, which a layer is not.

import { getQuiet } from "./badge";
import getBlend from "./blend";
import { getCard } from "./card";
import { type GroundsID, GROUNDS } from "./colors";
import MOTION from "./motion";
import { getWordsOn } from "./shades";
import SHAPE from "./shape";
import type { TypeStepID } from "./type";

const LAYERS = {
  // The veil behind a dialog and a side panel: black at a share of 100,
  // with a soft blur of so many pixels where a browser can draw one. It is
  // the veil of ShadCN, as it is. It tells a person that the page behind
  // the layer waits, and it leaves that page almost as it was. A menu has
  // no veil.
  veil: { color: "#000000", share: 10, blur: 4 },

  // The step of the type scale for the title of a layer and for its words.
  type: {
    title: "sub-heading",
    words: "body",
  } as Record<"title" | "words", TypeStepID>,

  // The room inside a dialog and a side panel, and the line around every
  // layer: the thin line of the brand.
  room: SHAPE.spaces.inside,
  line: SHAPE.lines.thin,

  // How wide a dialog and a side panel are at most. On a small screen both
  // are narrower, with room left beside them.
  widths: { dialog: 480, panel: 384 },

  // An item of a menu: as high as a control, which a finger needs. The item
  // that the pointer or the keyboard is on has a line at its start, as
  // thick as the thick line of the brand.
  item: { height: SHAPE.heightControl, mark: SHAPE.lines.thick },

  // How long a layer takes to open and to close: the time of a medium
  // move, on the curve of the brand. A dialog fades in and rises as far as
  // a part that enters. A side panel comes in from its edge. A menu only
  // fades. A person who asks for less motion gets none.
  time: MOTION.times.medium,
  distance: MOTION.distance,
} as const;

// The colours of a layer on a ground: its fill, its line, its words and
// its title, and the item of a menu that the pointer or the keyboard is on,
// with its fill, its words and the line at its start.
export type Layer = {
  fill: string;
  line: string;
  words: string;
  title: string;
  itemFill: string;
  itemWords: string;
  itemMark: string;
};

// A layer on a ground. Its fill, its line and its words are those of a
// card there. Its title has the strong colour of the ground. The item that
// the pointer or the keyboard is on has the quiet fill of the ground, with
// the strong colour for its words and for the line at its start. On a
// ground in a brand colour the quiet fill is the fill of a card, so the
// fill alone shows nothing there: the line does.
export const getLayer = function getLayer(ground: GroundsID): Layer {
  const { fill, line, words } = getCard(ground);
  const strong = getWordsOn(GROUNDS[ground]);

  const layer = {
    fill,
    line,
    words,
    title: strong,
    itemFill: getQuiet(ground),
    itemWords: strong,
    itemMark: strong,
  };

  return layer;
};

// A ground as it looks under the veil, before its blur: the ground and the
// colour of the veil, at the share of the veil. The veil is light, so a
// layer is told from the page by its own fill and line, as a card is.
export const getVeiled = function getVeiled(ground: GroundsID): string {
  const { color, share } = LAYERS.veil;
  const veiled = getBlend(GROUNDS[ground], color, share);

  return veiled;
};

export default LAYERS;
