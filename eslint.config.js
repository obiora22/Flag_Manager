import { defineConfig } from "eslint/config";
import tselint from "typescript-eslint";
export default defineConfig([
  {
    plugins: [tselint],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
]);
