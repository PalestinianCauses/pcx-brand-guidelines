import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import COLORS, {
  type ColorID,
  GROUND_DARK,
  GROUND_LIGHT,
  type GroundsID,
  GROUNDS,
  SLATE,
} from "./colors";
import getContrast, {
  CONTRAST_PARTS,
  CONTRAST_WORDS,
  getContrastShown,
} from "./contrast";
import FILLS, {
  COLOR_ACTION,
  COLORS_PALE,
  type Fill,
  getFill,
  getFillsClear,
  getMainFill,
  SHARES_QUIET,
} from "./fills";
import SHADES, {
  getStep,
  getWords,
  STEP_WHITE,
  STEPS_SHADE,
  WORDS_INK,
  WORDS_WHITE,
} from "./shades";

const FILE_README = "README.md";

const IDS = Object.keys(COLORS) as ColorID[];

const PATTERN_SPACES = /\s+/g;

// Every fill. A value changes only on purpose.
const VALUES: Record<ColorID, Fill> = {
  purple: {
    step: 600,
    stepHover: 700,
    color: "#6e65c3",
    colorHover: "#584da8",
    words: "#ffffff",
    isClearOnDark: true,
    isClearOnLight: true,
  },
  blue: {
    step: 600,
    stepHover: 700,
    color: "#0072dc",
    colorHover: "#005cb3",
    words: "#ffffff",
    isClearOnDark: true,
    isClearOnLight: true,
  },
  pink: {
    step: 600,
    stepHover: 700,
    color: "#ce117a",
    colorHover: "#a90062",
    words: "#ffffff",
    isClearOnDark: true,
    isClearOnLight: true,
  },
  yellow: {
    step: 100,
    stepHover: 200,
    color: "#ffd84d",
    colorHover: "#f4ce40",
    words: "#020618",
    isClearOnDark: true,
    isClearOnLight: false,
  },
};

// The name of a colour as the README writes it: Blue, not blue.
const getName = function getName(id: ColorID): string {
  const name = `${id.charAt(0).toUpperCase()}${id.slice(1)}`;
  return name;
};

test("every fill is held", () => {
  assert.deepEqual(FILLS, VALUES);
});

test("a fill is made the same way when it is asked for by its colour", () => {
  IDS.forEach((id) => {
    assert.deepEqual(getFill(id), FILLS[id], id);
  });
});

test("a fill is the first step that takes white words, and a pale colour keeps its own step", () => {
  IDS.forEach((id) => {
    const isPale = COLORS_PALE.includes(id);
    const step = isPale ? getStep(COLORS[id].value) : STEP_WHITE;

    assert.equal(FILLS[id].step, step, id);
    assert.equal(FILLS[id].color === COLORS[id].value, isPale, id);
  });
});

test("yellow is the pale colour, and its own step is too light for white words", () => {
  assert.deepEqual(COLORS_PALE, ["yellow"]);

  COLORS_PALE.forEach((id) => {
    assert.ok(getStep(COLORS[id].value) < STEP_WHITE, id);
    assert.equal(FILLS[id].words, WORDS_INK, id);
  });
});

test("under the pointer a fill is one step darker, on its own scale", () => {
  IDS.forEach((id) => {
    const { color, colorHover, step, stepHover } = FILLS[id];
    const place = STEPS_SHADE.indexOf(step);

    assert.equal(stepHover, STEPS_SHADE[place + 1], id);
    assert.equal(color, SHADES[id][step], id);
    assert.equal(colorHover, SHADES[id][stepHover], id);
  });
});

test("the words on a fill are the words of its step, at rest and under the pointer, and they can be read", () => {
  IDS.forEach((id) => {
    const { color, colorHover, step, stepHover, words } = FILLS[id];
    const isPale = COLORS_PALE.includes(id);

    assert.equal(words, isPale ? WORDS_INK : WORDS_WHITE, id);
    assert.equal(words, getWords(step), id);
    assert.equal(words, getWords(stepHover), id);
    assert.ok(getContrast(words, color) >= CONTRAST_WORDS, id);
    assert.ok(getContrast(words, colorHover) >= CONTRAST_WORDS, id);
  });
});

test("the main button of a view has the brand's colour of an action", () => {
  assert.equal(COLOR_ACTION, "blue");
  assert.equal(COLORS[COLOR_ACTION].role, "Action");
});

test("a fill stands out from a grey when the two reach what a part needs, by measure", () => {
  IDS.forEach((id) => {
    const { color, isClearOnDark, isClearOnLight } = FILLS[id];

    assert.equal(
      isClearOnDark,
      getContrast(color, GROUND_DARK) >= CONTRAST_PARTS,
      id,
    );

    assert.equal(
      isClearOnLight,
      getContrast(color, GROUND_LIGHT) >= CONTRAST_PARTS,
      id,
    );
  });
});

test("only a pale fill does not stand out from the lightest grey, and every fill stands out from the darkest", () => {
  IDS.forEach((id) => {
    assert.equal(FILLS[id].isClearOnDark, true, id);
    assert.equal(FILLS[id].isClearOnLight, !COLORS_PALE.includes(id), id);
  });
});

test("under the pointer, two fills fall under what a part needs against the darkest grey, and their words still carry them", () => {
  const weak = IDS.filter(
    (id) => getContrast(FILLS[id].colorHover, GROUND_DARK) < CONTRAST_PARTS,
  );

  assert.deepEqual(weak, ["purple", "pink"]);

  weak.forEach((id) => {
    const { colorHover, words } = FILLS[id];

    assert.ok(getContrast(words, colorHover) >= CONTRAST_WORDS, id);
  });
});

test("the README shows every fill, with its steps, its words and where it stands out", async () => {
  const readme = (await readFile(FILE_README, "utf8")).replace(
    PATTERN_SPACES,
    " ",
  );

  IDS.forEach((id) => {
    const name = getName(id);
    const fill = FILLS[id];

    const row = [
      name,
      `${name} ${fill.step}, \`${fill.color}\``,
      `${name} ${fill.stepHover}, \`${fill.colorHover}\``,
      fill.words === WORDS_WHITE ? "White" : "Ink",
      fill.isClearOnDark ? "Yes" : "No",
      fill.isClearOnLight ? "Yes" : "No",
    ].join(" | ");

    assert.ok(readme.includes(`| ${row} |`), row);
  });
});

test("the README says how far the weak pairs fall, as they are measured", async () => {
  const readme = await readFile(FILE_README, "utf8");

  const getShown = function getShown(one: string, two: string): string {
    const shown = getContrastShown(getContrast(one, two));
    return shown;
  };

  const pale = getShown(FILLS.yellow.color, GROUND_LIGHT);
  const purple = getShown(FILLS.purple.colorHover, GROUND_DARK);
  const pink = getShown(FILLS.pink.colorHover, GROUND_DARK);

  assert.ok(
    readme.includes(`The yellow fill reaches ${pale} against the lightest`),
  );

  assert.ok(
    readme.includes(`against the darkest grey, at ${purple} and ${pink}`),
  );

  assert.ok(readme.includes(`A fill is step ${STEP_WHITE} of its scale`));
});

// Every ground, and the four in a brand colour.
const IDS_GROUND = Object.keys(GROUNDS) as GroundsID[];
const IDS_COLOR: GroundsID[] = IDS;

test("the six grounds are the darkest grey, the lightest grey and the four brand colours", () => {
  assert.deepEqual(IDS_GROUND, ["dark", "light", ...IDS]);
  assert.equal(GROUNDS.dark, GROUND_DARK);
  assert.equal(GROUNDS.light, GROUND_LIGHT);

  IDS.forEach((id) => {
    assert.equal(GROUNDS[id], COLORS[id].value, id);
  });
});

test("no fill in a brand colour stands out from the blue or from the pink ground, and only the yellow one from the purple ground", () => {
  const clear = Object.fromEntries(
    IDS_GROUND.map((ground) => [ground, getFillsClear(ground)]),
  );

  assert.deepEqual(clear, {
    dark: ["purple", "blue", "pink", "yellow"],
    light: ["purple", "blue", "pink"],
    purple: ["yellow"],
    blue: [],
    pink: [],
    yellow: ["purple", "blue", "pink"],
  });

  IDS_GROUND.forEach((ground) => {
    IDS.forEach((id) => {
      const reaches =
        getContrast(FILLS[id].color, GROUNDS[ground]) >= CONTRAST_PARTS;

      assert.equal(getFillsClear(ground).includes(id), reaches, ground);
    });
  });
});

test("the main button is the brand's colour of an action on the dark and on the light ground, and the colour of the words on a ground in a brand colour", () => {
  const { color, colorHover, words } = FILLS[COLOR_ACTION];

  assert.deepEqual(getMainFill("dark"), { color, colorHover, words });
  assert.deepEqual(getMainFill("light"), { color, colorHover, words });

  assert.deepEqual(getMainFill("purple"), {
    color: WORDS_WHITE,
    colorHover: SLATE[200],
    words: WORDS_INK,
  });

  IDS_COLOR.filter((ground) => ground !== "purple").forEach((ground) => {
    assert.deepEqual(
      getMainFill(ground),
      { color: WORDS_INK, colorHover: SLATE[800], words: WORDS_WHITE },
      ground,
    );
  });
});

test("the main button stands out from every ground at rest and under the pointer, and its words can be read", () => {
  IDS_GROUND.forEach((ground) => {
    const main = getMainFill(ground);

    assert.ok(getContrast(main.color, GROUNDS[ground]) >= CONTRAST_PARTS);
    assert.ok(getContrast(main.colorHover, GROUNDS[ground]) >= CONTRAST_PARTS);
    assert.ok(getContrast(main.words, main.color) >= CONTRAST_WORDS, ground);
    assert.ok(getContrast(main.words, main.colorHover) >= CONTRAST_WORDS);
  });
});

test("a quiet fill keeps its shares, from the strongest to the weakest", () => {
  assert.deepEqual(SHARES_QUIET, {
    rest: [8, 6, 4],
    pointer: [12, 10, 8],
    mixed: 5,
  });

  [SHARES_QUIET.rest, SHARES_QUIET.pointer].forEach((shares) => {
    assert.deepEqual(
      [...shares].sort((one, two) => two - one),
      [...shares],
    );
  });
});

test("the README says which fill stands out from which ground, and the main button of every ground, as they are measured", async () => {
  const readme = (await readFile(FILE_README, "utf8")).replace(
    PATTERN_SPACES,
    " ",
  );

  IDS_GROUND.forEach((ground) => {
    const name = `${ground.charAt(0).toUpperCase()}${ground.slice(1)}`;
    const main = getMainFill(ground);

    const cells = IDS.map((id) => {
      const contrast = getContrast(FILLS[id].color, GROUNDS[ground]);
      const answer = contrast >= CONTRAST_PARTS ? "Yes" : "No";

      return `${answer}, ${getContrastShown(contrast)}`;
    });

    const row = `| ${name} | ${cells.join(" | ")} |`;
    const rowMain = `| ${name} | \`${main.color}\` | \`${main.colorHover}\` | \`${main.words}\` | ${getContrastShown(getContrast(main.color, GROUNDS[ground]))} |`;

    assert.ok(readme.includes(row), row);
    assert.ok(readme.includes(rowMain), rowMain);
  });
});
