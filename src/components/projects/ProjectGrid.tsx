"use client";

import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function ProjectGrid() {
  return (
    <div className="mx-auto max-w-3xl">
      <AnimatedSection>
        <p className="mb-4 font-mono text-xs tracking-widest text-accent uppercase">
          Projects
        </p>
        <h2 className="mb-10 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          All projects
        </h2>
      </AnimatedSection>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}
