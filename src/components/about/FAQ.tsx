"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { faqItems } from "@/data/faq";

export function FAQ() {
  return (
    <section className="px-6 py-12" id="faq">
      <div className="mx-auto max-w-2xl">
        <AnimatedSection>
          <p className="mb-4 font-mono text-xs tracking-widest text-accent uppercase">
            FAQ
          </p>
          <h2 className="mb-10 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Frequently asked
          </h2>
        </AnimatedSection>

        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <AnimatedSection key={item.question} delay={i * 0.05}>
              <details className="group rounded-lg border border-border bg-surface p-5 transition-colors duration-150 hover:border-border-emphasis">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-tertiary transition-transform duration-150 group-open:rotate-45 group-open:text-accent">
                    +
                  </span>
                  <span>{item.question}</span>
                </summary>
                <p className="mt-3 text-[13px] leading-relaxed text-secondary">
                  {item.answer}
                </p>
              </details>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
