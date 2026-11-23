// The story of PCX: where it began, what was built on the way, and the
// question that led to PCX.

export type StoryID = "origin" | "request" | "systems";

// A quote, with the one word in it that is stressed.
export type StoryQuote = {
  text: string;
  stress: string;
};

export type StoryPart = {
  name?: string;
  heading: string;
  caption?: string;
  paragraphs: string[];
  points?: string[];
  quote?: StoryQuote;
};

const STORY: Record<StoryID, StoryPart> = {
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
};

export default STORY;
