import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
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
          name: "Milind Prabhakar",
          jobTitle: "Senior Software Engineer",
          worksFor: {
            "@type": "Organization",
            name: "Capital One",
          },
          url: "https://milindprabhakar.com",
          email: "milindp25@gmail.com",
          sameAs: [
            "https://linkedin.com/in/milindprabhakar",
            "https://github.com/milindprabhakar",
          ],
          knowsAbout: [
            "Java",
            "Spring Boot",
            "React",
            "Next.js",
            "TypeScript",
            "AWS",
            "Microservices",
            "Kafka",
            "Kubernetes",
          ],
          description:
            "Full-stack engineer with 8+ years of experience building enterprise-grade systems across financial services.",
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
      <About />
      <FeaturedProjects />
      <Skills />
      <Contact />
    </>
  );
}
