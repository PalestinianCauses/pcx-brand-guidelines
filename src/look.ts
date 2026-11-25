// The look of PCX: what its personality looks like. Each trait of the
// personality has rules of the look. The chapter also holds the order of
// the grounds, the relatives of the look, and what an illustration is.
//
// Every line was accepted as it is written here. How PCX speaks and writes
// is not here: that belongs to a system for copywriting and proofreading.

import type { StrategyPoint } from "./strategy";

// A trait of the personality, with the rules of the look that follow from
// it.
export type TraitLook = {
  trait: string;
  rules: StrategyPoint[];
};

// A kind of ground that a section can stand on: dark, light, or a brand
// colour.
export type GroundsKind = "color" | "dark" | "light";

// The kinds of ground, from the one that is used most to the one that is
// used least.
export const GROUNDS_ORDER: GroundsKind[] = ["dark", "light", "color"];

const TRAITS: TraitLook[] = [
  {
    trait: "Structural, not decorative.",
    rules: [
      {
        name: "Structure shown.",
        note: "A page shows its structure: divider lines between sections and margins with lines, as on the Tailwind CSS website.",
      },
      {
        name: "Nothing only to fill.",
        note: "Nothing is on a page only to fill it. A line, a shape or a picture is there because it holds something or means something.",
      },
    ],
  },
  {
    trait: "Direct, not loud.",
    rules: [
      {
        name: "Large type.",
        note: "Large type is in capitals at weight 950. The other type stays as it is.",
      },
      {
        name: "Hard shadow.",
        note: "A hard shadow only where it contrasts well with the ground and with the part, and where the part has no border.",
      },
      {
        name: "Flat or hard.",
        note: "A thing is flat, or it has the hard shadow. No soft shadow, no glow, and no gradient for effect.",
      },
    ],
  },
  {
    trait: "Precise, not showy.",
    rules: [
      {
        name: "ShadCN first.",
        note: "Every part starts from ShadCN's own, through its CLI. ShadCN is the floor for the code and the design quality.",
      },
      {
        name: "ShadCN, then PCX.",
        note: "A part starts from ShadCN and then takes the PCX theme: its type, its colours, its corners and its shadow. ShadCN gives the quality, and PCX gives the look.",
      },
      {
        name: "Numbers.",
        note: "Corners are square. Sizes, spaces and contrast are numbers, and tests hold them.",
      },
    ],
  },
  {
    trait: "Close, not corporate.",
    rules: [
      {
        name: "One person.",
        note: "The look describes the person behind PCX: an engineer who loves code, maths and logic.",
      },
    ],
  },
];

const RELATIVES: StrategyPoint[] = [
  {
    name: "IBM.",
    note: "The closest relative is IBM. Its design language says how IBM looks, and Carbon builds the parts on it.",
  },
  {
    name: "Two layers.",
    note: "PCX has the same two layers. The brand guidelines say how PCX looks, and the design system builds the parts on them, from ShadCN.",
  },
  {
    name: "Not Apple.",
    note: "PCX is not of Apple's kind: not soft, not round, not translucent.",
  },
  {
    name: "PCX's own.",
    note: "PCX's own, beside IBM: heavy capitals in Gilroy, four strong colours, the dark ground first, the hard shadow, and the lines of the Tailwind CSS website.",
  },
];

const ILLUSTRATIONS: StrategyPoint[] = [
  {
    name: "A meaning.",
    note: "No illustration without a meaning. No random shapes, and none from advanced calculus.",
  },
  {
    name: "A system.",
    note: "Illustrations are made by a system of rules, as the brand guidelines and the design system are. No illustrator is needed.",
  },
  {
    name: "IBM as the model.",
    note: "IBM's illustrations are the model: each has a job, and each is drawn on a grid from a few shapes and angles.",
  },
  {
    name: "A character.",
    note: "A character may stand for PCX, as Brilliant has one. That is decided with the illustrations.",
  },
];

const LOOK = {
  // What each trait of the personality looks like, in the order of the
  // personality.
  traits: {
    name: "What each trait looks like",
    list: TRAITS,
  },

  // The grounds of a page, in the order of GROUNDS_ORDER.
  grounds: {
    name: "Grounds",
    note: "Grounds: mostly dark, then light, then a brand colour.",
  },

  // What the look is close to, what it is not, and what is its own.
  relatives: {
    name: "Relatives",
    points: RELATIVES,
  },

  // What an illustration is. The rules of drawing one are not here yet.
  illustrations: {
    name: "Illustrations",
    points: ILLUSTRATIONS,
  },
};

export default LOOK;
