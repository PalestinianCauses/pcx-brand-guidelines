import assert from "node:assert/strict";
import test from "node:test";

import STORY from "./story";

test("the story keeps its three parts, word for word", () => {
  assert.deepEqual(STORY, {
    origin: {
      name: "Origin",
      heading: "It began as PalestinianCauses.",
      caption: "Three friends. One idea.",
      paragraphs: [
        "PalestinianCauses began with three friends: Shawqi Hatem, Lama Matar, and Maha Matar.",
        'What started as a small conversation grew into stories, visual work, translation, publishing, a website, and the digital book "A Human But From Gaza".',
      ],
    },
    systems: {
      heading: "What we built.",
      paragraphs: [
        "As the project reached people in different countries, the team had to solve the practical problems behind delivery. The systems became as important as the content they carried.",
      ],
      points: [
        "Payments and checkout",
        "Automated access",
        "Publishing",
        "Technical reliability",
      ],
    },
    request: {
      name: "From product to PCX",
      heading: "The market asked for the system behind the product.",
      caption: "The question that revealed the next direction.",
      paragraphs: [
        "After people purchased and received the book, some returned with another request:",
      ],
      quote: {
        text: "Can you build something similar for us?",
        stress: "build",
      },
    },
  });
});

test("the stressed word of a quote is a word of that quote", () => {
  const quotes = Object.values(STORY).flatMap((part) =>
    part.quote ? [part.quote] : [],
  );

  assert.equal(quotes.length, 1);

  quotes.forEach((quote) => {
    assert.ok(quote.text.split(" ").includes(quote.stress), quote.text);
  });
});

test("every part of the story has a heading and at least one paragraph", () => {
  Object.entries(STORY).forEach(([id, part]) => {
    assert.ok(part.heading.length > 0, id);
    assert.ok(part.paragraphs.length > 0, id);
  });
});
