export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  featured: boolean;
  status: "completed" | "in-progress" | "planned" | "in-production";
}

export const projects: Project[] = [
  {
    id: "spicy-desi-voice-ai",
    title: "Spicy Desi Voice AI Agent",
    description:
      "Voice AI agent handling inbound calls end to end for a real food truck business, with confidence-based escalation to a human.",
    longDescription:
      "Voice AI agent handling inbound calls end to end for a real food truck business (Spicy Desi Chicago). Covers menu, hours, catering, and order status with confidence-based escalation to a human when the caller isn't satisfied. Built with Twilio telephony, LLM routing, and human-in-the-loop fallback. Production system serving real customers, not a prototype.",
    techStack: [
      "Twilio",
      "Claude API",
      "Node.js",
      "LLM Agents",
      "Voice AI",
      "Webhooks",
    ],
    featured: true,
    status: "in-production",
  },
  {
    id: "ai-cicd-agents",
    title: "AI Agents in Regulated CI/CD Pipeline",
    description:
      "AI agents in Capital One's universal CI/CD pipeline for automated PR review and vulnerability remediation on Java/Spring Boot apps.",
    longDescription:
      "Built AI agents into Capital One's universal CI/CD pipeline for automated PR review and vulnerability remediation on Java/Spring Boot apps. Scoped repository access, human-approval gates, and governance controls built for regulated banking environments. Brings AI-assisted SDLC into production at scale.",
    techStack: [
      "LLM Agents",
      "Java",
      "Spring Boot",
      "CI/CD",
      "Governance",
      "OpenShift",
    ],
    featured: true,
    status: "in-production",
  },
  {
    id: "career-ops",
    title: "career-ops: AI-Powered Job Search Pipeline",
    description:
      "Claude Code-based job search system with GPT-4o-mini LLM-as-judge resume scoring, scraper layer, API, and React dashboard.",
    longDescription:
      "Claude Code-based job search system with GPT-4o-mini LLM-as-judge resume scoring, Python scraper layer, Node.js/TypeScript API, React dashboard, and SQLite storage. Scrapes job postings, evaluates fit against resume, and surfaces high-match roles automatically.",
    techStack: [
      "Python",
      "TypeScript",
      "Node.js",
      "React",
      "SQLite",
      "GPT-4o-mini",
      "LLM-as-Judge",
    ],
    featured: true,
    status: "completed",
  },
  {
    id: "rag-pipeline",
    title: "RAG Pipeline Implementation",
    description:
      "Python RAG pipeline for Turing challenges analyzing vacation rental listings and reviews.",
    longDescription:
      "Built a Retrieval-Augmented Generation pipeline for analyzing Airbnb-like vacation rental data. Completed 7 data analysis tasks with scoring, demonstrating proficiency in embedding generation, vector search, and LLM-powered analysis.",
    techStack: ["Python", "LangChain", "Vector DB"],
    featured: false,
    status: "completed",
  },
  {
    id: "portfolio-chatbot",
    title: "Portfolio + AI Chatbot",
    description:
      "Personal portfolio with RAG-based chatbot that answers questions about me using vector search and Claude API.",
    longDescription:
      "Next.js portfolio with an AI assistant powered by RAG (Retrieval-Augmented Generation). Questions are embedded, matched against a knowledge base via pgvector similarity search, and answered by Claude. Includes a feedback learning loop where unanswered questions get flagged for admin review and can be added back to the knowledge base.",
    techStack: [
      "Next.js",
      "Tailwind CSS",
      "Supabase",
      "pgvector",
      "Claude API",
      "Framer Motion",
    ],
    featured: false,
    status: "completed",
  },
  {
    id: "saas-crm-hcm",
    title: "Enterprise SaaS CRM/HCM Platform",
    description:
      "Multi-tenant platform targeting Indian and US markets with payroll, statutory compliance, and HR management.",
    longDescription:
      "Building a comprehensive ADP/Workday competitor with multi-tenant architecture, Row-Level Security, and full compliance for Indian labor laws (PF, ESI, TDS) and US regulations (FLSA, FMLA). Features modular pricing with Free through Enterprise tiers and 10 add-on modules. Includes ACH (NACHA) and NEFT/RTGS/IMPS banking integrations.",
    techStack: ["Next.js", "NestJS", "Supabase", "PostgreSQL", "TypeScript"],
    featured: false,
    status: "completed",
  },
  {
    id: "job-search-app",
    title: "Job Search Application",
    description:
      "Searchable, filterable job listings with sponsorship tracking and server-side pagination.",
    longDescription:
      "Next.js application with Workday-inspired design featuring debounced filters (300ms), sponsorship tracking, server-side pagination (20/page), skeleton loading states, and a stats strip showing sponsorship counts. Built with clean, responsive UI using Tailwind CSS.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
    featured: false,
    status: "completed",
  },
];
