"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="px-6 py-12" id="projects">
      <div className="mx-auto max-w-3xl">
        <AnimatedSection>
          <p className="mb-4 font-mono text-xs tracking-widest text-accent uppercase">
            Projects
          </p>
          <h2 className="mb-10 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            What I&apos;m building
          </h2>
        </AnimatedSection>

        <div className="space-y-4">
          {featured.map((project, i) => (
            <AnimatedSection key={project.id} delay={i * 0.1}>
              <Card className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-semibold text-foreground">
                    {project.title}
                  </h3>
                  <Badge
                    variant={
                      project.status === "in-progress" ? "accent" : "default"
                    }
                    className="shrink-0"
                  >
                    {project.status}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-secondary">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div className="mt-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-tertiary transition-colors hover:text-accent"
            >
              View all projects <ArrowRight size={14} />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
