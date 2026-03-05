export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  techStack: string[];
}

export const experiences: Experience[] = [
  {
    id: "capital-one",
    company: "Capital One",
    role: "Senior Software Engineer",
    period: "May 2025 – Present",
    location: "Riverwoods, IL",
    highlights: [
      "Migrating secured-card customers from Discover to Capital One post-acquisition",
      "Managing customer graduation workflows and transition logic across business models",
      "Setting up multi-region database failover with Helm configs and hardware provisioning",
      "Maintaining 90%+ code coverage with Pact contract testing and Playwright acceptance tests",
      "Designing blue-green and canary deployment strategies for zero-downtime releases",
    ],
    techStack: [
      "Java",
      "Spring Boot",
      "React",
      "TypeScript",
      "AWS Aurora",
      "Kubernetes",
      "Helm",
      "Datadog",
      "Terraform",
    ],
  },
  {
    id: "discover-engineer",
    company: "Discover Financial Services",
    role: "Application Engineer",
    period: "Jul 2024 – Dec 2025",
    location: "Chicago, IL",
    highlights: [
      "Architected real-time ACH refund system with Spring Boot, Kafka, and AWS Fargate — saving $3M annually",
      "Reduced latency 15% through F5 GTM routing and OpenShift ingress optimizations",
      "Discovered Calico network policy misconfiguration affecting multiple teams — first to identify and report",
      "Mentored team of 4 engineers, improving Agile velocity and reducing cycle time by 30%",
      "Conducted PR reviews for 5-10 developers, enforcing coding standards",
    ],
    techStack: [
      "Spring Boot",
      "Kafka",
      "PostgreSQL",
      "AWS Fargate",
      "OpenShift",
      "Terraform",
      "ELK Stack",
      "Datadog",
    ],
  },
  {
    id: "discover-senior-associate",
    company: "Discover Financial Services",
    role: "Senior Associate Application Engineer",
    period: "Sep 2023 – Jul 2024",
    location: "Chicago, IL",
    highlights: [
      "Built secured-card graduation dashboard reducing call center volume by 60% and graduation time by 48%",
      "Modernized legacy WebSphere to React MFEs — boosted registrations by 73% and activations by 64%",
      "Implemented micro-frontends with Webpack 5 Module Federation for seamless user experiences",
      "Ran 50/50 A/B testing between legacy and modern stack over 2-3 months before full cutover",
      "Achieved 99.994% uptime with Catchpoint synthetic monitoring and blue-green deployments",
    ],
    techStack: [
      "React",
      "TypeScript",
      "Spring Boot",
      "Node.js",
      "Module Federation",
      "AWS Aurora",
      "Kubernetes",
      "Catchpoint",
    ],
  },
  {
    id: "agilant",
    company: "Agilant Solutions, Inc.",
    role: "Full Stack Developer Intern",
    period: "Aug 2023 – Sep 2023",
    location: "Lisle, IL",
    highlights: [
      "Integrated in-house technology order gateway for Walmart's B2B software",
      "Built frontend with React/TypeScript, meticulously replicating Figma designs",
      "Implemented chatbot interface for service activation/installation assistance",
    ],
    techStack: ["React", "TypeScript", "PHP"],
  },
  {
    id: "iit-ta",
    company: "Illinois Institute of Technology",
    role: "Graduate Teaching Assistant",
    period: "Aug 2022 – May 2023",
    location: "Chicago, IL",
    highlights: [
      "CS 425 — Database Organization (Jan–May 2023)",
      "CS 442 — Mobile Application Development (Aug–Dec 2022)",
    ],
    techStack: ["SQL", "Mobile Development", "Teaching"],
  },
  {
    id: "ey",
    company: "EY LLP",
    role: "Software Engineer Intern",
    period: "Jun 2022 – Aug 2022",
    location: "Chicago, IL",
    highlights: [
      "Developed cloud-based microservices for food delivery platform using Spring Boot and Docker",
      "Implemented MFA for enhanced system security",
      "Async messaging with RabbitMQ and Kafka — 60% better scalability and fault tolerance",
    ],
    techStack: [
      "Spring Boot",
      "Docker",
      "Kubernetes",
      "Kafka",
      "RabbitMQ",
    ],
  },
  {
    id: "oracle",
    company: "Oracle Financial Services Software",
    role: "Associate → Staff Consultant",
    period: "Sep 2018 – Jul 2021",
    location: "Bengaluru, India",
    highlights: [
      "Built core banking processing engines handling millions of transactions/day for 1M+ concurrent users",
      "Developed distributed nightly batch frameworks for interest accruals, maturity payouts, and settlements",
      "Optimized concurrency and SQL queries reducing batch runtime by 30%",
      "Executed large-scale Oracle 19c migrations with zero data loss across hundreds of millions of records",
      "Built reusable bulk file ingestion framework processing 20K-30K+ customers daily",
    ],
    techStack: [
      "Java",
      "Spring Boot",
      "Spring Batch",
      "PL/SQL",
      "Oracle 19c",
      "Oracle WebLogic",
      "Jenkins",
    ],
  },
  {
    id: "just-think",
    company: "Just Think Technologies",
    role: "Software Developer",
    period: "Feb 2016 – Aug 2018",
    location: "Bengaluru, India",
    highlights: [
      "Designed responsive e-commerce applications with React.js, Redux, and Axios",
      "Built REST APIs with Spring Boot — enabled 50% faster order processing",
      "Implemented caching and load balancing with Nginx and AWS ELB — cut API response times by 45%",
    ],
    techStack: [
      "React",
      "Redux",
      "Spring Boot",
      "MongoDB",
      "Nginx",
      "AWS",
    ],
  },
];
