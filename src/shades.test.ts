import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import COLORS, { type ColorID, SLATE } from "./colors";
import getContrast, { CONTRAST_WORDS } from "./contrast";
import { getOklch } from "./oklch";
import SHADES, {
  getShades,
  getStep,
  getWords,
  LIGHTNESS_SHADE,
  type ShadeStep,
  STEP_WHITE,
  STEPS_SHADE,
  WORDS_INK,
  WORDS_WHITE,
} from "./shades";

const IDS = Object.keys(COLORS) as ColorID[];

// Every value of every scale. A value changes only on purpose.
const VALUES: Record<ColorID, Record<ShadeStep, string>> = {
  purple: {
    50: "#f0f0ff",
    100: "#e1e2ff",
    200: "#cbcbff",
    300: "#b6b4ff",
    400: "#9c96f9",
    500: "#857edd",
    600: "#6e65c3",
    700: "#584da8",
    800: "#43368f",
    900: "#2e1a72",
    950: "#1b0052",
  },
  blue: {
    50: "#eaf3ff",
    100: "#d4e7ff",
    200: "#b3d4ff",
    300: "#90c1ff",
    400: "#60a7ff",
    500: "#1f8bff",
    600: "#0172dc",
    700: "#005cb3",
    800: "#00468c",
    900: "#003267",
    950: "#001a3b",
  },
  pink: {
    50: "#feecf2",
    100: "#ffd9e6",
    200: "#ffbad3",
    300: "#ff99c1",
    400: "#ff4fa3",
    500: "#eb3a92",
    600: "#ce117a",
    700: "#a90162",
    800: "#84004c",
    900: "#600036",
    950: "#37001c",
  },
  yellow: {
    50: "#fff2c7",
    100: "#ffd84d",
    200: "#f4ce40",
    300: "#e1ba21",
    400: "#c4a100",
    500: "#a88900",
    600: "#8c7200",
    700: "#715b01",
    800: "#574601",
    900: "#3e3100",
    950: "#221a00",
  },
};

const FILE_README = "README.md";

// More than one space in a row, as a table of the README has them.
const PATTERN_SPACES = / +/g;

// The step that each brand colour is, in its own scale.
const STEPS_BRAND: Record<ColorID, ShadeStep> = {
  purple: 900,
  blue: 500,
  pink: 400,
  yellow: 100,
};

// How far a made step may lie from the lightness of its step and from the
// hue of its colour. A hex value has 256 steps for each channel, so a made
// colour is a little off.
const ROOM_LIGHTNESS = 0.005;
const ROOM_HUE = 2;
const ROOM_CHROMA = 0.002;

// Every step of every scale, with its colour and its place.
const getAll = function getAll(): [ColorID, ShadeStep, string][] {
  const all = IDS.flatMap((id) =>
    STEPS_SHADE.map((step): [ColorID, ShadeStep, string] => [
      id,
      step,
      SHADES[id][step],
    ]),
  );

  return all;
};

test("every value of every scale is held", () => {
  assert.deepEqual(SHADES, VALUES);
});

test("the steps of a scale are named as the steps of the slate are", () => {
  assert.deepEqual(STEPS_SHADE.map(String), Object.keys(SLATE));

  IDS.forEach((id) => {
    assert.deepEqual(Object.keys(SHADES[id]), Object.keys(SLATE), id);
  });
});

test("a brand colour does not change: it is one step of its own scale", () => {
  IDS.forEach((id) => {
    const { value } = COLORS[id];

    assert.equal(getStep(value), STEPS_BRAND[id], id);
    assert.equal(SHADES[id][STEPS_BRAND[id]], value, id);
  });
});

test("a brand colour sits at the step whose lightness is nearest to its own", () => {
  IDS.forEach((id) => {
    const { lightness } = getOklch(COLORS[id].value);
    const distance = Math.abs(LIGHTNESS_SHADE[STEPS_BRAND[id]] - lightness);

    STEPS_SHADE.forEach((step) => {
      assert.ok(distance <= Math.abs(LIGHTNESS_SHADE[step] - lightness), id);
    });
  });
});

test("the lightness of the steps falls from the first step to the last", () => {
  const lightnesses = STEPS_SHADE.map((step) => LIGHTNESS_SHADE[step]);

  assert.deepEqual(
    lightnesses,
    [...lightnesses].sort((one, two) => two - one),
  );

  assert.equal(new Set(lightnesses).size, STEPS_SHADE.length);
  assert.ok(lightnesses.every((lightness) => lightness > 0 && lightness < 1));
});

test("every scale gets darker from step to step", () => {
  IDS.forEach((id) => {
    const lightnesses = STEPS_SHADE.map(
      (step) => getOklch(SHADES[id][step]).lightness,
    );

    lightnesses.slice(1).forEach((lightness, index) => {
      assert.ok(lightness < lightnesses[index], `${id} ${STEPS_SHADE[index]}`);
    });
  });
});

test("a made step has the lightness of its step and the hue of its colour", () => {
  getAll()
    .filter(([id, step]) => step !== STEPS_BRAND[id])
    .forEach(([id, step, value]) => {
      const own = getOklch(COLORS[id].value);
      const made = getOklch(value);
      const turn = Math.abs(made.hue - own.hue);
      const place = `${id} ${step}`;

      assert.ok(
        Math.abs(made.lightness - LIGHTNESS_SHADE[step]) < ROOM_LIGHTNESS,
        place,
      );

      assert.ok(Math.min(turn, 360 - turn) < ROOM_HUE, place);
    });
});

test("a made step is never stronger than its colour", () => {
  getAll().forEach(([id, step, value]) => {
    const own = getOklch(COLORS[id].value);

    assert.ok(
      getOklch(value).chroma <= own.chroma + ROOM_CHROMA,
      `${id} ${step}`,
    );
  });
});

test("a step of 600 or darker takes white words, and a lighter step takes ink words", () => {
  const steps = STEPS_SHADE.filter((step) => step >= STEP_WHITE);

  assert.equal(STEP_WHITE, 600);
  assert.equal(WORDS_WHITE, "#ffffff");
  assert.equal(WORDS_INK, SLATE[950]);

  STEPS_SHADE.forEach((step) => {
    assert.equal(
      getWords(step),
      steps.includes(step) ? WORDS_WHITE : WORDS_INK,
      `${step}`,
    );
  });
});

test("the words on every step of every scale reach the contrast that small words need", () => {
  getAll().forEach(([id, step, value]) => {
    const contrast = getContrast(getWords(step), value);

    assert.ok(contrast >= CONTRAST_WORDS, `${id} ${step}: ${contrast}`);
  });
});

test("the rule can't start one step lighter: white words fail on a step of 500", () => {
  const stepLighter: ShadeStep = 500;

  IDS.forEach((id) => {
    const contrast = getContrast(WORDS_WHITE, SHADES[id][stepLighter]);

    assert.ok(contrast < CONTRAST_WORDS, `${id}: ${contrast}`);
  });
});

test("the scale of a colour is made the same way for a colour that is no brand colour", () => {
  const shades = getShades(SLATE[500]);

  assert.equal(shades[getStep(SLATE[500])], SLATE[500]);
  assert.deepEqual(Object.keys(shades), Object.keys(SLATE));
});

test("a colour written in capitals keeps its value in small letters", () => {
  const shades = getShades(COLORS.blue.value.toUpperCase());

  assert.equal(shades[STEPS_BRAND.blue], COLORS.blue.value);
});

test("the README shows every step of every scale, with the words that it takes", async () => {
  const readme = (await readFile(FILE_README, "utf8")).replace(
    PATTERN_SPACES,
    " ",
  );

  STEPS_SHADE.forEach((step) => {
    const values = IDS.map((id) => `\`${SHADES[id][step]}\``);
    const words = getWords(step) === WORDS_WHITE ? "White" : "Ink";
    const row = `| ${[step, ...values, words].join(" | ")} |`;

    assert.ok(readme.includes(row), row);
  });
});

test("the README names the step of each brand colour", async () => {
  const readme = await readFile(FILE_README, "utf8");

  const steps = IDS.map((id) => `${id} ${STEPS_BRAND[id]}`);
  const [last, ...rest] = [...steps].reverse();
  const sentence = `${rest.reverse().join(", ")} and ${last}`;

  assert.ok(readme.includes(sentence), sentence);
});
