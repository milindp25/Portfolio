import type { Metadata } from "next";
import { Timeline } from "@/components/experience/Timeline";
import { FAQ } from "@/components/about/FAQ";
import { faqItems } from "@/data/faq";
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
          "@type": "ProfilePage",
          name: "About Milind Prabhakar",
          url: "https://milindprabhakar.com/about",
          mainEntity: {
            "@type": "Person",
            "@id": "https://milindprabhakar.com/#person",
            name: "Milind Prabhakar",
            jobTitle: "Lead Software Engineer",
            url: "https://milindprabhakar.com",
            description:
              "Milind Prabhakar is a Lead Software Engineer based in Chicago, IL, currently at Capital One, where he leads distributed systems and AI infrastructure work, including the migration of 10 million customers from Discover Financial Services onto Capital One platforms. With 8 years in fintech across Capital One, Discover, and Oracle Financial Services, he specializes in high-throughput payment pipelines (Kafka, Spring Boot, 1,000 TPS), AI agent integration, and multi-region failover architecture. At Discover, he designed an ACH refund processing pipeline that generates $65M in annual savings.",
            sameAs: [
              "https://github.com/milindp25",
              "https://www.linkedin.com/in/milind-prabhakar/",
            ],
          },
        }}
      />
      <JsonLd
        data={{
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />
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
      <FAQ />
    </>
  );
}
