import assert from "node:assert/strict";
import test from "node:test";

import STORY from "./story";
import STRATEGY from "./strategy";
import VOICE, { WORDS_HYPE } from "./voice";

// The least number of words that makes a sentence long, by the voice's own
// rule.
const WORDS_LONG = 15;

const PATTERN_SENTENCE = /(?<=[.?:])\s+/;
const PATTERN_SPECIAL = /[.*+?^${}()|[\]\\]/g;

// Every text inside a value, however deep it sits.
const getTexts = function getTexts(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(getTexts);

  if (value && typeof value === "object")
    return Object.values(value).flatMap(getTexts);

  return [];
};

// All the words of the brand: the story, the strategy and the voice.
const TEXTS = getTexts([STORY, STRATEGY, VOICE]);

test("the voice keeps its reader, principles, layers, places and rules, word for word", () => {
  assert.deepEqual(VOICE, {
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
      points: [
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
      ],
    },
    layers: {
      name: "Two layers",
      heading: "Two layers of language. They never mix.",
      law: "The owner reads symptoms. The product delivers engineering.",
      list: [
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
      ],
    },
    places: {
      name: "Tone by place",
      heading: "Where each layer speaks.",
      list: [
        {
          place: "Instagram",
          note: "The outer layer to owners, or the inner to developers, in English",
        },
        {
          place: "Live streams",
          note: "The inner layer, in Arabic",
        },
        {
          place: "The books",
          note: "Both layers, outer first",
        },
      ],
    },
    hype: {
      name: "No hype",
      heading: "No emoji. No brochure words.",
      rules: [
        "No emoji, in posts, captions, stories, or replies",
        "None of the words below, and no false urgency",
      ],
    },
  });
});

test("the words the voice never uses are kept, in order and without a double", () => {
  assert.deepEqual(WORDS_HYPE, [
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
  ]);
  assert.deepEqual([...WORDS_HYPE].sort(), WORDS_HYPE);
  assert.equal(new Set(WORDS_HYPE).size, WORDS_HYPE.length);
});

test("the brand's own words use none of the words the voice leaves out", () => {
  const wordsFound = WORDS_HYPE.filter((word) => {
    const pattern = new RegExp(
      `\\b${word.replace(PATTERN_SPECIAL, "\\$&")}\\b`,
      "i",
    );

    return TEXTS.some((text) => pattern.test(text));
  });

  assert.deepEqual(wordsFound, []);
});

test("the brand's own words carry no exclamation mark", () => {
  const textsLoud = TEXTS.filter((text) => text.includes("!"));

  assert.deepEqual(textsLoud, []);
});

test("most sentences of the brand's own words stay under 15 words", () => {
  const sentences = TEXTS.flatMap((text) => text.split(PATTERN_SENTENCE));
  const sentencesShort = sentences.filter(
    (sentence) => sentence.split(" ").length < WORDS_LONG,
  );

  assert.ok(sentencesShort.length > sentences.length / 2);
});
