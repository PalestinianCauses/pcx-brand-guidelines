// The colours of the PCX brand: the four brand colours, and the slate of
// Tailwind CSS as the greys.

export type ColorID = "blue" | "pink" | "purple" | "yellow";

export type Color = {
  name: string;
  role: string;
  value: string;
  isReadableOnDark: boolean;
  isReadableOnLight: boolean;
};

// The greys: the slate of Tailwind CSS 4, as hex values. A test compares
// them with Tailwind's own list.
export const SLATE = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cad5e2",
  400: "#90a1b9",
  500: "#62748e",
  600: "#45556c",
  700: "#314158",
  800: "#1d293d",
  900: "#0f172b",
  950: "#020618",
} as const;

// The two grounds that a colour's words are measured on: the darkest and the
// lightest grey.
export const GROUND_DARK = SLATE[950];
export const GROUND_LIGHT = SLATE[50];

// A colour is readable on a ground when words of any size in that colour
// reach the contrast that `contrast.ts` names. A test measures every one.
const COLORS: Record<ColorID, Color> = {
  purple: {
    name: "Deep Tech Purple",
    role: "Structure",
    value: "#2e1a72",
    isReadableOnDark: false,
    isReadableOnLight: true,
  },
  blue: {
    name: "Electric Blue",
    role: "Action",
    value: "#1f8bff",
    isReadableOnDark: true,
    isReadableOnLight: false,
  },
  pink: {
    name: "Digital Pink",
    role: "Creative",
    value: "#ff4fa3",
    isReadableOnDark: true,
    isReadableOnLight: false,
  },
  yellow: {
    name: "Innovation Yellow",
    role: "Signal",
    value: "#ffd84d",
    isReadableOnDark: true,
    isReadableOnLight: false,
  },
};

export default COLORS;
