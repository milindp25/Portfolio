export interface SkillCategory {
  category: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  {
    category: "Languages",
    items: ["Java", "JavaScript", "TypeScript", "SQL", "PL/SQL", "Python", "Bash"],
  },
  {
    category: "Frontend",
    items: [
      "React",
      "Next.js",
      "Redux",
      "Tailwind CSS",
      "Module Federation",
      "Framer Motion",
      "Material-UI",
    ],
  },
  {
    category: "Backend",
    items: [
      "Spring Boot",
      "Spring Batch",
      "Spring WebFlux",
      "Node.js",
      "Express",
      "NestJS",
      "Hibernate",
    ],
  },
  {
    category: "Databases",
    items: [
      "PostgreSQL",
      "MySQL",
      "Oracle DB",
      "MongoDB",
      "DynamoDB",
      "Redis",
      "AWS Aurora",
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Helm",
      "Terraform",
      "OpenShift",
      "Jenkins",
      "GitHub Actions",
    ],
  },
  {
    category: "Messaging",
    items: ["Apache Kafka", "RabbitMQ", "Amazon SQS"],
  },
  {
    category: "Testing",
    items: [
      "JUnit",
      "Jest",
      "Playwright",
      "Cucumber",
      "Pact",
      "Gatling",
      "SonarQube",
    ],
  },
  {
    category: "Monitoring",
    items: ["Datadog", "ELK Stack", "CloudWatch", "Catchpoint"],
  },
];
