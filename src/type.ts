// The type scale of the PCX brand: nine steps, from the one big line of a
// page down to code. The three large headings and the label are shown in
// capitals. Their words are still written in sentence case. A sub-heading
// and all other text are shown as they are written. A button has a step of
// its own, and the label is for small labels.

import type { FontID } from "./fonts";

export type TypeStepID =
  | "body"
  | "button"
  | "code"
  | "display"
  | "heading"
  | "label"
  | "note"
  | "sub-heading"
  | "title";

// The height of a line: a number of pixels, or a percentage of the size.
export type Leading = {
  value: number;
  unit: "percent" | "pixels";
};

export type TypeStep = {
  name: string;
  use: string;
  font: FontID;
  weight: number;
  sizePhone: number;
  sizeLaptop: number;
  leading: Leading;
  tracking: number;
  isUppercase: boolean;
};

// The widths of the two screens that a size is set for, in pixels.
export const SCREEN_PHONE = 375;
export const SCREEN_LAPTOP = 1440;

// The least size of any text, in pixels.
export const SIZE_LEAST = 12;

// A size is in pixels: one for the phone and one for the laptop. The letter
// spacing is a share of the size, the em of a style sheet.
const TYPE: Record<TypeStepID, TypeStep> = {
  "display": {
    name: "Display",
    use: "The one big line of a page.",
    font: "sans",
    weight: 950,
    sizePhone: 54,
    sizeLaptop: 98,
    leading: { value: 92, unit: "percent" },
    tracking: -0.032,
    isUppercase: true,
  },
  "title": {
    name: "Title",
    use: "Page titles.",
    font: "sans",
    weight: 950,
    sizePhone: 46,
    sizeLaptop: 88,
    leading: { value: 94, unit: "percent" },
    tracking: -0.032,
    isUppercase: true,
  },
  "heading": {
    name: "Heading",
    use: "Section headings.",
    font: "sans",
    weight: 950,
    sizePhone: 38,
    sizeLaptop: 80,
    leading: { value: 96, unit: "percent" },
    tracking: -0.032,
    isUppercase: true,
  },
  "sub-heading": {
    name: "Sub-heading",
    use: "Block and card titles.",
    font: "sans",
    weight: 700,
    sizePhone: 24,
    sizeLaptop: 24,
    leading: { value: 120, unit: "percent" },
    tracking: -0.02,
    isUppercase: false,
  },
  "body": {
    name: "Body",
    use: "Reading text.",
    font: "sans",
    weight: 500,
    sizePhone: 16,
    sizeLaptop: 18,
    leading: { value: 160, unit: "percent" },
    tracking: 0,
    isUppercase: false,
  },
  "note": {
    name: "Note",
    use: "Small supporting text.",
    font: "sans",
    weight: 500,
    sizePhone: 15,
    sizeLaptop: 15,
    leading: { value: 150, unit: "percent" },
    tracking: 0,
    isUppercase: false,
  },
  "button": {
    name: "Button",
    use: "The words of a button.",
    font: "sans",
    weight: 600,
    sizePhone: 15,
    sizeLaptop: 15,
    leading: { value: 20, unit: "pixels" },
    tracking: 0,
    isUppercase: false,
  },
  "label": {
    name: "Label",
    use: "Small labels.",
    font: "mono",
    weight: 500,
    sizePhone: 12,
    sizeLaptop: 12,
    leading: { value: 16, unit: "pixels" },
    tracking: 0.14,
    isUppercase: true,
  },
  "code": {
    name: "Code",
    use: "Code and figures.",
    font: "mono",
    weight: 400,
    sizePhone: 14,
    sizeLaptop: 14,
    leading: { value: 20, unit: "pixels" },
    tracking: 0,
    isUppercase: false,
  },
};

// A value on a screen of a given width, from its value on a phone and its
// value on a laptop. Between the two the value grows evenly with the screen.
// Under the phone and over the laptop it stays as it is.
export const getScaled = function getScaled(
  phone: number,
  laptop: number,
  width: number,
): number {
  const share = (width - SCREEN_PHONE) / (SCREEN_LAPTOP - SCREEN_PHONE);
  const shareBounded = Math.min(1, Math.max(0, share));
  const value = phone + (laptop - phone) * shareBounded;

  return value;
};

// The size of a step on a screen of a given width, in pixels.
export const getSize = function getSize(step: TypeStep, width: number): number {
  const size = getScaled(step.sizePhone, step.sizeLaptop, width);
  return size;
};

export default TYPE;
