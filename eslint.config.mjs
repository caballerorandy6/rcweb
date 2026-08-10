import { defineConfig, globalIgnores } from "eslint/config";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...coreWebVitals,
  ...typescript,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "src/generated/**",
    "public/**",
  ]),
]);

export default eslintConfig;
