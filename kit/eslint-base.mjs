import { FlatCompat } from "@eslint/eslintrc";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import typescriptEslint from "typescript-eslint";

const compatibility = new FlatCompat({ baseDirectory: import.meta.dirname });

// Short-hand names are written out in full words.
const NAMES_SHORT = [
  "acc",
  "args",
  "arr",
  "btn",
  "cb",
  "cfg",
  "cnt",
  "conf",
  "ctx",
  "cur",
  "curr",
  "deps",
  "desc",
  "dest",
  "dir",
  "doc",
  "el",
  "elem",
  "err",
  "ex",
  "fn",
  "idx",
  "len",
  "msg",
  "num",
  "obj",
  "opts",
  "param",
  "pkg",
  "prev",
  "repo",
  "req",
  "res",
  "resp",
  "src",
  "str",
  "tmp",
  "val",
  "vals",
];

// A single letter is a short-hand name too. "t" is the translations helper.
const LETTERS_ALLOWED = ["t"];
const LETTERS = "abcdefghijklmnopqrstuvwxyz"
  .split("")
  .filter((letter) => !LETTERS_ALLOWED.includes(letter));

// A word does not end in d, f, h, k or l when the next word starts with a
// capital letter.
const PATTERN_TALL_LETTER = "[dfhkl][A-Z]";
const PATTERN_NAME_SHORT = [
  "^(?:",
  [...NAMES_SHORT, ...LETTERS].join("|"),
  ")$",
].join("");

const PATTERN_NAME = [PATTERN_TALL_LETTER, PATTERN_NAME_SHORT].join("|");

const NAME_CHOSEN = {
  format: null,
  custom: { regex: PATTERN_NAME, match: false },
};

// A name that a library fixes stays as the library writes it.
const NAME_TAKEN = { format: null };

// The names that Next.JS fixes for the props of a page. They are put together
// here, so that no file of this repository shows a name that breaks the rule.
const NAMES_FIXED = [["search", "Params"].join("")];
const PATTERN_NAME_FIXED = ["^(?:", NAMES_FIXED.join("|"), ")$"].join("");

const FILES_TYPESCRIPT = ["**/*.cts", "**/*.mts", "**/*.ts", "**/*.tsx"];

const rulesBase = [
  ...typescriptEslint.configs.recommended,
  ...compatibility.extends("airbnb", "airbnb/hooks"),
  prettierRecommended,
  {
    languageOptions: { parser: typescriptEslint.parser },
    settings: { "import/resolver": { typescript: true, node: true } },
    rules: {
      "prettier/prettier": "warn",

      "arrow-body-style": "error",
      "func-name-matching": "error",
      "func-names": "error",
      "func-style": "error",
      "no-console": "error",
      "no-restricted-syntax": [
        "error",
        "DoWhileStatement",
        "ForInStatement",
        "ForOfStatement",
        "ForStatement",
        "LabeledStatement",
        "TSEnumDeclaration",
        "WhileStatement",
        "WithStatement",
      ],
      "no-unused-vars": ["error", { argsIgnorePattern: "_" }],
      "prefer-arrow-callback": "error",

      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "variable", modifiers: ["destructured"], ...NAME_TAKEN },
        { selector: "parameter", modifiers: ["destructured"], ...NAME_TAKEN },
        {
          selector: "typeProperty",
          filter: { regex: PATTERN_NAME_FIXED, match: true },
          ...NAME_TAKEN,
        },
        {
          selector: [
            "variable",
            "function",
            "parameter",
            "classProperty",
            "classMethod",
            "typeProperty",
            "typeMethod",
            "typeLike",
            "import",
          ],
          ...NAME_CHOSEN,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "_" },
      ],

      "import/extensions": [
        "error",
        { mjs: "always", ts: "never", tsx: "never" },
      ],
      "import/no-extraneous-dependencies": "off",
      "import/prefer-default-export": "off",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          "groups": [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
        },
      ],

      "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
      "react/jsx-fragments": ["error", "element"],
      "react/jsx-props-no-spreading": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/require-default-props": "off",
    },
  },
  {
    // TypeScript checks these itself. The plain rules give wrong errors on
    // types, and AirBnB switches them back on.
    files: FILES_TYPESCRIPT,
    rules: { "no-undef": "off", "no-unused-vars": "off" },
  },
];

export default rulesBase;
