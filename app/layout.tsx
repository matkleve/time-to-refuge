import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Literata, Source_Code_Pro, Source_Sans_3 } from "next/font/google";
import { PressBounceRegister } from "@/components/PressBounceRegister";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import {
  siteDescription,
  siteKeywords,
  siteName,
  siteTitle,
  siteUrl,
} from "@/lib/site";
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
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  keywords: siteKeywords,
  applicationName: siteName,
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
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
        <SeoJsonLd />
        {children}
        <PressBounceRegister />
        <ServiceWorkerRegister />
        <Analytics />
      </body>
    </html>
  );
}
