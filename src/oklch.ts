// A colour as a person sees it: how light it is, how strong it is, and its
// hue. The space is OKLCH, the one that Tailwind CSS writes its colours in.
// A colour is read from a hex value with six digits, and written as one.
//
// The numbers of the conversion are the published ones of the OKLab colour
// space. Where one ended in an odd digit, its last digit is moved by one or
// two. That is less than a billionth, and the colours come out the same.

import { getChannels } from "./contrast";

export type Oklch = {
  // From 0, for black, to 1, for white.
  lightness: number;

  // From 0, for a grey, upwards.
  chroma: number;

  // An angle in degrees, from 0 to 360.
  hue: number;
};

const DEGREES_HALF = 180;
const DEGREES_TURN = 360;

// How many times the room for the strength of a colour is halved, to find
// the most strength that a screen can show. After that many halvings the
// room is far smaller than one step of a hex value.
const HALVINGS = 24;

// How far under 0 or over 1 a channel may lie and still count as a colour
// of the screen. The conversion is not exact, so white itself can come out
// a hair over 1.
const ROOM = 0.0002;

export const getOklch = function getOklch(color: string): Oklch {
  const [red, green, blue] = getChannels(color);

  const long = Math.cbrt(
    0.4122214708 * red + 0.5363325364 * green + 0.0514459928 * blue,
  );

  const medium = Math.cbrt(
    0.2119034982 * red + 0.6806995452 * green + 0.1073969566 * blue,
  );

  const short = Math.cbrt(
    0.088302462 * red + 0.2817188376 * green + 0.6299787005 * blue,
  );

  const lightness =
    0.2104542554 * long + 0.793617785 * medium - 0.0040720468 * short;

  const axisRed =
    1.9779984952 * long - 2.428592205 * medium + 0.4505937098 * short;

  const axisYellow =
    0.0259040372 * long + 0.7827717662 * medium - 0.808675766 * short;

  const chroma = Math.hypot(axisRed, axisYellow);
  const angle = (Math.atan2(axisYellow, axisRed) * DEGREES_HALF) / Math.PI;
  const hue = (angle + DEGREES_TURN) % DEGREES_TURN;
  const oklch = { lightness, chroma, hue };

  return oklch;
};

// The three linear channels of a colour: red, green and blue. A channel
// under 0 or over 1 belongs to a colour that a screen can't show.
const getLinears = function getLinears(oklch: Oklch): number[] {
  const angle = (oklch.hue * Math.PI) / DEGREES_HALF;
  const axisRed = oklch.chroma * Math.cos(angle);
  const axisYellow = oklch.chroma * Math.sin(angle);
  const light = oklch.lightness;

  const long =
    (light + 0.3963377774 * axisRed + 0.2158037572 * axisYellow) ** 3;

  const medium =
    (light - 0.1055613458 * axisRed - 0.0638541728 * axisYellow) ** 3;

  const short =
    (light - 0.0894841775 * axisRed - 1.291485548 * axisYellow) ** 3;

  const linears = [
    4.076741662 * long - 3.3077115912 * medium + 0.2309699292 * short,
    -1.2684380046 * long + 2.6097574012 * medium - 0.3413193965 * short,
    -0.0041960862 * long - 0.7034186146 * medium + 1.7076147008 * short,
  ];

  return linears;
};

const isShown = function isShown(linears: number[]): boolean {
  const isInside = linears.every(
    (linear) => linear >= -ROOM && linear <= 1 + ROOM,
  );

  return isInside;
};

// One linear channel as two hex digits, with the curve of sRGB applied.
const getPair = function getPair(linear: number): string {
  const share = Math.min(1, Math.max(0, linear));
  const curved =
    share <= 0.0031308 ? 12.92 * share : 1.055 * share ** (1 / 2.4) - 0.055;

  const pair = Math.round(curved * 255)
    .toString(16)
    .padStart(2, "0");

  return pair;
};

// The most strength, up to its own, that a colour can have on a screen. A
// colour that a screen can show keeps all of it. For another colour the
// room between no strength and its own is halved again and again, and the
// lower end of the room is always a colour of the screen.
const getChroma = function getChroma(oklch: Oklch): number {
  if (isShown(getLinears(oklch))) return oklch.chroma;

  const [chroma] = Array.from({ length: HALVINGS }).reduce<number[]>(
    ([low, high]) => {
      const middle = (low + high) / 2;
      const room = isShown(getLinears({ ...oklch, chroma: middle }))
        ? [middle, high]
        : [low, middle];

      return room;
    },
    [0, oklch.chroma],
  );

  return chroma;
};

// A colour in OKLCH as a hex value. A colour that a screen can't show keeps
// its lightness and its hue, and it loses strength until a screen can show
// it.
const getColor = function getColor(oklch: Oklch): string {
  const linears = getLinears({ ...oklch, chroma: getChroma(oklch) });
  const color = ["#", ...linears.map(getPair)].join("");

  return color;
};

export default getColor;
