import landing from "@/content/landing.json";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

/** Structured data for search — WebApplication + HowTo steps from landing copy. */
export function SeoJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript. Works offline after first visit.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
        featureList: [
          "Millisecond refuge timestamps",
          "Buddha, Dharma, Sangha phases",
          "Offline PWA for retreat wifi",
          "CSV export and shareable cards",
        ],
      },
      {
        "@type": "HowTo",
        name: "Record a refuge ceremony with Timekeeper",
        description: landing.intro,
        step: landing.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.body,
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
