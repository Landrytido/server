import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import * as typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import * as reactPlugin from "eslint-plugin-react";

// Create a new instance of FlatCompat.
const compat = new FlatCompat({
  baseDirectory: path.resolve("."),
});

export default [
  {
    ignores: ["dist/", "node_modules/"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      react: reactPlugin,
    },
    rules: {
      semi: "error",
      "@typescript-eslint/member-delimiter-style": [
        "error",
        {
          multiline: {
            delimiter: "comma",
            requireLast: true,
          },
          singleline: {
            delimiter: "comma",
            requireLast: true,
          },
        },
      ],
      "jsx-a11y/label-has-associated-control": "off",
      "comma-dangle": "error",
      "func-names": "off",
      "import/extensions": "off",
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": ["error"],
      "react/jsx-filename-extension": [
        2,
        {
          extensions: [".jsx", ".tsx"],
        },
      ],
      "react/prefer-stateless-function": "off",
      "max-len": ["off"],
      "react/jsx-no-useless-fragment": ["off"],
      "react/destructuring-assignment": ["off"],
      "react/require-default-props": "off",
      "react/no-did-update-set-state": "off",
      "react/button-has-type": "off",
      "react/jsx-props-no-spreading": "off",
      "import/prefer-default-export": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "no-plusplus": "off",
      "no-continue": "off",
      "no-param-reassign": "off",
      "no-shadow": "off",
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "always"],
      "space-before-blocks": ["error", "always"],
      "keyword-spacing": [2],
      "space-in-parens": ["error", "never"],
      "@typescript-eslint/no-shadow": ["error"],
      "class-methods-use-this": "off",
      "no-useless-constructor": "off",
      "no-empty-function": "off",
      "func-style": [
        "warn",
        "declaration",
        {
          allowArrowFunctions: true,
        },
      ],
      "react/function-component-definition": [
        "warn",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
        },
      },
    },
  },
  {
    files: ["**/__tests__/*"],
    env: {
      jest: true,
    },
  },
];
