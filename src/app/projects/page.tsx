import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Enterprise SaaS platforms, AI chatbots, and full-stack applications built by Milind Prabhakar.",
  alternates: {
    canonical: "https://milindprabhakar.com/projects",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://milindprabhakar.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Projects",
              item: "https://milindprabhakar.com/projects",
            },
          ],
        }}
      />
      <section className="px-6 py-24">
        <ProjectGrid />
      </section>
    </>
  );
}
