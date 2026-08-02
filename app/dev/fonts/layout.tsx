import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Mono,
  DM_Sans,
  Fraunces,
  IBM_Plex_Mono,
  JetBrains_Mono,
  Karla,
  Literata,
  Manrope,
  Newsreader,
  Outfit,
  Source_Code_Pro,
  Source_Sans_3,
  Source_Serif_4,
} from "next/font/google";

export const metadata: Metadata = {
  title: "Font picker · Timekeeper",
  robots: { index: false, follow: false },
};

/* Each option is a full trio: display · sans · mono — matching the three jobs
   in the design system (names / UI / times). Loaded here so the picker page
   can swap CSS variables without a network round-trip. */

const newsreader = Newsreader({ subsets: ["latin"], variable: "--pick-a-display" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--pick-a-sans" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--pick-a-mono" });

const literata = Literata({ subsets: ["latin"], variable: "--pick-b-display" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--pick-b-sans" });
const sourceCode = Source_Code_Pro({ subsets: ["latin"], variable: "--pick-b-mono" });

const fraunces = Fraunces({ subsets: ["latin"], variable: "--pick-c-display" });
const outfit = Outfit({ subsets: ["latin"], variable: "--pick-c-sans" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--pick-c-mono",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--pick-d-display",
});
const karla = Karla({ subsets: ["latin"], variable: "--pick-d-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--pick-d-mono" });

const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--pick-e-display" });
const manrope = Manrope({ subsets: ["latin"], variable: "--pick-e-sans" });

const fontVars = [
  newsreader.variable,
  dmSans.variable,
  dmMono.variable,
  literata.variable,
  sourceSans.variable,
  sourceCode.variable,
  fraunces.variable,
  outfit.variable,
  plexMono.variable,
  cormorant.variable,
  karla.variable,
  jetbrains.variable,
  sourceSerif.variable,
  manrope.variable,
].join(" ");

export default function DevFontsLayout({ children }: { children: React.ReactNode }) {
  return <div className={fontVars}>{children}</div>;
}
