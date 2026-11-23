// The strategy of PCX: its positioning, its mission and vision, its values,
// who it serves, what it sells and its personality.

// A short line, with the sentence that explains it.
export type StrategyPoint = {
  name: string;
  note: string;
};

// One thing that PCX sells. An offer either finds the problems or repairs
// them. A name that is a title is the title of a book.
export type Offer = {
  kind: "product" | "service";
  step: "diagnose" | "repair";
  name: string;
  note: string;
  isTitle: boolean;
};

const VALUES: StrategyPoint[] = [
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
];

const OFFERS: Offer[] = [
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
];

const TRAITS: StrategyPoint[] = [
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
];

const STRATEGY = {
  // The positioning in one line, the note that goes with it, the mission and
  // the vision.
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
    points: VALUES,
  },

  // Who PCX serves, and when a project fits.
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

  // What PCX sells, in order: first what finds the problems, then what
  // repairs them.
  offers: {
    name: "What we sell, in order",
    heading: "Diagnosis first. Repair second.",
    steps: ["Diagnose", "Repair"],
    kinds: ["Products", "Services"],
    list: OFFERS,
  },

  personality: {
    name: "Personality",
    heading: "Every trait comes with a limit.",
    points: TRAITS,
  },
};

export default STRATEGY;
