import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://hsw.london";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/about-eboo`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/science`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/quiz`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/book`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
