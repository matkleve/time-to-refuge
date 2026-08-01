import type { Metadata, Viewport } from "next";
import { Literata, Source_Code_Pro, Source_Sans_3 } from "next/font/google";
import { PressBounceRegister } from "@/components/PressBounceRegister";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

/* Quiet book — Literata · Source Sans 3 · Source Code Pro (dev/fonts option B). */

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Time to Refuge",
  description:
    "Record the exact moment each person takes refuge in the Buddha, the Dharma and the Sangha.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Timekeeper",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: "/logo.png",
  },
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
     * declared in @theme (i.e. on :root); if the next/font variable is only
     * defined further down on <body>, the var() at :root is undefined, the
     * whole custom property goes guaranteed-invalid, and every font-family
     * silently falls back to the system stack.
     */
    <html
      lang="en"
      className={`${literata.variable} ${sourceSans.variable} ${sourceCode.variable}`}
    >
      <body>
        {children}
        <PressBounceRegister />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
