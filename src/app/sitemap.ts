import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://milindprabhakar.com";
  const lastModified = new Date("2026-05-11");

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified,
    },
  ];
}
