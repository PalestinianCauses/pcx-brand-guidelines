// The fonts of the PCX brand: Gilroy, a sans, and JetBrains Mono, a
// monospace.

export type FontID = "mono" | "sans";

export type FontWeight = {
  name: string;
  value: number;
};

export type Font = {
  name: string;
  fallbacks: string[];
  weights: FontWeight[];
  license: string;
  isFreeToShare: boolean;
};

// The ending of a font file's name, with the dot.
export const ENDINGS_FONT = [".eot", ".otf", ".ttf", ".woff", ".woff2"];

// Gilroy is a commercial font, so its files are never in a public repository, and
// this repository holds no font file at all. A test guards that. JetBrains
// Mono is free to share under its license.
const FONTS: Record<FontID, Font> = {
  sans: {
    name: "Gilroy",
    fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    weights: [
      { name: "Thin", value: 100 },
      { name: "UltraLight", value: 200 },
      { name: "Light", value: 300 },
      { name: "Regular", value: 400 },
      { name: "Medium", value: 500 },
      { name: "SemiBold", value: 600 },
      { name: "Bold", value: 700 },
      { name: "ExtraBold", value: 800 },
      { name: "Black", value: 900 },
      { name: "Heavy", value: 950 },
    ],
    license: "Commercial",
    isFreeToShare: false,
  },
  mono: {
    name: "JetBrains Mono",
    fallbacks: ["ui-monospace", "SFMono-Regular", "monospace"],
    weights: [
      { name: "Regular", value: 400 },
      { name: "Medium", value: 500 },
      { name: "SemiBold", value: 600 },
      { name: "Bold", value: 700 },
    ],
    license: "SIL Open Font License 1.1",
    isFreeToShare: true,
  },
};

export default FONTS;
