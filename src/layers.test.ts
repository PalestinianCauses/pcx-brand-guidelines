import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { getQuiet } from "./badge";
import getBlend from "./blend";
import { getCard } from "./card";
import { type GroundsID, GROUNDS } from "./colors";
import getContrast, {
  CONTRAST_PARTS,
  CONTRAST_WORDS,
  getContrastShown,
} from "./contrast";
import LAYERS, { getLayer, getVeiled } from "./layers";
import MOTION from "./motion";
import { getWordsOn } from "./shades";
import SHAPE, { HEIGHT_FINGER, UNIT } from "./shape";
import TYPE from "./type";

const FILE_README = "README.md";

const IDS = Object.keys(GROUNDS) as GroundsID[];

// The name of a ground in a table of the README.
const getName = function getName(id: GroundsID): string {
  const name = `${id.charAt(0).toUpperCase()}${id.slice(1)}`;
  return name;
};

test("the layers keep their veil, their type, their sizes and their time", () => {
  assert.deepEqual(LAYERS, {
    veil: { color: "#000000", share: 10, blur: 4 },
    type: { title: "sub-heading", words: "body" },
    room: 24,
    line: 1,
    widths: { dialog: 480, panel: 384 },
    item: { height: 44, mark: 2 },
    time: 200,
    distance: 8,
  });
});

test("the sizes and the time of a layer are those of the shape and of the motion, and an item of a menu is as high as a finger needs", () => {
  assert.equal(LAYERS.veil.blur % UNIT, 0);
  assert.equal(LAYERS.room, SHAPE.spaces.inside);
  assert.equal(LAYERS.line, SHAPE.lines.thin);
  assert.equal(LAYERS.item.height, SHAPE.heightControl);
  assert.equal(LAYERS.item.mark, SHAPE.lines.thick);
  assert.equal(LAYERS.time, MOTION.times.medium);
  assert.equal(LAYERS.distance, MOTION.distance);

  assert.ok(LAYERS.item.height >= HEIGHT_FINGER);
  assert.ok(LAYERS.widths.panel <= LAYERS.widths.dialog);
  assert.equal(LAYERS.widths.dialog % UNIT, 0);
  assert.equal(LAYERS.widths.panel % UNIT, 0);

  // The words of a layer are never larger than its title.
  const title = TYPE[LAYERS.type.title];
  const words = TYPE[LAYERS.type.words];

  assert.ok(words.sizePhone <= title.sizePhone);
  assert.ok(words.sizeLaptop <= title.sizeLaptop);
});

test("a layer has the fill, the line and the words of a card on every ground, and its words can be read on its fill", () => {
  IDS.forEach((id) => {
    const layer = getLayer(id);
    const card = getCard(id);
    const strong = getWordsOn(GROUNDS[id]);

    assert.deepEqual(
      [layer.fill, layer.line, layer.words],
      [card.fill, card.line, card.words],
      id,
    );
    assert.equal(layer.title, strong, id);

    assert.ok(getContrast(layer.title, layer.fill) >= CONTRAST_WORDS, id);
    assert.ok(getContrast(layer.words, layer.fill) >= CONTRAST_WORDS, id);
  });
});

test("the item of a menu that the keyboard is on can be read, its line stands out from its fill, and on a ground in a brand colour only that line shows it", () => {
  const same = IDS.filter((id) => {
    const layer = getLayer(id);

    assert.equal(layer.itemFill, getQuiet(id), id);
    assert.equal(layer.itemWords, getWordsOn(GROUNDS[id]), id);
    assert.equal(layer.itemMark, layer.itemWords, id);

    assert.ok(
      getContrast(layer.itemWords, layer.itemFill) >= CONTRAST_WORDS,
      id,
    );
    assert.ok(
      getContrast(layer.itemMark, layer.itemFill) >= CONTRAST_PARTS,
      id,
    );

    return layer.itemFill.toLowerCase() === layer.fill.toLowerCase();
  });

  assert.deepEqual(same, ["purple", "blue", "pink", "yellow"]);
});

test("the veil is black at its share, and it makes every ground a little darker", () => {
  const { color, share } = LAYERS.veil;

  IDS.forEach((id) => {
    assert.equal(getVeiled(id), getBlend(GROUNDS[id], color, share), id);
  });

  // Every ground changes under the veil, and none gets lighter.
  IDS.forEach((id) => {
    assert.notEqual(getVeiled(id).toLowerCase(), GROUNDS[id].toLowerCase());
    assert.ok(
      getContrast(getVeiled(id), "#ffffff") >
        getContrast(GROUNDS[id], "#ffffff"),
      id,
    );
  });

  // The veil is light: under it a ground is still nearer to itself than
  // to the colour of the veil.
  assert.ok(share < 50);
});

test("the README holds the values of a layer and its colours on every ground, as they are measured", async () => {
  const readme = (await readFile(FILE_README, "utf8")).replace(/\s+/g, " ");
  const { item, room, time, veil, widths } = LAYERS;

  [
    "`src/layers.ts` holds the layers",
    `black at ${veil.share} parts of a hundred, with a soft blur of ${veil.blur} pixels where a browser can draw one`,
    `A dialog and a side panel have ${room} pixels of room. A dialog is at most ${widths.dialog} pixels wide, and a side panel at most ${widths.panel}.`,
    `An item of a menu is ${item.height} pixels high`,
    `a line of ${item.mark} pixels at its start`,
    `A layer opens and closes in ${time} milliseconds`,
    "| The layers | Available |",
  ].forEach((words) => {
    assert.ok(readme.includes(words), words);
  });

  IDS.forEach((id) => {
    const layer = getLayer(id);

    const row = [
      getName(id),
      `\`${layer.fill}\``,
      `\`${layer.line}\``,
      `\`${layer.words}\``,
      getContrastShown(getContrast(layer.title, layer.fill)),
      getContrastShown(getContrast(layer.words, layer.fill)),
      `\`${layer.itemFill}\``,
      getContrastShown(getContrast(layer.itemWords, layer.itemFill)),
      `\`${getVeiled(id)}\``,
    ];

    assert.ok(readme.includes(`| ${row.join(" | ")} |`), id);
  });
});
