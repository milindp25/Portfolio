import { Github, Linkedin, Mail } from "lucide-react";
import { personal } from "@/data/personal";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-6 md:flex-row md:justify-between">
        <p className="font-mono text-[11px] text-tertiary">
          &copy; {new Date().getFullYear()} {personal.name}
        </p>

        <div className="flex items-center gap-4">
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-tertiary transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Github size={15} />
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-tertiary transition-colors hover:text-foreground"
            aria-label="LinkedIn"
          >
            <Linkedin size={15} />
          </a>
          <a
            href={`mailto:${personal.email}`}
            className="text-tertiary transition-colors hover:text-foreground"
            aria-label="Email"
          >
            <Mail size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}
