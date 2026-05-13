/** @type {import("prettier").Config} */
module.exports = {
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: ["^@admin/(.*)$", "", "^@packages/(.*)/(.*)$"],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
  importOrderCaseSensitive: false,
};
