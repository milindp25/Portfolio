import type { Metadata } from "next";
import { Timeline } from "@/components/experience/Timeline";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "About",
  description:
    "8 years of software engineering experience across Capital One, Discover Financial Services, and Oracle Financial Services. Building distributed systems, payment platforms, and AI-integrated tooling in fintech.",
  alternates: {
    canonical: "https://milindprabhakar.com/about",
  },
  openGraph: {
    title: "About Milind Prabhakar | 8 Years in Fintech & AI",
    description:
      "8 years of software engineering experience across Capital One, Discover Financial Services, and Oracle Financial Services.",
    url: "https://milindprabhakar.com/about",
  },
  twitter: {
    title: "About Milind Prabhakar | 8 Years in Fintech & AI",
    description:
      "8 years of software engineering experience across Capital One, Discover Financial Services, and Oracle Financial Services.",
  },
};

export default function AboutPage() {
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
              name: "About",
              item: "https://milindprabhakar.com/about",
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
