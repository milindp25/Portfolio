import type { Metadata } from "next";
import { Timeline } from "@/components/experience/Timeline";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "8+ years of software engineering experience across Capital One, Discover Financial Services, Oracle, and more.",
  alternates: {
    canonical: "https://milindprabhakar.com/experience",
  },
};

export default function ExperiencePage() {
  return (
    <>
      <JsonLd
        data={{
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://milindprabhakar.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Experience",
              item: "https://milindprabhakar.com/experience",
            },
          ],
        }}
      />
      <section className="px-6 py-24">
        <Timeline />
      </section>
    </>
  );
}
