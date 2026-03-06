"use client";

import { Mail, Github, Linkedin } from "lucide-react";
import { personal } from "@/data/personal";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const links = [
  {
    href: `mailto:${personal.email}`,
    label: personal.email,
    icon: Mail,
    external: false,
  },
  {
    href: personal.linkedin,
    label: "LinkedIn",
    icon: Linkedin,
    external: true,
  },
  {
    href: personal.github,
    label: "GitHub",
    icon: Github,
    external: true,
  },
];

export function Contact() {
  return (
    <section className="px-6 py-14" id="contact">
      <div className="mx-auto max-w-2xl">
        <AnimatedSection>
          <p className="mb-4 font-mono text-xs tracking-widest text-accent uppercase">
            Contact
          </p>
          <h2 className="mb-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Let&apos;s connect
          </h2>
          <p className="mb-8 text-sm text-secondary">
            Open to discussing engineering challenges, collaboration
            opportunities, or just talking tech.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                className="group flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors duration-150 hover:border-border-emphasis hover:bg-elevated"
              >
                <link.icon
                  size={16}
                  className="text-tertiary transition-colors group-hover:text-accent"
                />
                <span className="font-mono text-sm text-secondary transition-colors group-hover:text-foreground">
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
