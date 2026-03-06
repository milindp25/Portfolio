"use client";

import { skills } from "@/data/skills";
import { Badge } from "@/components/ui/Badge";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function Skills() {
  return (
    <section className="px-6 py-4" id="skills">
      <div className="mx-auto max-w-3xl">
        <AnimatedSection>
          <p className="mb-4 font-mono text-xs tracking-widest text-accent uppercase">
            Skills
          </p>
          <h2 className="mb-10 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Tech stack
          </h2>
        </AnimatedSection>

        <div className="space-y-6">
          {skills.map((category, i) => (
            <AnimatedSection key={category.category} delay={i * 0.05}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                <h3 className="w-32 shrink-0 font-mono text-xs tracking-wide text-tertiary">
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {category.items.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
