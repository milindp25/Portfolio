import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Milind Prabhakar | Lead Software Engineer",
    short_name: "Milind P.",
    description:
      "Lead Software Engineer with 8 years building fintech systems and AI-integrated developer tooling.",
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
