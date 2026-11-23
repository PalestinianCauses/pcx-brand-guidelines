import assert from "node:assert/strict";
import test from "node:test";

import STRATEGY from "./strategy";

test("the strategy keeps its statement, mission, vision and every other line, word for word", () => {
  assert.deepEqual(STRATEGY, {
    positioning: {
      name: "Positioning, mission, and vision",
      statement: "Digital systems built to perform beyond launch.",
      note: "PCX works beneath the visible interface.",
      mission:
        "We build the systems behind digital products, so they stay fast under traffic, stable under change, and simple enough for the team that runs them.",
      vision:
        "Every business that depends on a digital system owns one it can trust, understand, and grow.",
    },
    values: {
      name: "Values",
      heading: "How PCX decides what good work looks like.",
      points: [
        {
          name: "Build for the real environment.",
          note: "A system must work under real traffic, real devices, real user behavior, and real operational pressure.",
        },
        {
          name: "Understand before building.",
          note: "Technical decisions begin with a clear understanding of the business and the people using the product.",
        },
        {
          name: "Keep the structure maintainable.",
          note: "A successful launch makes the next stage easier. It never leaves a codebase the team is afraid to touch.",
        },
        {
          name: "Connect technology and communication.",
          note: "The product must work correctly and communicate its value clearly.",
        },
        {
          name: "Stay close to the work.",
          note: "Clients talk to the people who make the technical and creative decisions.",
        },
      ],
    },
    audience: {
      name: "Who we serve",
      heading: "The project needs structure, not another temporary workaround.",
      lead: "PCX develops software, platforms, and digital products for businesses and organizations that care about performance, clarity, and longevity.",
      fitLabel: "A project fits when",
      fit: [
        "It needs custom functionality",
        "The website or platform runs real business operations",
        "The business is preparing to scale",
        "The current system has structural limits",
        "Performance and long term maintenance matter",
        "One person can make the decisions",
      ],
    },
    offers: {
      name: "What we sell, in order",
      heading: "Diagnosis first. Repair second.",
      steps: ["Diagnose", "Repair"],
      kinds: ["Products", "Services"],
      list: [
        {
          kind: "product",
          step: "diagnose",
          name: "Is your website failing?",
          note: "The owner finds the problems without a developer.",
          isTitle: true,
        },
        {
          kind: "product",
          step: "repair",
          name: "The Anatomy of a Failing Website",
          note: "The developer fixes the structure behind each problem.",
          isTitle: true,
        },
        {
          kind: "service",
          step: "diagnose",
          name: "The Second Opinion",
          note: "A senior developer reviews the website with the owner, on a shared screen.",
          isTitle: false,
        },
        {
          kind: "service",
          step: "repair",
          name: "Built to Perform",
          note: "A custom website or platform, built around the business as it is today.",
          isTitle: false,
        },
      ],
    },
    personality: {
      name: "Personality",
      heading: "Every trait comes with a limit.",
      points: [
        {
          name: "Structural, not decorative.",
          note: "We care about what holds the thing up. The visible part comes second.",
        },
        {
          name: "Direct, not loud.",
          note: "We say what is wrong and what it costs. No exclamation marks.",
        },
        {
          name: "Precise, not showy.",
          note: "Numbers, names, and steps. We name our stack only where the reader is technical.",
        },
        {
          name: "Close, not corporate.",
          note: "The person you talk to is the person doing the work.",
        },
      ],
    },
  });
});

test("the offers are a product and a service for each step, in order", () => {
  const offers = STRATEGY.offers.list.map((offer) => [offer.kind, offer.step]);

  assert.deepEqual(offers, [
    ["product", "diagnose"],
    ["product", "repair"],
    ["service", "diagnose"],
    ["service", "repair"],
  ]);

  assert.deepEqual(STRATEGY.offers.steps, ["Diagnose", "Repair"]);
});

test("only the two products carry a title", () => {
  const kinds = STRATEGY.offers.list
    .filter((offer) => offer.isTitle)
    .map((offer) => offer.kind);

  assert.deepEqual(kinds, ["product", "product"]);
});
