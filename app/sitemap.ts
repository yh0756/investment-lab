import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/calculators",
    "/calculators/leverage-etf",
    "/calculators/dividend-growth",
    "/calculators/loss-recovery",
    "/calculators/portfolio-rebalancing",
    "/calculators/goal-asset",
    "/calculators/share-buyback",
    "/guides",
    "/about",
    "/terms",
    "/privacy",
    "/contact",
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/calculators/") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/calculators/") ? 0.8 : 0.5,
  }));
}
