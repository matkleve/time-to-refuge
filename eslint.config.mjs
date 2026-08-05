import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import jsxA11y from "eslint-plugin-jsx-a11y";

/** Feldpost-aligned maintainability — warn until legacy giants are split. */
const maintainability = {
  "max-lines": [
    "warn",
    { max: 200, skipBlankLines: true, skipComments: true },
  ],
  "max-lines-per-function": [
    "warn",
    { max: 60, skipBlankLines: true, skipComments: true },
  ],
  complexity: ["warn", 15],
};

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...nextCoreWebVitals,
  {
    rules: {
      ...jsxA11y.configs.recommended.rules,
      ...maintainability,
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/alt-text": "error",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "error",
    },
  },
  {
    files: ["components/**/*.tsx", "app/**/*.tsx"],
    rules: {
      /* JSX-heavy shells — slightly above 60; files still capped at 200. */
      "max-lines-per-function": [
        "warn",
        { max: 100, skipBlankLines: true, skipComments: true },
      ],
      complexity: ["warn", 18],
    },
  },
  {
    files: ["scripts/**", "app/dev/**", "app/opengraph-image.tsx", "lib/card-image.ts"],
    rules: {
      "max-lines": "off",
      "max-lines-per-function": "off",
      complexity: "off",
    },
  },
];

export default eslintConfig;
