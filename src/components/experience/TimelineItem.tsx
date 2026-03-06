"use client";

import type { Experience } from "@/data/experience";
import { Badge } from "@/components/ui/Badge";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

export function TimelineItem({ experience, index }: TimelineItemProps) {
  return (
    <AnimatedSection delay={index * 0.08}>
      <div className="relative pl-6 pb-10 last:pb-0">
        {/* Timeline line */}
        <div className="absolute left-[3px] top-2 bottom-0 w-px bg-border" />

        {/* Timeline dot */}
        <div className="absolute left-0 top-2 h-[7px] w-[7px] rounded-full border border-border-emphasis bg-background" />

        {/* Content */}
        <div className="rounded-lg border border-border bg-surface p-5 transition-colors duration-150 hover:border-border-emphasis">
          <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              {experience.company}
            </h3>
            <span className="font-mono text-[11px] text-tertiary">
              {experience.period}
            </span>
          </div>
          <p className="mb-0.5 text-sm text-accent">{experience.role}</p>
          <p className="mb-3 font-mono text-[11px] text-tertiary">
            {experience.location}
          </p>

          <ul className="mb-4 space-y-1">
            {experience.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 text-[13px] leading-relaxed text-secondary"
              >
                <span className="mt-[7px] h-px w-2 shrink-0 bg-border-emphasis" />
                {highlight}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5">
            {experience.techStack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
