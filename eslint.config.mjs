import { defineConfig, globalIgnores } from "eslint/config";

import rulesBase from "./kit/eslint-base.mjs";

const eslintConfig = defineConfig([
  ...rulesBase,
  { settings: { react: { version: "19" } } },
  globalIgnores(["build/**", "coverage/**"]),
]);

export default eslintConfig;
