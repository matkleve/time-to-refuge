import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#fef6e7",
          100: "#fbe8bf",
          200: "#f7d489",
          300: "#f8bd5c",
          400: "#f5a623",
          500: "#e8930f",
          600: "#c9740a",
        },
        flagblue: {
          50: "#eaf1fd",
          400: "#4a77db",
          500: "#2456c9",
          600: "#1a41a3",
          700: "#153582",
        },
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
