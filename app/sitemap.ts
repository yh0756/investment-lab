import type { MetadataRoute } from "next";
import { calculators } from "@/lib/calculator-catalog";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/calculators",
    ...calculators.map((calculator) => calculator.href),
    "/guides",
    ...calculators.map((calculator) => calculator.guideHref),
    "/about",
    "/terms",
    "/privacy",
    "/contact",
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/calculators/") || path.startsWith("/guides/") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/calculators/") ? 0.8 : path.startsWith("/guides/") ? 0.7 : 0.5,
  }));
}
