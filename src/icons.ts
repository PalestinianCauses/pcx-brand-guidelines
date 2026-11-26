// The icons of the PCX brand: which family is used where, and how large an
// icon is in a control. Every size is in pixels.

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

  // What holds for an icon in a part.
  rules: RULES,
};

export default ICONS;
