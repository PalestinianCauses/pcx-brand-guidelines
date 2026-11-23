import assert from "node:assert/strict";
import test from "node:test";

import { ESLint } from "eslint";

const RULE_NAMES = "@typescript-eslint/naming-convention";

// Names that break the rules are put together here, so that no file of this
// repository shows one.
const NAME_TALL_CAMEL = ["fetch", "Retry"].join("");
const NAME_TALL_PASCAL = ["Dashboard", "Layout"].join("");
const NAME_FIXED = ["search", "Params"].join("");

const eslint = new ESLint();

const getRules = async function getRules(
  code: string,
  file: string = "kit/sample.ts",
): Promise<string[]> {
  const [result] = await eslint.lintText(code, { filePath: file });
  const rules = result.messages.map((message) => message.ruleId || "");

  return rules;
};

test("a camel case name with a tall letter before a capital is refused", async () => {
  const rules = await getRules(`export const ${NAME_TALL_CAMEL} = 1;\n`);
  assert.ok(rules.includes(RULE_NAMES));
});

test("a Pascal Case name with a tall letter before a capital is refused", async () => {
  const rules = await getRules(`export type ${NAME_TALL_PASCAL} = string;\n`);
  assert.ok(rules.includes(RULE_NAMES));
});

test("a short-hand name is refused", async () => {
  const names = ["err", "e", "cb", "idx"];
  const results = await Promise.all(
    names.map((name) => getRules(`export const ${name} = 1;\n`)),
  );

  results.forEach((rules, index) =>
    assert.ok(rules.includes(RULE_NAMES), names[index]),
  );
});

test("names in your style pass", async () => {
  const code = [
    "export const headersMerged = 1;",
    'export const URL_BASE = "";',
    "export type LayoutDashboard = string;",
    "export const retryFetch = function retryFetch(index: number) {",
    "  return index;",
    "};",
    "",
  ].join("\n");

  assert.deepEqual(await getRules(code), []);
});

test("a name that a library fixes stays as the library writes it", async () => {
  const code = [
    "export const getRequest = function getRequest({ req }: Record<string, string>) {",
    "  return req;",
    "};",
    "",
  ].join("\n");

  assert.deepEqual(await getRules(code), []);
});

test("a page props type keeps the name that Next.JS fixes", async () => {
  const code = [
    "export type PageProps = {",
    `  ${NAME_FIXED}: Promise<Record<string, string>>;`,
    "};",
    "",
  ].join("\n");

  assert.deepEqual(await getRules(code), []);
});

test("a type property that the developer chooses is still checked", async () => {
  const code = [
    "export type Sample = {",
    `  ${NAME_TALL_CAMEL}: boolean;`,
    "};",
    "",
  ].join("\n");

  const rules = await getRules(code);
  assert.ok(rules.includes(RULE_NAMES));
});

test("types that TypeScript knows are not reported as unknown or unused", async () => {
  const code = [
    "export type Timer = NodeJS.Timeout;",
    "",
    "export type Handler = (value: string) => void;",
    "",
  ].join("\n");

  assert.deepEqual(await getRules(code), []);
});

test("a function declaration is refused", async () => {
  const rules = await getRules("export function sample() {\n  return 1;\n}\n");
  assert.ok(rules.includes("func-style"));
});

test("an interface and an enum are refused", async () => {
  const rules = await getRules(
    "export interface Shape {\n  size: number;\n}\n\nexport enum Color {\n  Red,\n}\n",
  );

  assert.ok(rules.includes("@typescript-eslint/consistent-type-definitions"));
  assert.ok(rules.includes("no-restricted-syntax"));
});

test("a loop statement, console output and a loose comparison are refused", async () => {
  const code = [
    "export const sample = function sample(items: string[]) {",
    "  for (const item of items) console.log(item);",
    "  while (items.length == 0) items.push(String(items.length));",
    "};",
    "",
  ].join("\n");

  const rules = await getRules(code);

  assert.ok(rules.includes("no-restricted-syntax"));
  assert.ok(rules.includes("no-console"));
  assert.ok(rules.includes("eqeqeq"));
});

test("the short fragment form is refused", async () => {
  const code = [
    "export const Sample = function Sample() {",
    "  return <></>;",
    "};",
    "",
  ].join("\n");

  const rules = await getRules(code, "kit/sample.tsx");
  assert.ok(rules.includes("react/jsx-fragments"));
});
