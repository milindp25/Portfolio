"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";

const stats = [
  { value: "8+", label: "Years Experience" },
  { value: "$3M", label: "Annual Savings" },
  { value: "73%", label: "Registration Increase" },
  { value: "1M+", label: "Concurrent Users" },
];

export function About() {
  return (
    <section className="px-6 py-24" id="about">
      <div className="mx-auto max-w-2xl">
        <AnimatedSection>
          <p className="mb-4 font-mono text-xs tracking-widest text-accent uppercase">
            About
          </p>
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Building systems that scale
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="space-y-4 text-[15px] leading-[1.75] text-secondary">
            <p>
              I&apos;ve spent 8+ years building enterprise-grade systems across
              financial services — from core banking engines processing millions
              of transactions at Oracle, to modernizing secured-card platforms at
              Discover, to leading customer migration at Capital One.
            </p>
            <p>
              My sweet spot is the intersection of complex backend systems and
              polished user experiences. I&apos;ve led teams, mentored engineers,
              and shipped systems that handle 1M+ concurrent users while
              maintaining 99.994% uptime.
            </p>
            <p>
              Outside of work, I&apos;m building a multi-tenant SaaS platform
              and exploring AI/ML applications. I believe the best engineers are
              the ones who never stop building.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border sm:grid-cols-4">
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
      </div>
    </section>
  );
}
