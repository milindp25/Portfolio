import type { Metadata } from "next";
import { Timeline } from "@/components/experience/Timeline";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "8+ years of software engineering experience across Capital One, Discover Financial Services, Oracle, and more.",
};

export default function ExperiencePage() {
  return (
    <section className="px-6 py-24">
      <Timeline />
    </section>
  );
}
