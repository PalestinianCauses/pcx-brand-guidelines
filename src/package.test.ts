import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

import * as values from "./index";

const FILE_PACKAGE = "package.json";
const FOLDER_BUILT = "build";

test("the package builds, and it gives what the source gives", async (context) => {
  const folder = await mkdtemp(join(tmpdir(), "pcx-brand-guidelines-"));
  context.after(() => rm(folder, { recursive: true }));

  execFileSync(
    "pnpm",
    ["exec", "tsc", "--project", "tsconfig.build.json", "--outDir", folder],
    { stdio: "pipe" },
  );

  const requireBuilt = createRequire(join(folder, "index.js"));
  const built = requireBuilt(join(folder, "index.js")) as typeof values;

  assert.deepEqual(Object.keys(built).sort(), Object.keys(values).sort());
  assert.deepEqual(built.COLORS, values.COLORS);
  assert.deepEqual(built.TYPE, values.TYPE);
  assert.equal(built.getContrast("#ffffff", "#000000"), 21);

  // The types are built beside the code.
  await access(join(folder, "index.d.ts"));

  // Node code that imports, and does not require, finds every name too. The
  // built file is named as a URL, so that a folder with a # or a % in its
  // name is still found.
  const names = Object.keys(values).sort().join(", ");
  const address = pathToFileURL(join(folder, "index.js")).href;
  const code = [
    `import { ${names} } from ${JSON.stringify(address)};`,
    "process.stdout.write(COLORS.blue.value);",
  ].join("\n");

  const printed = execFileSync(
    "node",
    ["--input-type", "module", "--eval", code],
    { encoding: "utf8" },
  );

  assert.equal(printed, values.COLORS.blue.value);
});

test("the package says where its built code and its types are", async () => {
  const packageFile = JSON.parse(await readFile(FILE_PACKAGE, "utf8")) as {
    exports: Record<string, Record<string, string> | string>;
    files: string[];
    main: string;
    name: string;
    types: string;
  };

  assert.equal(packageFile.name, "@pcx-agency/brand-guidelines");
  assert.deepEqual(packageFile.files, [FOLDER_BUILT, "assets"]);
  assert.equal(packageFile.main, `./${FOLDER_BUILT}/index.js`);
  assert.equal(packageFile.types, `./${FOLDER_BUILT}/index.d.ts`);

  assert.deepEqual(packageFile.exports["."], {
    types: `./${FOLDER_BUILT}/index.d.ts`,
    default: `./${FOLDER_BUILT}/index.js`,
  });
});

test("the logo's file is among the files of the package", async () => {
  const packageFile = JSON.parse(await readFile(FILE_PACKAGE, "utf8")) as {
    files: string[];
  };

  const [folderLogo] = values.FILE_LOGO.split("/");

  assert.ok(packageFile.files.includes(folderLogo));
  await access(values.FILE_LOGO);
});

test("the package reserves all rights", async () => {
  const packageFile = JSON.parse(await readFile(FILE_PACKAGE, "utf8")) as {
    license: string;
  };

  const terms = await readFile("LICENSE", "utf8");

  assert.equal(packageFile.license, "UNLICENSED");
  assert.match(terms, /All rights reserved\./);
});
