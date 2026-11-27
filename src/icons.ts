// The icons of the PCX brand: which family is used where, how large an
// icon is in a control, and how thick its line is. Every size is in pixels.

import SHAPE from "./shape";
import type { StrategyPoint } from "./strategy";

// A family of icons: its name, what PCX uses it for, and where it lives.
export type IconFamily = {
  name: string;
  use: string;
  address: string;
};

const RULES: StrategyPoint[] = [
  {
    name: "A sign.",
    note: "An icon in a part stands for what the part does. A screen reader passes it by.",
  },
  {
    name: "A name.",
    note: "A button with an icon alone has a name that a screen reader says.",
  },
  {
    name: "A line.",
    note: "The line of an icon is as thick on a small icon as on a large one.",
  },
  {
    name: "A colour.",
    note: "An icon has the colour of the words around it, or the colour of a link on its ground.",
  },
];

const ICONS = {
  // The family for normal work, and the family for the sections of a page.
  // How the second one is used is not written yet.
  families: {
    parts: {
      name: "Lucide",
      use: "Normal work: an icon in a part, such as a button.",
      address: "https://lucide.dev",
    },
    sections: {
      name: "Iconly",
      use: "A section of a page with animated icons, or with icons in three dimensions.",
      address: "https://iconly.pro",
    },
  } as Record<"parts" | "sections", IconFamily>,

  // How wide and how high an icon is in a control, and in the smallest size
  // of a control.
  size: 16,
  sizeSmall: 14,

  // How thick the line of an icon is on the screen, at every size: halfway
  // between the thin and the thick line of the brand. The family draws its
  // own line as a part of the size of an icon, so that line thins on a
  // small icon, where it is needed most. This one does not: an icon stands
  // beside words, and its line weighs what they weigh.
  line: (SHAPE.lines.thin + SHAPE.lines.thick) / 2,

  // What holds for an icon in a part.
  rules: RULES,
};

export default ICONS;
