import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import jsxA11y from "eslint-plugin-jsx-a11y";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...nextCoreWebVitals,
  {
    rules: {
      ...jsxA11y.configs.recommended.rules,
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/alt-text": "error",
      // React Compiler hint (pulled in transitively at "error"). Hydrating
      // client-only state (localStorage) and resetting per-person state when
      // the visible card changes are legitimate effect-driven syncs, so keep
      // this as a warning rather than a build-breaking error.
      "react-hooks/set-state-in-effect": "warn",
      // Latest action/id are mirrored into refs in effects or via stable useId —
      // never assign ref.current during render.
      "react-hooks/refs": "error",
    },
  },
];

export default eslintConfig;
