import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { getNumber, POINTS, ROWS, SEPARATOR } from "./content";
import SHAPE, { UNIT } from "./shape";
import TYPE from "./type";

const FILE_README = "README.md";

const PATTERN_SPACES = /\s+/g;

test("a sheet of points keeps its values: thin lines between its cells only, and the room inside a block", () => {
  assert.deepEqual(POINTS.type, { title: "sub-heading", words: "body" });
  assert.equal(POINTS.room, SHAPE.spaces.inside);
  assert.equal(POINTS.gap, 8);
  assert.equal(POINTS.line, SHAPE.lines.thin);
  assert.equal(POINTS.lines, "between");
});

test("a numbered row keeps its values: a number of two digits in the mono font, in a column of its own, and a thin line above every row", () => {
  assert.deepEqual(ROWS.type, {
    number: "label",
    title: "sub-heading",
    words: "body",
  });
  assert.equal(ROWS.digits, 2);
  assert.equal(ROWS.room, SHAPE.spaces.inside);
  assert.equal(ROWS.gap, 24);
  assert.equal(ROWS.gapWords, 8);
  assert.equal(ROWS.line, SHAPE.lines.thin);
  assert.equal(ROWS.place, "beside");
  assert.equal(TYPE[ROWS.type.number].font, "mono");

  assert.deepEqual([1, 2, 9, 10, 12, 100].map(getNumber), [
    "01",
    "02",
    "09",
    "10",
    "12",
    "100",
  ]);
});

test("the words of a point and of a row are never larger than the title, and every room is a step of the unit", () => {
  [POINTS.type, ROWS.type].forEach((steps) => {
    const title = TYPE[steps.title];
    const words = TYPE[steps.words];

    assert.ok(words.sizePhone <= title.sizePhone);
    assert.ok(words.sizeLaptop <= title.sizeLaptop);
    assert.ok(title.weight > words.weight);
  });

  [POINTS.room, POINTS.gap, ROWS.room, ROWS.gap, ROWS.gapWords].forEach(
    (room) => {
      assert.equal(room % UNIT, 0, String(room));
    },
  );
});

test("a separator is a thin line, and it is decoration", () => {
  assert.deepEqual(SEPARATOR, { line: SHAPE.lines.thin, isDecoration: true });
});

test("the README holds the values of the three parts, and says that they are no cards", async () => {
  const readme = (await readFile(FILE_README, "utf8")).replace(
    PATTERN_SPACES,
    " ",
  );

  [
    `A cell has ${POINTS.room} pixels of room`,
    "The lines run between the cells only",
    `Its number has ${ROWS.digits} digits, as in ${getNumber(1)}`,
    "The number stands in a column of its own, beside the title",
    `${ROWS.room} pixels of room above it and under it`,
    `${ROWS.gap} pixels between its number and its title`,
    "A screen reader skips it, unless a project says that it carries meaning",
    "None of them is pressed, and none has a fill",
    "They add no colour",
  ].forEach((words) => {
    assert.ok(readme.includes(words), words);
  });
});
