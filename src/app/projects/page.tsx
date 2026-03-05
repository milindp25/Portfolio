import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Enterprise SaaS platforms, AI chatbots, and full-stack applications built by Milind Prabhakar.",
};

export default function ProjectsPage() {
  return (
    <section className="px-6 py-24">
      <ProjectGrid />
    </section>
  );
}
