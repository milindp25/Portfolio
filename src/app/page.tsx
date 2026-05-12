import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Skills } from "@/components/home/Skills";
import { Contact } from "@/components/home/Contact";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://milindprabhakar.com",
  },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@type": "Person",
          "@id": "https://milindprabhakar.com/#person",
          name: "Milind Prabhakar",
          jobTitle: "Lead Software Engineer",
          worksFor: {
            "@type": "Organization",
            name: "Capital One",
          },
          alumniOf: [
            {
              "@type": "CollegeOrUniversity",
              name: "Illinois Institute of Technology",
            },
            {
              "@type": "CollegeOrUniversity",
              name: "BMS Institute of Technology and Management",
            },
          ],
          url: "https://milindprabhakar.com",
          image: "https://milindprabhakar.com/opengraph-image",
          email: "mailto:milindp25@gmail.com",
          sameAs: [
            "https://www.linkedin.com/in/milind-prabhakar/",
            "https://github.com/milindp25",
          ],
          knowsAbout: [
            "Java",
            "Spring Boot",
            "Apache Kafka",
            "Distributed Systems",
            "AI Agents",
            "LLM Integration",
            "Microservices",
            "Fintech",
            "Payment Systems",
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Chicago",
            addressRegion: "IL",
            addressCountry: "US",
          },
          description:
            "Lead Software Engineer with 8 years building enterprise-grade systems across financial services and AI-integrated developer tooling.",
        }}
      />
      <JsonLd
        data={{
          "@type": "WebSite",
          name: "Milind Prabhakar",
          url: "https://milindprabhakar.com",
        }}
      />
      <Hero />
      <FeaturedProjects />
      <Skills />
      <Contact />
    </>
  );
}
