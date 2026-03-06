export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  featured: boolean;
  status: "completed" | "in-progress" | "planned";
}

export const projects: Project[] = [
  {
    id: "saas-crm-hcm",
    title: "Enterprise SaaS CRM/HCM Platform",
    description:
      "Multi-tenant platform targeting Indian and US markets with payroll, statutory compliance, and HR management.",
    longDescription:
      "Building a comprehensive ADP/Workday competitor with multi-tenant architecture, Row-Level Security, and full compliance for Indian labor laws (PF, ESI, TDS) and US regulations (FLSA, FMLA). Features modular pricing with Free through Enterprise tiers and 10 add-on modules. Includes ACH (NACHA) and NEFT/RTGS/IMPS banking integrations.",
    techStack: ["Next.js", "NestJS", "Supabase", "PostgreSQL", "TypeScript"],
    featured: true,
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
    featured: true,
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
];
