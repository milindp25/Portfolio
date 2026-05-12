"use client";

import { experiences } from "@/data/experience";
import { TimelineItem } from "./TimelineItem";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const stats = [
  { value: "8", label: "Years Experience" },
  { value: "$65M", label: "Annual Savings" },
  { value: "73%", label: "Registration Lift" },
  { value: "10M", label: "Customers Migrated" },
];

export function Timeline() {
  return (
    <div className="mx-auto max-w-2xl">
      <AnimatedSection>
        <p className="mb-4 font-mono text-xs tracking-widest text-accent uppercase">
          About
        </p>
        <h1 className="mb-10 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Who is Milind Prabhakar?
        </h1>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="space-y-4 text-[15px] leading-[1.75] text-secondary">
          <p>
            I&apos;ve spent 8 years building enterprise-grade systems across
            financial services. Core banking engines processing 1,000 TPS at
            Oracle. Modernizing secured-card platforms at Discover. Leading a
            10M customer migration at Capital One. Building AI agents in
            regulated CI/CD pipelines.
          </p>
          <p>
            My sweet spot is the intersection of distributed systems, payment
            platforms, and applied AI. I&apos;ve led teams, mentored
            engineers, and shipped systems handling 1,000 TPS at 99.994%
            uptime.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <div className="mt-12 mb-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface px-4 py-5 text-center"
            >
              <p className="font-mono text-xl font-semibold text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] tracking-wide text-tertiary">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <div className="relative">
        {experiences.map((exp, i) => (
          <TimelineItem key={exp.id} experience={exp} index={i} />
        ))}
      </div>
    </div>
  );
}
