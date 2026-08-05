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

/** ADR-0002 — engine imports only in components/ui/. */
const engineBoundary = {
  "no-restricted-imports": [
    "error",
    {
      paths: [
        {
          name: "react-aria-components",
          message:
            "Import react-aria-components only from components/ui/ (ADR-0002).",
        },
      ],
    },
  ],
};

/** ADR-0001 — forbidden native / hand-rolled overlay patterns outside ui/. */
const nativeControlPolicy = {
  "no-restricted-syntax": [
    "error",
    {
      selector: "JSXElement[openingElement.name.name='select']",
      message: "Use components/ui/Select — native <select> is forbidden (DESIGN-SYSTEM §8).",
    },
    {
      selector:
        "JSXElement[openingElement.name.name='input'][openingElement.attributes.0.name.name='type'][openingElement.attributes.0.value.value='date']",
      message: "Use components/ui/ — native date input is forbidden.",
    },
    {
      selector:
        "JSXElement[openingElement.name.name='input'][openingElement.attributes.0.name.name='type'][openingElement.attributes.0.value.value='time']",
      message: "Use components/ui/ — native time input is forbidden.",
    },
    {
      selector: "JSXAttribute[name.name='role'][value.value='menu']",
      message: "Hand-rolled role=menu — use components/ui/Menu (ADR-0001).",
    },
    {
      selector: "JSXAttribute[name.name='role'][value.value='listbox']",
      message: "Hand-rolled role=listbox — use components/ui/Select or ListBox.",
    },
  ],
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
    ignores: ["components/ui/**"],
    rules: {
      ...engineBoundary,
      ...nativeControlPolicy,
      /* JSX-heavy shells — slightly above 60; files still capped at 200. */
      "max-lines-per-function": [
        "warn",
        { max: 100, skipBlankLines: true, skipComments: true },
      ],
      complexity: ["warn", 18],
    },
  },
  {
    files: ["components/ui/**/*.tsx"],
    rules: {
      "no-restricted-imports": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXElement[openingElement.name.name='select']",
          message: "Use UiSelect — native <select> is forbidden.",
        },
      ],
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
