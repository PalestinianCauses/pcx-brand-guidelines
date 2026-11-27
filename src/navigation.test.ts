import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import COLORS, { type GroundsID, GROUNDS } from "./colors";
import { getNumber } from "./content";
import getContrast, { CONTRAST_PARTS, getContrastShown } from "./contrast";
import MOTION from "./motion";
import NAVIGATION, { getHighlight } from "./navigation";
import { getWordsOn } from "./shades";
import SHAPE, { HEIGHT_FINGER, UNIT } from "./shape";
import TYPE from "./type";

const FILE_README = "README.md";

const IDS = Object.keys(GROUNDS) as GroundsID[];

// The stop that ends a sentence.
const PATTERN_STOP = /\.$/;

// The name of a ground in a table of the README.
const getName = function getName(id: GroundsID): string {
  const name = `${id.charAt(0).toUpperCase()}${id.slice(1)}`;
  return name;
};

test("the frame keeps the sizes, the type and the time of its parts", () => {
  const { bar, footer, menu, rules, skip } = NAVIGATION;

  assert.deepEqual(
    { bar, footer, menu, skip },
    {
      bar: { height: 76, line: 1, type: "label", room: 24, action: "default" },
      footer: {
        type: { label: "label", link: "button", words: "note" },
        height: 44,
        room: 24,
      },
      menu: {
        type: { number: "label", link: "heading", words: "note" },
        action: "lg",
        time: 400,
      },
      skip: { height: 44 },
    },
  );
  assert.equal(rules.length, 6);
});

test("every size of the frame is a value of the shape or of the motion, and a finger can press every link", () => {
  const { bar, footer, menu, skip } = NAVIGATION;

  assert.equal(bar.height, SHAPE.heightControl + SHAPE.spaces.between * 2);
  assert.equal(bar.height % UNIT, 0);
  assert.equal(bar.line, SHAPE.lines.thin);
  assert.equal(bar.room, SHAPE.spaces.inside);
  assert.equal(footer.height, SHAPE.heightControl);
  assert.equal(footer.room, SHAPE.spaces.inside);
  assert.equal(skip.height, SHAPE.heightControl);
  assert.equal(menu.time, MOTION.times.large);

  // A link of the bar is a cell as high as the bar, and every other link
  // is as high as a control.
  [bar.height, footer.height, skip.height].forEach((height) => {
    assert.ok(height >= HEIGHT_FINGER, `${height}`);
  });

  // The action of the menu is larger than the one of the bar.
  assert.ok(
    SHAPE.heightsControl[menu.action] > SHAPE.heightsControl[bar.action],
  );
  assert.ok(SHAPE.heightsControl[bar.action] <= bar.height);
});

test("a link of the bar is a small label, a link of the menu is in large capitals, and the words under it are smaller", () => {
  const { bar, footer, menu } = NAVIGATION;

  assert.equal(TYPE[bar.type].font, "mono");
  assert.equal(TYPE[bar.type].isUppercase, true);
  assert.equal(TYPE[menu.type.link].isUppercase, true);
  assert.equal(TYPE[menu.type.number].font, "mono");
  assert.ok(TYPE[menu.type.words].sizePhone < TYPE[menu.type.link].sizePhone);
  assert.ok(
    TYPE[footer.type.label].sizePhone < TYPE[footer.type.link].sizePhone,
  );

  // The number of a link has the digits of the number of a row.
  assert.equal(getNumber(1), "01");
});

test("every rule of the frame has a name and says one thing, and no two have the same name", () => {
  const names = NAVIGATION.rules.map((rule) => rule.name);

  assert.deepEqual(names, [
    "Cells.",
    "Margins.",
    "A number.",
    "Braces.",
    "A word.",
    "The end.",
  ]);
  assert.equal(new Set(names).size, names.length);

  NAVIGATION.rules.forEach((rule) => {
    assert.match(rule.name, PATTERN_STOP);
    assert.match(rule.note, PATTERN_STOP);
    assert.ok(rule.note.length > rule.name.length, rule.name);
  });
});

test("the highlight is a colour of the brand on three grounds and the colour of the words on the others, and it stands out from every ground", () => {
  const colors: Partial<Record<GroundsID, string>> = {
    dark: COLORS.blue.value,
    light: COLORS.blue.value,
    purple: COLORS.pink.value,
  };

  IDS.forEach((id) => {
    const highlight = getHighlight(id);

    assert.equal(highlight, colors[id] ?? getWordsOn(GROUNDS[id]), id);
    assert.notEqual(highlight.toLowerCase(), GROUNDS[id].toLowerCase(), id);
    assert.ok(getContrast(highlight, GROUNDS[id]) >= CONTRAST_PARTS, id);
  });
});

test("the README holds the values of the frame and its highlight on every ground, as it is measured", async () => {
  const readme = (await readFile(FILE_README, "utf8")).replace(/\s+/g, " ");
  const { bar, footer, menu, skip } = NAVIGATION;

  [
    "`src/navigation.ts` holds the frame of a page",
    `It is ${bar.height} pixels high: a control with ${SHAPE.spaces.between} pixels above and below it.`,
    `with ${bar.room} pixels of room at each side and its number before it`,
    `It opens in ${menu.time} milliseconds, the time of a large move`,
    `A link is a row ${footer.height} pixels high, in the words of a button.`,
    `it is ${skip.height} pixels high`,
    "The frame ends with the footer",
    "stands between braces, so it is not marked by its colour alone",
    "| The top bar, the menu and the footer | Available |",
  ].forEach((words) => {
    assert.ok(readme.includes(words), words);
  });

  IDS.forEach((id) => {
    const highlight = getHighlight(id);

    const row = [
      getName(id),
      `\`${highlight}\``,
      getContrastShown(getContrast(highlight, GROUNDS[id])),
    ];

    assert.ok(readme.includes(`| ${row.join(" | ")} |`), id);
  });
});
