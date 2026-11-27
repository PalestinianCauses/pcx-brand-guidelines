import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import ICONS from "./icons";
import SHAPE, { UNIT } from "./shape";

const FILE_README = "README.md";

// How an address on the web starts, and the stop that ends a sentence.
const START_ADDRESS = "https://";
const PATTERN_STOP = /\.$/;

// The square that the family for normal work draws an icon on, and the
// width of its own line on that square.
const SQUARE_FAMILY = 24;
const LINE_FAMILY = 2;

test("the icons keep their families, their sizes, their line and their rules", () => {
  assert.deepEqual(ICONS, {
    families: {
      parts: {
        name: "Lucide",
        use: "Normal work: an icon in a part, such as a button.",
        address: "https://lucide.dev",
      },
      sections: {
        name: "Iconly",
        use: "A section of a page with animated icons, or with icons in three dimensions.",
        address: "https://iconly.pro",
      },
    },
    size: 16,
    sizeSmall: 14,
    line: 1.5,
    rules: [
      {
        name: "A sign.",
        note: "An icon in a part stands for what the part does. A screen reader passes it by.",
      },
      {
        name: "A name.",
        note: "A button with an icon alone has a name that a screen reader says.",
      },
      {
        name: "A line.",
        note: "The line of an icon is as thick on a small icon as on a large one.",
      },
      {
        name: "A colour.",
        note: "An icon has the colour of the words around it, or the colour of a link on its ground.",
      },
    ],
  });
});

test("the line of an icon is halfway between the two lines of the brand, and at both sizes it is thicker than the line that the family draws itself", () => {
  const { thick, thin } = SHAPE.lines;

  assert.equal(ICONS.line, (thin + thick) / 2);
  assert.ok(ICONS.line > thin);
  assert.ok(ICONS.line < thick);

  // The family's own line is a part of the size of an icon, so it is
  // thinner on the small icon than on the other.
  const [own, ownSmall] = [ICONS.size, ICONS.sizeSmall].map(
    (size) => (LINE_FAMILY * size) / SQUARE_FAMILY,
  );

  assert.ok((ownSmall ?? 0) < (own ?? 0));
  assert.ok(ICONS.line > (own ?? 0));
  assert.ok(ICONS.line > (ownSmall ?? 0));
});

test("the two families are not the same, and each has an address that is safe to open", () => {
  const families = Object.values(ICONS.families);
  const names = families.map((family) => family.name);

  assert.equal(new Set(names).size, names.length);

  families.forEach((family) => {
    assert.ok(family.address.startsWith(START_ADDRESS), family.name);
    assert.ok(PATTERN_STOP.test(family.use), family.name);
  });
});

test("an icon fits into the smallest control, and it is smaller there than in the others", () => {
  const heights = Object.values(SHAPE.heightsControl);

  assert.equal(ICONS.size % UNIT, 0);
  assert.ok(ICONS.sizeSmall < ICONS.size);
  assert.ok(ICONS.sizeSmall < Math.min(...heights));
  assert.ok(ICONS.size < SHAPE.heightControl);
});

test("every rule for an icon has a name and a note that ends with a stop", () => {
  assert.ok(ICONS.rules.length > 0);

  ICONS.rules.forEach((rule) => {
    assert.ok(PATTERN_STOP.test(rule.name), rule.name);
    assert.ok(PATTERN_STOP.test(rule.note), rule.name);
  });
});

test("the README names both families, both sizes and the line as they are, and holds every rule", async () => {
  const readme = (await readFile(FILE_README, "utf8")).replace(/\s+/g, " ");
  const { parts, sections } = ICONS.families;

  assert.ok(readme.includes(`${parts.name}, \`${parts.address}\``));
  assert.ok(readme.includes(`${sections.name}, \`${sections.address}\``));
  assert.ok(readme.includes(`${ICONS.size} pixels wide and high`));
  assert.ok(readme.includes(`${ICONS.sizeSmall} pixels wide and high`));
  assert.ok(
    readme.includes(
      `| The line of an icon | ${ICONS.line} pixels on the screen, at both sizes |`,
    ),
  );

  ICONS.rules.forEach((rule) => {
    assert.ok(readme.includes(rule.note), rule.name);
  });
});
