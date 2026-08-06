import { siteUrl } from "@/lib/site-url";

export function JsonLd({ name, description, path }: { name: string; description: string; path: string }) {
  const pageUrl = `${siteUrl}${path}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name,
        description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: pageUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "투자실험실", item: siteUrl },
          { "@type": "ListItem", position: 2, name, item: pageUrl },
        ],
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
