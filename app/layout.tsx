import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Time to Refuge",
  description:
    "Record the exact moment each person takes refuge in the Buddha, the Dharma and the Sangha.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
     * The font variables must sit on <html>, not <body>. `--font-sans` is
     * declared in @theme (i.e. on :root); if `--font-dm-sans` is only defined
     * further down on <body>, the var() at :root is undefined, the whole
     * custom property goes guaranteed-invalid, and every font-family silently
     * falls back to the system stack.
     */
    <html
      lang="en"
      className={`${newsreader.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
