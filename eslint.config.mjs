// eslint.config.mjs

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    settings: {
      react: {
        version: "detect", // Automatically detect the react version
      },
    },
    rules: {
      "no-unused-vars": "warn", // Warns about unused variables
      "react/jsx-uses-react": "warn",
      "react/react-in-jsx-scope": "off", // React 17+ doesn't require React to be in scope
      "react/prop-types": "off", // Since we use TypeScript for type checking
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
