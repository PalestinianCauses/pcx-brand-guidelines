// The voice of PCX: who it speaks to, how it speaks, where each kind of
// language belongs, and what it never says.

// A short line, with the sentence that explains it.
export type VoicePoint = {
  name: string;
  note: string;
};

// One of the two layers of language, with the reader it is for.
export type VoiceLayer = {
  name: string;
  reader: string;
  note: string;
  examples: string[];
};

// A place where PCX speaks, with the layer it uses there.
export type VoicePlace = {
  place: string;
  note: string;
};

// The words the voice never uses.
export const WORDS_HYPE = [
  "10x",
  "act now",
  "amazing",
  "awesome",
  "best-in-class",
  "cutting-edge",
  "disruptive",
  "don't miss out",
  "effortless",
  "effortlessly",
  "elevate",
  "empower",
  "epic",
  "game-changer",
  "game-changing",
  "groundbreaking",
  "guarantee",
  "hurry",
  "incredible",
  "innovative",
  "insane",
  "jaw-dropping",
  "last chance",
  "leverage",
  "limited time",
  "magical",
  "mind-blowing",
  "must-have",
  "next-level",
  "revolutionary",
  "revolutionize",
  "seamless",
  "seamlessly",
  "skyrocket",
  "state-of-the-art",
  "stunning",
  "supercharge",
  "synergy",
  "ultimate",
  "unbelievable",
  "unleash",
  "unlock",
  "world-class",
];

const PRINCIPLES: VoicePoint[] = [
  {
    name: "Diagnose.",
    note: "Show one symptom the reader can check on their own website today.",
  },
  {
    name: "Keep it short.",
    note: "One idea per sentence. Most sentences stay under 15 words.",
  },
  {
    name: "We and you.",
    note: 'We speak to you. PCX is named when the company is the subject, as in a footer. Shawqi speaks as "I", by name, on opinions, thoughts, and lessons.',
  },
  {
    name: "Prove it.",
    note: "Every claim traces to our products or our own work.",
  },
  {
    name: "No hype.",
    note: "No exclamation marks, and none of the words a brochure would use.",
  },
];

const LAYERS: VoiceLayer[] = [
  {
    name: "The outer layer",
    reader: "The business owner",
    note: "Symptom language they already understand.",
    examples: [
      "Your checkout breaks.",
      "Customers see errors.",
      "Your website looks broken on phones.",
    ],
  },
  {
    name: "The inner layer",
    reader: "The developer",
    note: "Precise technical language that names our stack.",
    examples: [
      "Next.JS, React, TypeScript",
      "Tailwind CSS, ShadCN",
      "PostgreSQL, Vercel, GitHub",
    ],
  },
];

const PLACES: VoicePlace[] = [
  {
    place: "Instagram",
    note: "The outer layer to owners, or the inner to developers, in English",
  },
  { place: "Live streams", note: "The inner layer, in Arabic" },
  { place: "The books", note: "Both layers, outer first" },
];

const VOICE = {
  // The one reader that the content speaks to, and the pain they have.
  reader: {
    name: "Who the content speaks to",
    heading: "One person. One pain.",
    person:
      "A business owner selling products or services online whose website has structural problems. They have already tried theme changes, plugins, and freelancer patches that did not fix it.",
    pain: "They are losing paying customers every week because of problems buried in how the website was built.",
  },

  principles: {
    name: "Voice principles",
    heading: "A thermometer, not a poster about health.",
    points: PRINCIPLES,
  },

  // The two layers of language, and the law that keeps them apart.
  layers: {
    name: "Two layers",
    heading: "Two layers of language. They never mix.",
    law: "The owner reads symptoms. The product delivers engineering.",
    list: LAYERS,
  },

  places: {
    name: "Tone by place",
    heading: "Where each layer speaks.",
    list: PLACES,
  },

  // What the voice leaves out. The words are in WORDS_HYPE.
  hype: {
    name: "No hype",
    heading: "No emoji. No brochure words.",
    rules: [
      "No emoji, in posts, captions, stories, or replies",
      "None of the words below, and no false urgency",
    ],
  },
};

export default VOICE;
