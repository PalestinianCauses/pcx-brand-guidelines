import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import COLORS, {
  type ColorID,
  GROUND_DARK,
  GROUND_LIGHT,
  type GroundsID,
  GROUNDS,
} from "./colors";
import getContrast, { CONTRAST_PARTS, getContrastShown } from "./contrast";
import FILLS, { getMainFill } from "./fills";
import SHADES, { WORDS_INK, WORDS_WHITE } from "./shades";
import SHAPE, {
  getFocusColor,
  HEIGHT_FINGER,
  isFocusAround,
  POINTER_PRESS,
  SIDE_LEAST,
  SIZES_CONTROL,
  STEP_CONTROL,
  UNIT,
} from "./shape";
import { getScaled, SCREEN_LAPTOP, SCREEN_PHONE } from "./type";

const FILE_README = "README.md";

const IDS = Object.keys(COLORS) as ColorID[];

// The two channels of a hex colour that stand for one of red, green and
// blue, and the base of such a number.
const PATTERN_PAIR = /[0-9a-f]{2}/gi;
const BASE_HEX = 16;

// A colour as it shows over another one at a share of its strength.
const getBlend = function getBlend(
  under: string,
  over: string,
  share: number,
): string {
  const channelsOver = (over.match(PATTERN_PAIR) || []).map((pair) =>
    parseInt(pair, BASE_HEX),
  );

  const channels = (under.match(PATTERN_PAIR) || []).map((pair, index) => {
    const channel = parseInt(pair, BASE_HEX);
    const overChannel = channelsOver[index] || 0;
    const blended = Math.round(channel * (1 - share) + overChannel * share);

    return blended.toString(BASE_HEX).padStart(2, "0");
  });

  return `#${channels.join("")}`;
};

// A list as a sentence writes it: 28, 36, 44 and 52.
const getList = function getList(items: (number | string)[]): string {
  const list = `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
  return list;
};

test("the shape keeps its corners, lines, heights and spaces", () => {
  assert.deepEqual(SHAPE, {
    corner: 0,
    lines: { thin: 1, thick: 2 },
    heightControl: 44,
    heightsControl: { xs: 28, sm: 36, default: 44, lg: 52 },
    focus: {
      width: 1,
      ringWidth: 1,
      ringShare: 0.5,
      colorDark: "#ffffff",
      colorLight: "#020618",
      outlineWidth: 1,
      outlineOffset: 2,
    },
    ringFocus: { width: 2, offset: 2, color: "#1f8bff" },
    spaces: {
      inside: 24,
      between: 16,
      heading: 28,
      sectionAbovePhone: 48,
      sectionAboveLaptop: 96,
      sectionBelowPhone: 56,
      sectionBelowLaptop: 96,
      sectionPhone: 48,
      sectionLaptop: 96,
    },
  });
});

test("the unit, the height for a finger and the contrast for parts keep their values", () => {
  assert.equal(UNIT, 4);
  assert.equal(HEIGHT_FINGER, 44);
  assert.equal(CONTRAST_PARTS, 3);
});

test("the least side for a pointer, the step of a control and the pointer keep their values", () => {
  assert.equal(SIDE_LEAST, 24);
  assert.equal(STEP_CONTROL, 8);
  assert.equal(POINTER_PRESS, "pointer");
  assert.deepEqual(SIZES_CONTROL, ["xs", "sm", "default", "lg"]);
});

test("every space and every height of a control are multiples of the unit", () => {
  const sizes = [
    ...Object.values(SHAPE.spaces),
    ...Object.values(SHAPE.heightsControl),
    SHAPE.heightControl,
  ];

  const sizesUnfit = sizes.filter((size) => size % UNIT !== 0);

  assert.deepEqual(sizesUnfit, []);
});

test("a control has four sizes, from the smallest to the largest, each one step higher than the one before", () => {
  const heights = SIZES_CONTROL.map((size) => SHAPE.heightsControl[size]);
  const steps = heights
    .slice(1)
    .map((height, index) => height - heights[index]);

  assert.deepEqual(Object.keys(SHAPE.heightsControl), SIZES_CONTROL);

  assert.deepEqual(
    steps,
    steps.map(() => STEP_CONTROL),
  );

  assert.equal(STEP_CONTROL % UNIT, 0);
});

test("the default size is the height of a control, and no size is too small for a pointer", () => {
  const heights = Object.values(SHAPE.heightsControl);

  assert.equal(SHAPE.heightsControl.default, SHAPE.heightControl);
  assert.equal(SHAPE.heightsControl.default, HEIGHT_FINGER);
  assert.ok(SIDE_LEAST < HEIGHT_FINGER);

  assert.deepEqual(
    heights.filter((height) => height < SIDE_LEAST),
    [],
  );
});

test("only the two smaller sizes are lower than a finger needs", () => {
  const sizesLow = SIZES_CONTROL.filter(
    (size) => SHAPE.heightsControl[size] < HEIGHT_FINGER,
  );

  assert.deepEqual(sizesLow, ["xs", "sm"]);
});

test("a control is high enough for a finger", () => {
  assert.ok(SHAPE.heightControl >= HEIGHT_FINGER);
});

test("the thick line is twice the thin line", () => {
  assert.equal(SHAPE.lines.thick, SHAPE.lines.thin * 2);
});

test("a section gets more room on a laptop than on a phone, above and below", () => {
  const { spaces } = SHAPE;

  assert.ok(spaces.sectionAboveLaptop > spaces.sectionAbovePhone);
  assert.ok(spaces.sectionBelowLaptop > spaces.sectionBelowPhone);
});

test("the room around a section grows evenly from the phone to the laptop", () => {
  const { spaces } = SHAPE;
  const screenMiddle = (SCREEN_PHONE + SCREEN_LAPTOP) / 2;

  const above = getScaled(
    spaces.sectionAbovePhone,
    spaces.sectionAboveLaptop,
    screenMiddle,
  );

  const below = getScaled(
    spaces.sectionBelowPhone,
    spaces.sectionBelowLaptop,
    screenMiddle,
  );

  assert.equal(above, 72);
  assert.equal(below, 76);
});

test("the two older names still hold the room above a section", () => {
  const { spaces } = SHAPE;

  assert.equal(spaces.sectionPhone, spaces.sectionAbovePhone);
  assert.equal(spaces.sectionLaptop, spaces.sectionAboveLaptop);
});

test("two cards stand apart, and a card has more room inside than between", () => {
  assert.ok(SHAPE.spaces.between > 0);
  assert.ok(SHAPE.spaces.inside > SHAPE.spaces.between);
});

test("the line of the focus is the strong colour of its ground, and it shows on both grounds", () => {
  const { colorDark, colorLight } = SHAPE.focus;

  assert.equal(colorDark, WORDS_WHITE);
  assert.equal(colorLight, WORDS_INK);
  assert.ok(getContrast(colorDark, GROUND_DARK) >= CONTRAST_PARTS);
  assert.ok(getContrast(colorLight, GROUND_LIGHT) >= CONTRAST_PARTS);
});

test("the line of the focus is no step of a brand colour", () => {
  const { colorDark, colorLight } = SHAPE.focus;

  const shades: string[] = Object.values(SHADES).flatMap((scale) =>
    Object.values(scale),
  );

  assert.ok(shades.includes(COLORS.blue.value));
  assert.ok(!shades.includes(colorDark));
  assert.ok(!shades.includes(colorLight));
});

test("the soft ring around the line of the focus shows on both grounds, at its share of the colour", () => {
  const { colorDark, colorLight, ringShare } = SHAPE.focus;
  const softDark = getBlend(GROUND_DARK, colorDark, ringShare);
  const softLight = getBlend(GROUND_LIGHT, colorLight, ringShare);

  assert.ok(ringShare > 0 && ringShare < 1);
  assert.ok(getContrast(softDark, GROUND_DARK) >= CONTRAST_PARTS);
  assert.ok(getContrast(softLight, GROUND_LIGHT) >= CONTRAST_PARTS);
});

test("the line of the focus, its soft ring and the outline for forced colours are thin lines", () => {
  const { focus, lines } = SHAPE;

  assert.equal(focus.width, lines.thin);
  assert.equal(focus.ringWidth, lines.thin);
  assert.equal(focus.outlineWidth, lines.thin);
  assert.ok(focus.outlineOffset > 0);
});

test("the line of the focus stands out from the fill of a blue button, where the brand's blue did not", () => {
  const { colorDark, colorLight } = SHAPE.focus;
  const fill = FILLS.blue.color;

  assert.ok(getContrast(SHAPE.ringFocus.color, fill) < CONTRAST_PARTS);
  assert.ok(getContrast(colorDark, fill) >= CONTRAST_PARTS);
  assert.ok(getContrast(colorLight, fill) >= CONTRAST_PARTS);
});

test("the line of the focus stands out from every fill but a pale one on a dark ground", () => {
  const { colorDark, colorLight } = SHAPE.focus;

  const weak = IDS.flatMap((id) => [
    [id, "dark", getContrast(colorDark, FILLS[id].color)] as const,
    [id, "light", getContrast(colorLight, FILLS[id].color)] as const,
  ]).filter(([, , contrast]) => contrast < CONTRAST_PARTS);

  // There the line stands around the button, as `isFocusAround` says.
  assert.deepEqual(
    weak.map(([id, ground]) => [id, ground]),
    [["yellow", "dark"]],
  );

  assert.ok(getContrast(colorDark, GROUND_DARK) >= CONTRAST_PARTS);
});

test("the README says where the line of the focus is weak, as it is measured", async () => {
  const readme = await readFile(FILE_README, "utf8");

  const shown = getContrastShown(
    getContrast(SHAPE.focus.colorDark, FILLS.yellow.color),
  );

  assert.ok(
    readme.includes(
      `Against the brand's yellow the white line reaches ${shown}`,
    ),
  );
  assert.ok(
    readme.includes(
      "It stands out from the fill of every button in a brand colour but one, the yellow one where the line is white.",
    ),
  );
});

test("the older focus ring keeps its values, in the brand's blue", () => {
  assert.deepEqual(SHAPE.ringFocus, {
    width: 2,
    offset: 2,
    color: COLORS.blue.value,
  });
});

test("the README says the sizes of a control, the focus and the older ring as they are", async () => {
  const readme = await readFile(FILE_README, "utf8");
  const { focus, ringFocus } = SHAPE;
  const heights = SIZES_CONTROL.map((size) => SHAPE.heightsControl[size]);
  const sizes = getList(SIZES_CONTROL);

  const shown = getContrastShown(
    getContrast(ringFocus.color, FILLS.blue.color),
  );

  assert.ok(readme.includes(`${getList(heights)} pixels, named ${sizes}`));

  assert.ok(
    readme.includes(`One size is ${STEP_CONTROL} pixels higher than the one`),
  );

  assert.ok(
    readme.includes(`the ${SIDE_LEAST} by ${SIDE_LEAST} pixels that WCAG`),
  );

  assert.ok(
    readme.includes(
      `A line of ${focus.width} pixel, with a soft ring of ${focus.ringWidth} pixel around it`,
    ),
  );

  assert.ok(
    readme.includes(
      `an outline of ${focus.outlineWidth} pixel stands around the part, ${focus.outlineOffset} pixels away`,
    ),
  );

  assert.ok(
    readme.includes(
      `${ringFocus.width} pixels thick and ${ringFocus.offset} pixels away`,
    ),
  );

  assert.ok(readme.includes(`the two reach ${shown}`));
});

test("on every ground the line of the focus has the colour of the words on that ground, and it stands out from the ground", () => {
  const grounds = Object.keys(GROUNDS) as GroundsID[];

  assert.equal(getFocusColor("dark"), SHAPE.focus.colorDark);
  assert.equal(getFocusColor("light"), SHAPE.focus.colorLight);
  assert.equal(getFocusColor("purple"), WORDS_WHITE);

  (["blue", "pink", "yellow"] as GroundsID[]).forEach((ground) => {
    assert.equal(getFocusColor(ground), WORDS_INK, ground);
  });

  grounds.forEach((ground) => {
    assert.ok(
      getContrast(getFocusColor(ground), GROUNDS[ground]) >= CONTRAST_PARTS,
      ground,
    );
  });
});

test("the line of the focus stands around a part whose fill hides it: the main button of a ground in a brand colour, and the yellow button on a ground with a white line", () => {
  const grounds = Object.keys(GROUNDS) as GroundsID[];

  grounds.forEach((ground) => {
    const isColor = ground !== "dark" && ground !== "light";
    const main = getMainFill(ground);

    assert.equal(isFocusAround(main.color, ground), isColor, ground);

    // A button in a brand colour keeps the line on its edge where the line
    // can be seen there: where it reaches the contrast of a part against
    // the fill of the button.
    IDS.forEach((id) => {
      const reach = getContrast(getFocusColor(ground), FILLS[id].color);

      assert.equal(
        isFocusAround(FILLS[id].color, ground),
        reach < CONTRAST_PARTS,
        `${id} ${ground}`,
      );
    });
  });

  // That leaves two places where a fill in a brand colour hides the line.
  const hidden = grounds.flatMap((ground) =>
    IDS.filter((id) => isFocusAround(FILLS[id].color, ground)).map(
      (id) => `${id} on ${ground}`,
    ),
  );

  assert.deepEqual(hidden, ["yellow on dark", "yellow on purple"]);
  assert.equal(isFocusAround("#FFFFFF", "purple"), true);
});

test("the README says where the line of the focus stands around a part, as it is measured", async () => {
  const readme = await readFile(FILE_README, "utf8");
  const { outlineOffset, outlineWidth } = SHAPE.focus;

  const shown = (["purple", "blue", "pink", "yellow"] as GroundsID[]).map(
    (ground) =>
      getContrastShown(getContrast(getFocusColor(ground), GROUNDS[ground])),
  );

  assert.ok(
    readme.includes(
      `a line of ${outlineWidth} pixel stands around the part, ${outlineOffset} pixels away, in the colour of the line`,
    ),
  );
  assert.ok(
    readme.includes(
      `${shown[0]} on purple, ${shown[1]} on blue, ${shown[2]} on pink and ${shown[3]} on yellow`,
    ),
  );

  // The same line stands around every part whose fill hides the line.
  const reach = getContrastShown(
    getContrast(getFocusColor("dark"), FILLS.yellow.color),
  );

  assert.ok(
    readme.includes(
      `Where the line reaches less than ${CONTRAST_PARTS} against the fill of a part, it stands around that part in the same way. Against the brand's yellow the white line reaches ${reach}, so that holds for a yellow button on the dark and on the purple ground.`,
    ),
  );
});
