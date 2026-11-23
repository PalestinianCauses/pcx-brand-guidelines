// The type scale of the PCX brand: eight steps, from the one big line of a
// page down to code. Headings are in sentence case, and only the label is in
// capitals.

import type { FontID } from "./fonts";

export type TypeStepID =
  | "body"
  | "code"
  | "display"
  | "heading"
  | "label"
  | "note"
  | "subheading"
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
  display: {
    name: "Display",
    use: "The one big line of a page.",
    font: "sans",
    weight: 800,
    sizePhone: 44,
    sizeLaptop: 96,
    leading: { value: 100, unit: "percent" },
    tracking: -0.04,
    isUppercase: false,
  },
  title: {
    name: "Title",
    use: "Page titles.",
    font: "sans",
    weight: 800,
    sizePhone: 36,
    sizeLaptop: 60,
    leading: { value: 105, unit: "percent" },
    tracking: -0.02,
    isUppercase: false,
  },
  heading: {
    name: "Heading",
    use: "Section headings.",
    font: "sans",
    weight: 800,
    sizePhone: 28,
    sizeLaptop: 40,
    leading: { value: 115, unit: "percent" },
    tracking: -0.02,
    isUppercase: false,
  },
  subheading: {
    name: "Subheading",
    use: "Block and card titles.",
    font: "sans",
    weight: 700,
    sizePhone: 20,
    sizeLaptop: 24,
    leading: { value: 120, unit: "percent" },
    tracking: 0,
    isUppercase: false,
  },
  body: {
    name: "Body",
    use: "Reading text.",
    font: "sans",
    weight: 400,
    sizePhone: 18,
    sizeLaptop: 18,
    leading: { value: 28, unit: "pixels" },
    tracking: 0,
    isUppercase: false,
  },
  note: {
    name: "Note",
    use: "Small supporting text.",
    font: "sans",
    weight: 400,
    sizePhone: 14,
    sizeLaptop: 14,
    leading: { value: 20, unit: "pixels" },
    tracking: 0,
    isUppercase: false,
  },
  label: {
    name: "Label",
    use: "Labels and buttons.",
    font: "mono",
    weight: 500,
    sizePhone: 12,
    sizeLaptop: 12,
    leading: { value: 16, unit: "pixels" },
    tracking: 0.12,
    isUppercase: true,
  },
  code: {
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

// The size of a step on a screen of a given width, in pixels. Between the
// phone and the laptop the size grows evenly with the screen. Under the
// phone and over the laptop it stays as it is.
export const getSize = function getSize(step: TypeStep, width: number): number {
  const share = (width - SCREEN_PHONE) / (SCREEN_LAPTOP - SCREEN_PHONE);
  const shareBounded = Math.min(1, Math.max(0, share));
  const size =
    step.sizePhone + (step.sizeLaptop - step.sizePhone) * shareBounded;

  return size;
};

export default TYPE;
