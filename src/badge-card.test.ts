import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import BADGE, {
  type Badge,
  type BadgesID,
  getBadge,
  getQuiet,
  GROUNDS_SOFT,
} from "./badge";
import getBlend from "./blend";
import CARD, { getCard } from "./card";
import COLORS, { type ColorID, type GroundsID, GROUNDS, SLATE } from "./colors";
import getContrast, {
  CONTRAST_PARTS,
  CONTRAST_WORDS,
  getContrastShown,
} from "./contrast";
import { COLORS_PALE, SHARES_QUIET } from "./fills";
import MESSAGE, { getTint, GROUNDS_TINTED, type KindsID } from "./message";
import SHADES, {
  getWordsOn,
  type ShadeStep,
  WORDS_INK,
  WORDS_WHITE,
} from "./shades";
import SHAPE from "./shape";
import TYPE from "./type";

const FILE_README = "README.md";

const IDS = Object.keys(GROUNDS) as GroundsID[];
const STATES = Object.keys(MESSAGE.kinds) as KindsID[];

// The states that have a colour of their own.
const COLORED: KindsID[] = ["wrong", "warning", "note"];

// A solid colour, as a style sheet writes it.
const PATTERN_SOLID = /^#[0-9a-f]{6}$/;
const PATTERN_SPACES = /\s+/g;

const getShown = function getShown(color: string, under: string): string {
  const shown = getContrastShown(getContrast(color, under));
  return shown;
};

const getTitle = function getTitle(word: string): string {
  const title = `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  return title;
};

// A colour of a scale, as the README writes it: a step of the scale, or
// the brand's own colour where there is no step.
const getName = function getName(
  color: string,
  source: ColorID | undefined,
  step: ShadeStep | undefined,
): string {
  const colored = source ?? "";
  const written =
    step === undefined
      ? `The brand's ${colored}`
      : `${getTitle(colored)} ${step}`;

  const name = `${written}, \`${color}\``;
  return name;
};

const getReadme = async function getReadme(): Promise<string> {
  const readme = (await readFile(FILE_README, "utf8")).replace(
    PATTERN_SPACES,
    " ",
  );

  return readme;
};

test("a blend is the one solid colour that a screen shows for one colour on another at a share", () => {
  assert.equal(getBlend("#000000", "#ffffff", 50), "#808080");
  assert.equal(getBlend(SLATE[950], WORDS_WHITE, 0), SLATE[950]);
  assert.equal(getBlend(SLATE[950], WORDS_WHITE, 100), WORDS_WHITE);

  // A higher share brings the blend nearer to the colour that lies on
  // top.
  const blends = [4, 8, 12, 20].map((share) =>
    getBlend(COLORS.blue.value, WORDS_INK, share),
  );

  blends.forEach((blend, place) => {
    const before = blends[place - 1] ?? COLORS.blue.value;

    assert.match(blend, PATTERN_SOLID);
    assert.ok(getContrast(blend, WORDS_INK) < getContrast(before, WORDS_INK));
  });
});

test("a badge keeps its values, and its words are set as the label of a field is", () => {
  assert.deepEqual(BADGE.kinds, ["plain", ...STATES]);
  assert.equal(BADGE.type, "button");
  assert.equal(BADGE.height, 24);
  assert.equal(BADGE.room, 8);
  assert.equal(BADGE.icon, 14);
  assert.equal(BADGE.gap, 6);
  assert.equal(BADGE.line, SHAPE.lines.thin);
  assert.deepEqual(BADGE.steps, { deep: 900, pale: 100, palest: 50 });
  assert.deepEqual(GROUNDS_SOFT, ["dark", "light"]);

  const words = TYPE[BADGE.type];

  assert.equal(words.font, "sans");
  assert.equal(words.isUppercase, false);

  // The icon of a badge is smaller than the icon of a message, as a badge
  // is smaller than a message.
  assert.ok(BADGE.icon < MESSAGE.icon);
  assert.ok(BADGE.icon < BADGE.height);
});

test("the quiet fill is a solid colour on every ground, and the words on it can be read", () => {
  const fills = Object.fromEntries(
    IDS.map((ground) => [ground, getQuiet(ground)]),
  );

  assert.deepEqual(fills, {
    dark: SLATE[800],
    light: SLATE[200],
    purple: "#3f2c7d",
    blue: "#1d80ed",
    pink: "#eb4998",
    yellow: "#ebc749",
  });

  IDS.forEach((ground) => {
    const under = GROUNDS[ground];
    const words = getWordsOn(under);
    const quiet = getQuiet(ground);

    assert.match(quiet, PATTERN_SOLID, ground);
    assert.notEqual(quiet, under, ground);
    assert.ok(getContrast(words, quiet) >= CONTRAST_WORDS, ground);
  });

  // On a ground in a brand colour it is the strongest share of a quiet
  // button at which the words can still be read.
  (["purple", "blue", "pink", "yellow"] as const).forEach((ground) => {
    const under = GROUNDS[ground];
    const words = getWordsOn(under);

    const share = SHARES_QUIET.rest.find(
      (each) =>
        getContrast(words, getBlend(under, words, each)) >= CONTRAST_WORDS,
    );

    assert.equal(getQuiet(ground), getBlend(under, words, share ?? 0), ground);
  });
});

test("a plain badge and a success have the quiet fill and no line on every ground, and no words take the colour of a state", () => {
  IDS.forEach((ground) => {
    const words = getWordsOn(GROUNDS[ground]);

    const bare = {
      fill: getQuiet(ground),
      words,
      line: undefined,
      source: undefined,
      stepFill: undefined,
      stepIcon: undefined,
    };

    assert.deepEqual(getBadge("plain", ground), { ...bare, icon: undefined });
    assert.deepEqual(getBadge("success", ground), { ...bare, icon: words });

    BADGE.kinds.forEach((kind) => {
      assert.equal(getBadge(kind, ground).words, words, `${kind} ${ground}`);
    });
  });
});

test("on the dark and on the light ground a state that has a colour has a soft fill in that colour, and a line in the colour of its icon", () => {
  const badges = Object.fromEntries(
    GROUNDS_SOFT.map((ground) => [
      ground,
      COLORED.map((kind) => {
        const { fill, icon, line, stepFill, stepIcon } = getBadge(kind, ground);
        return { fill, icon, line, stepFill, stepIcon };
      }),
    ]),
  );

  const yellow = COLORS.yellow.value;
  const blue = COLORS.blue.value;

  const getSoft = (
    source: ColorID,
    stepFill: ShadeStep,
    icon: string,
    stepIcon: ShadeStep | undefined,
  ) => ({
    fill: SHADES[source][stepFill],
    icon,
    line: icon,
    stepFill,
    stepIcon,
  });

  assert.deepEqual(badges, {
    dark: [
      getSoft("pink", 900, SHADES.pink[500], 500),
      getSoft("yellow", 900, yellow, undefined),
      getSoft("blue", 900, blue, undefined),
    ],
    light: [
      getSoft("pink", 100, SHADES.pink[600], 600),
      getSoft("yellow", 50, SHADES.yellow[500], 500),
      getSoft("blue", 100, SHADES.blue[600], 600),
    ],
  });

  // A pale colour has the pale step as its own, so it takes the palest
  // step on the light ground.
  assert.deepEqual(COLORS_PALE, ["yellow"]);
  assert.equal(SHADES.yellow[BADGE.steps.pale], yellow);

  GROUNDS_SOFT.forEach((ground) => {
    COLORED.forEach((kind) => {
      const badge = getBadge(kind, ground);
      const { line = "" } = badge;
      const where = `${kind} ${ground}`;

      assert.equal(badge.source, MESSAGE.kinds[kind].color, where);
      assert.notEqual(badge.fill, getQuiet(ground), where);
      assert.ok(getContrast(badge.words, badge.fill) >= CONTRAST_WORDS, where);

      // The line stands out from the fill, from the ground and from the
      // fill of a card.
      [badge.fill, GROUNDS[ground], getCard(ground).fill].forEach((under) => {
        assert.ok(getContrast(line, under) >= CONTRAST_PARTS, where);
      });
    });
  });
});

test("on a ground in a brand colour a badge keeps the quiet fill and has no line: on the purple ground the icon alone has the colour of the state, and on the other three no state has a colour", () => {
  const icons = COLORED.map((kind) => {
    const { icon, stepIcon } = getBadge(kind, "purple");
    return [icon, stepIcon];
  });

  assert.deepEqual(icons, [
    [SHADES.pink[400], 400],
    [COLORS.yellow.value, undefined],
    [COLORS.blue.value, undefined],
  ]);

  IDS.filter((ground) => !GROUNDS_SOFT.includes(ground)).forEach((ground) => {
    const words = getWordsOn(GROUNDS[ground]);

    STATES.forEach((kind) => {
      const badge = getBadge(kind, ground);
      const where = `${kind} ${ground}`;

      assert.equal(badge.fill, getQuiet(ground), where);
      assert.equal(badge.line, undefined, where);
      assert.equal(badge.stepFill, undefined, where);

      // Where a message of that kind has no colour, the badge has none.
      assert.equal(badge.source, getTint(kind, ground).source, where);
      assert.equal(
        badge.icon === words,
        !GROUNDS_TINTED.includes(ground) || kind === "success",
        where,
      );
    });
  });
});

test("the icon of every state stands out from the fill of its badge, and its words can be read, on every ground", () => {
  IDS.forEach((ground) => {
    BADGE.kinds.forEach((kind) => {
      const badge = getBadge(kind, ground);
      const where = `${kind} ${ground}`;

      assert.match(badge.fill, PATTERN_SOLID, where);
      assert.ok(getContrast(badge.words, badge.fill) >= CONTRAST_WORDS, where);
      assert.equal(badge.icon === undefined, kind === "plain", where);

      assert.ok(
        badge.icon === undefined ||
          getContrast(badge.icon, badge.fill) >= CONTRAST_PARTS,
        where,
      );
    });
  });
});

test("a card keeps its values, says what it is for and what it is not for, and its words are never larger than its heading", () => {
  assert.deepEqual(CARD.type, { heading: "sub-heading", words: "body" });
  assert.equal(CARD.room, 24);
  assert.equal(CARD.gap, 24);
  assert.equal(CARD.arrow, 20);
  assert.deepEqual(CARD.sharesLine, { white: 14, ink: 20 });
  assert.equal(CARD.shareWords, 88);

  assert.ok(CARD.use.startsWith("A card holds a piece of content"));
  assert.equal(CARD.limits.length, 3);
  assert.ok(CARD.limits[0].includes("no tool for laying out a page"));
  assert.ok(CARD.limits[1].includes("A page is not built from cards"));
  assert.ok(CARD.limits[2].includes("does not stand inside a card"));

  const heading = TYPE[CARD.type.heading];
  const words = TYPE[CARD.type.words];

  assert.ok(words.sizePhone <= heading.sizePhone);
  assert.ok(words.sizeLaptop <= heading.sizeLaptop);
  assert.ok(heading.weight > words.weight);
});

test("a card has a solid fill, a line and words on every ground: its heading and its words can be read, and under the pointer its line stands out from the ground", () => {
  const cards = Object.fromEntries(
    IDS.map((ground) => {
      const { fill, line, words } = getCard(ground);
      return [ground, [fill, line, words]];
    }),
  );

  assert.deepEqual(cards, {
    dark: [SLATE[900], SLATE[800], SLATE[400]],
    light: [WORDS_WHITE, SLATE[300], SLATE[600]],
    purple: ["#3f2c7d", "#4b3a86", "#e8e6ef"],
    blue: ["#1d80ed", "#1970d1", WORDS_INK],
    pink: ["#eb4998", "#cc4087", WORDS_INK],
    yellow: ["#ebc749", "#ccae42", WORDS_INK],
  });

  IDS.forEach((ground) => {
    const under = GROUNDS[ground];
    const strong = getWordsOn(under);
    const card = getCard(ground);

    [card.fill, card.line, card.words].forEach((color) => {
      assert.match(color, PATTERN_SOLID, ground);
    });

    assert.ok(getContrast(strong, card.fill) >= CONTRAST_WORDS, ground);
    assert.ok(getContrast(card.words, card.fill) >= CONTRAST_WORDS, ground);
    assert.equal(card.linePointer, strong, ground);
    assert.ok(getContrast(card.linePointer, under) >= CONTRAST_PARTS, ground);
    assert.notEqual(card.line, card.linePointer, ground);

    // On a ground in a brand colour the fill of a card is the quiet fill
    // of that ground.
    assert.equal(
      card.fill === getQuiet(ground),
      !GROUNDS_SOFT.includes(ground),
      ground,
    );
  });
});

test("the README shows the badge and the card of every ground, with what was measured", async () => {
  const readme = await getReadme();

  const rowsQuiet = IDS.map((ground) => {
    const quiet = getQuiet(ground);
    const words = getWordsOn(GROUNDS[ground]);

    return [getTitle(ground), `\`${quiet}\``, getShown(words, quiet)];
  });

  const rowsSoft = GROUNDS_SOFT.flatMap((ground) =>
    COLORED.map((kind) => {
      const badge = getBadge(kind, ground) as Badge & { icon: string };

      return [
        getTitle(ground),
        getTitle(kind),
        getName(badge.fill, badge.source, badge.stepFill),
        getShown(badge.words, badge.fill),
        getName(badge.icon, badge.source, badge.stepIcon),
        getShown(badge.icon, badge.fill),
        getShown(badge.icon, GROUNDS[ground]),
      ];
    }),
  );

  const rowsCard = IDS.map((ground) => {
    const under = GROUNDS[ground];
    const card = getCard(ground);

    return [
      getTitle(ground),
      `\`${card.fill}\``,
      `\`${card.line}\``,
      `\`${card.words}\``,
      getShown(getWordsOn(under), card.fill),
      getShown(card.words, card.fill),
      `\`${card.linePointer}\`, ${getShown(card.linePointer, under)}`,
    ];
  });

  [...rowsQuiet, ...rowsSoft, ...rowsCard].forEach((cells) => {
    const row = `| ${cells.join(" | ")} |`;
    assert.ok(readme.includes(row), row);
  });

  // The icon of a state on the quiet fill of the purple ground.
  const purple = COLORED.map((kind) => {
    const badge = getBadge(kind as BadgesID, "purple");
    const { icon = "", source = "pink", stepIcon } = badge;
    const shown = getShown(icon, badge.fill);

    return stepIcon === undefined
      ? `the brand's ${source} at ${shown}`
      : `${getTitle(source)} ${stepIcon} at ${shown}`;
  });

  [
    `It is ${BADGE.height} pixels high, with ${BADGE.room} pixels of room`,
    `at ${BADGE.icon} pixels`,
    `a line of ${BADGE.line} pixel in the colour of its icon`,
    `step ${BADGE.steps.deep} on the dark ground and step ${BADGE.steps.pale} on the light ground`,
    `A pale colour takes step ${BADGE.steps.palest} on the light ground`,
    `${purple[0]}, ${purple[1]} and ${purple[2]}`,
    CARD.use,
    ...CARD.limits,
    `It has ${CARD.room} pixels of room, and ${CARD.gap} pixels between its parts`,
    `an arrow of ${CARD.arrow} pixels after its heading`,
    `Its line takes ${CARD.sharesLine.white} parts of a hundred of white, or ${CARD.sharesLine.ink} of ink`,
    `its words take ${CARD.shareWords} parts of a hundred of white`,
  ].forEach((words) => {
    assert.ok(readme.includes(words), words);
  });
});
