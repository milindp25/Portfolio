import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Milind Prabhakar — Senior Software Engineer",
    short_name: "Milind P.",
    description:
      "Senior Software Engineer with 8+ years building enterprise-grade systems in financial services.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
