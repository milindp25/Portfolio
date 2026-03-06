"use client";

import { experiences } from "@/data/experience";
import { TimelineItem } from "./TimelineItem";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function Timeline() {
  return (
    <div className="mx-auto max-w-2xl">
      <AnimatedSection>
        <p className="mb-4 font-mono text-xs tracking-widest text-accent uppercase">
          Experience
        </p>
        <h2 className="mb-10 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Career timeline
        </h2>
      </AnimatedSection>

      <div className="relative">
        {experiences.map((exp, i) => (
          <TimelineItem key={exp.id} experience={exp} index={i} />
        ))}
      </div>
    </div>
  );
}
