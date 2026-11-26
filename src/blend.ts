// One colour as it lies on another at a share of its strength: the one
// solid colour that the eye gets. A fill that is written this way lets
// nothing through. So what stands on it is measured on the colour that it
// really stands on, and a line of a page's grid can't show through it.

const BASE_HEX = 16;
const WHOLE = 100;

// Two hex digits of a colour.
const PATTERN_PAIR = /[0-9a-f]{2}/gi;

// The three parts of a colour as a screen holds them, from 0 to 255.
const getParts = function getParts(color: string): number[] {
  const parts = (color.match(PATTERN_PAIR) ?? []).map((pair) =>
    parseInt(pair, BASE_HEX),
  );

  return parts;
};

// The colour `over` on the colour `under`, at `share` parts of a hundred.
// A browser blends two colours in the same way, part by part.
const getBlend = function getBlend(
  under: string,
  over: string,
  share: number,
): string {
  const partsOver = getParts(over);

  const pairs = getParts(under).map((part, index) => {
    const reach = (partsOver[index] ?? part) - part;
    const blended = Math.round(part + (reach * share) / WHOLE);

    return blended.toString(BASE_HEX).padStart(2, "0");
  });

  const blend = `#${pairs.join("")}`;
  return blend;
};

export default getBlend;
