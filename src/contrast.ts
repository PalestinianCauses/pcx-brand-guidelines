// The contrast between two colours, by the formula of WCAG 2. A colour is a
// hex value with six digits, such as #1f8bff.

// The least contrast for words of any size: level AA of WCAG 2.
export const CONTRAST_WORDS = 4.5;

// The least contrast for a part that is not words, such as a focus ring or
// the line around a field: level AA of WCAG 2.
export const CONTRAST_PARTS = 3;

// The digits that a shown contrast may end in: an even digit, or 5.
const ENDINGS = [0, 2, 4, 5, 6, 8];

const PATTERN_COLOR = /^#[0-9a-f]{6}$/i;
const PATTERN_PAIR = /[0-9a-f]{2}/gi;

// One channel of a colour, from its two hex digits to its linear value.
const getChannel = function getChannel(pair: string): number {
  const share = parseInt(pair, 16) / 255;
  const channel =
    share <= 0.04045 ? share / 12.92 : ((share + 0.055) / 1.055) ** 2.4;

  return channel;
};

// The three channels of a colour, each as its linear value: red, green and
// blue.
export const getChannels = function getChannels(color: string): number[] {
  if (!PATTERN_COLOR.test(color))
    throw new Error(`"${color}" is not a hex colour with six digits.`);

  const channels = (color.match(PATTERN_PAIR) || []).map(getChannel);
  return channels;
};

export const getLuminance = function getLuminance(color: string): number {
  const [red, green, blue] = getChannels(color);
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

  return luminance;
};

// From 1, for two colours that are the same, to 21, for white on black. The
// order of the two colours does not matter.
const getContrast = function getContrast(
  colorOne: string,
  colorTwo: string,
): number {
  const luminances = [getLuminance(colorOne), getLuminance(colorTwo)];
  const lighter = Math.max(...luminances);
  const darker = Math.min(...luminances);
  const contrast = (lighter + 0.05) / (darker + 0.05);

  return contrast;
};

// The tenths of a contrast: the greatest whole number of tenths that is not
// more than the contrast. The first guess can be one off in either direction,
// because a product of two numbers is not exact. So the three numbers around
// it are compared with the contrast itself.
const getTenths = function getTenths(contrast: number): number {
  const guess = Math.floor(contrast * 10);
  const candidates = [guess + 1, guess, guess - 1];
  const tenths = candidates.find((candidate) => candidate / 10 <= contrast);

  return tenths ?? guess - 1;
};

// A contrast as a person reads it: with one digit after the point, rounded
// down to the nearest one that ends in an even digit or in 5. It is rounded
// down and never up, so the shown contrast is never more than the measured
// one. Both limits lie on that grid, so a shown contrast reaches a limit
// exactly when the measured one does.
export const getContrastShown = function getContrastShown(
  contrast: number,
): string {
  const tenths = getTenths(contrast);
  const tenthsShown = ENDINGS.includes(tenths % 10) ? tenths : tenths - 1;
  const shown = (tenthsShown / 10).toFixed(1);

  return shown;
};

export default getContrast;
