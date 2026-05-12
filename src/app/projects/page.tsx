import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Production AI agents, voice AI systems, enterprise SaaS platforms, and full-stack applications built by Milind Prabhakar.",
  alternates: {
    canonical: "https://milindprabhakar.com/projects",
  },
  openGraph: {
    title: "Projects by Milind Prabhakar | AI Agents, Fintech Systems",
    description:
      "Production AI agents, voice AI systems, enterprise SaaS platforms, and full-stack applications.",
    url: "https://milindprabhakar.com/projects",
  },
  twitter: {
    title: "Projects by Milind Prabhakar | AI Agents, Fintech Systems",
    description:
      "Production AI agents, voice AI systems, enterprise SaaS platforms, and full-stack applications.",
  },
};

const PROJECTS_URL = "https://milindprabhakar.com/projects";

export default function ProjectsPage() {
  const itemListElement = projects.map((project, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "CreativeWork",
      name: project.title,
      description: project.longDescription,
      url: `${PROJECTS_URL}#${project.id}`,
      keywords: project.techStack.join(", "),
      creator: { "@id": "https://milindprabhakar.com/#person" },
      creativeWorkStatus:
        project.status === "in-production"
          ? "Published"
          : project.status === "in-progress"
            ? "Draft"
            : project.status === "planned"
              ? "Planned"
              : "Published",
    },
  }));

  return (
    <>
      <JsonLd
        data={{
          "@type": "CollectionPage",
          name: "Projects by Milind Prabhakar",
          url: PROJECTS_URL,
          description:
            "Production AI agents, voice AI systems, enterprise SaaS platforms, and full-stack applications.",
          mainEntity: {
            "@type": "ItemList",
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            numberOfItems: projects.length,
            itemListElement,
          },
        }}
      />
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
              item: PROJECTS_URL,
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
