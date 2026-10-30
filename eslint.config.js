import js from "@eslint/js";
import tseslint from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import globals from "globals";
export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "storybook-static/**",
      ".tmp/**",
      "artifacts/**",
      "**/node_modules/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { "react-hooks": hooks },
    rules: hooks.configs.recommended.rules,
  },
  {
    files: ["compatibility/**/*.{ts,tsx}", "examples/**/*.{ts,tsx}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ["tests/**/*.ts", "scripts/*.test.mjs"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression > MemberExpression.callee[property.name=/^(only|skip|fixme|todo|fail)$/]",
          message:
            "Do not focus, skip, or mark verification tests as expected failures.",
        },
        {
          selector: "Property[key.name=/^(skip|todo|only)$/]",
          message: "Do not disable verification through test options.",
        },
      ],
    },
  },
  {
    files: ["tests/**/*.spec.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@playwright/test",
              importNames: ["test"],
              message:
                "Import test from ./fixtures so browser errors always fail verification.",
            },
          ],
        },
      ],
    },
  },
);
