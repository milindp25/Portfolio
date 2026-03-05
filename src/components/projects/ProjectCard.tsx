"use client";

import type { Project } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <AnimatedSection delay={index * 0.1}>
      <Card className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold text-foreground">
            {project.title}
          </h3>
          <Badge
            variant={project.status === "in-progress" ? "accent" : "default"}
            className="shrink-0"
          >
            {project.status}
          </Badge>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-secondary">
          {project.longDescription}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </Card>
    </AnimatedSection>
  );
}
