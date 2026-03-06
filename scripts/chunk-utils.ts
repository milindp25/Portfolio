import { readFileSync } from "fs";
import { resolve } from "path";

export interface Chunk {
  content: string;
  metadata: {
    category: string;
    subcategory?: string;
    keywords: string[];
  };
}

/** Approximate token count (rough: 1 token ≈ 4 chars) */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/** Extract keywords from text based on known terms */
function extractKeywords(text: string, category: string): string[] {
  const keywordMap: Record<string, string[]> = {
    identity: ["name", "location", "education", "background"],
    contact: ["email", "linkedin", "github"],
    career: ["experience", "career", "financial services"],
    "capital-one": ["capital one", "senior", "cloud-native", "migration", "activation"],
    discover: ["discover", "ach", "mfe", "micro frontend", "secured card", "graduation"],
    agilant: ["agilant", "intern", "ticketing", "node.js"],
    iit: ["teaching assistant", "iit", "cs 425", "cs 442", "database", "mobile"],
    ey: ["ey", "ernst young", "intern", "automation"],
    oracle: ["oracle", "flexcube", "banking", "core banking", "transactions", "pl/sql"],
    "just-think": ["just think", "php", "e-commerce", "cms"],
    education: ["masters", "bachelors", "iit chicago", "bms", "computer science"],
    "skills-languages": ["java", "javascript", "typescript", "python", "sql"],
    "skills-frontend": ["react", "next.js", "redux", "module federation", "tailwind"],
    "skills-backend": ["spring boot", "node.js", "nestjs", "express"],
    "skills-databases": ["postgresql", "mongodb", "dynamodb", "redis", "oracle"],
    "skills-cloud": ["aws", "docker", "kubernetes", "terraform"],
    "skills-cicd": ["jenkins", "github actions", "ci/cd"],
    "skills-testing": ["junit", "jest", "playwright", "sonarqube", "testing"],
    "skills-messaging": ["kafka", "rabbitmq", "sqs", "datadog", "elk"],
    "projects-saas": ["saas", "crm", "hcm", "multi-tenant", "nestjs"],
    "projects-portfolio": ["portfolio", "chatbot", "rag", "ai", "vector"],
    "projects-jobsearch": ["job search", "workday", "applications"],
    "projects-rag": ["rag", "pipeline", "python", "embeddings", "turing"],
    strengths: ["leadership", "mentoring", "architecture", "scalable", "testing"],
    interests: ["ai", "ml", "fintech", "building", "products"],
  };

  const lowerText = text.toLowerCase();
  const knownKeywords = keywordMap[category] || [];
  return knownKeywords.filter((kw) => lowerText.includes(kw));
}

/** Map H2 heading text to a category slug and optional subcategory */
function categorize(heading: string): { category: string; subcategory?: string } {
  const h = heading.toLowerCase();

  if (h.includes("identity")) return { category: "identity" };
  if (h.includes("contact")) return { category: "contact" };
  if (h.includes("career overview")) return { category: "career" };
  if (h.includes("capital one")) return { category: "capital-one" };
  if (h.includes("discover")) return { category: "discover" };
  if (h.includes("agilant")) return { category: "agilant" };
  if (h.includes("iit chicago")) return { category: "iit" };
  if (h.includes("ey llp")) return { category: "ey" };
  if (h.includes("oracle")) return { category: "oracle" };
  if (h.includes("just think")) return { category: "just-think" };
  if (h.includes("education")) return { category: "education" };

  if (h.includes("skills") && h.includes("languages"))
    return { category: "skills-languages", subcategory: "languages" };
  if (h.includes("skills") && h.includes("frontend"))
    return { category: "skills-frontend", subcategory: "frontend" };
  if (h.includes("skills") && h.includes("backend"))
    return { category: "skills-backend", subcategory: "backend" };
  if (h.includes("skills") && h.includes("database"))
    return { category: "skills-databases", subcategory: "databases" };
  if (h.includes("skills") && h.includes("cloud"))
    return { category: "skills-cloud", subcategory: "cloud-devops" };
  if (h.includes("skills") && h.includes("ci"))
    return { category: "skills-cicd", subcategory: "cicd" };
  if (h.includes("skills") && h.includes("testing"))
    return { category: "skills-testing", subcategory: "testing" };
  if (h.includes("skills") && h.includes("messaging"))
    return { category: "skills-messaging", subcategory: "messaging-monitoring" };

  if (h.includes("saas") || h.includes("crm"))
    return { category: "projects-saas", subcategory: "side-project" };
  if (h.includes("portfolio"))
    return { category: "projects-portfolio", subcategory: "side-project" };
  if (h.includes("job search"))
    return { category: "projects-jobsearch", subcategory: "side-project" };
  if (h.includes("rag pipeline"))
    return { category: "projects-rag", subcategory: "side-project" };

  if (h.includes("strengths")) return { category: "strengths" };
  if (h.includes("interests")) return { category: "interests" };

  return { category: "general" };
}

/**
 * Split content into sliding window chunks if it exceeds maxTokens.
 * Returns the original text as a single chunk if it fits.
 */
function slidingWindow(
  text: string,
  maxTokens: number = 500,
  overlapTokens: number = 50,
): string[] {
  if (estimateTokens(text) <= maxTokens) return [text];

  const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
  const chunks: string[] = [];
  let current = "";
  let overlapBuffer = "";

  for (const sentence of sentences) {
    if (estimateTokens(current + sentence) > maxTokens && current) {
      chunks.push(current.trim());

      // Build overlap from the end of current chunk
      const words = current.trim().split(/\s+/);
      const overlapWords = words.slice(
        -Math.ceil(overlapTokens * 4 / (current.length / words.length)),
      );
      overlapBuffer = overlapWords.join(" ");

      current = overlapBuffer + " " + sentence;
    } else {
      current += sentence;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

/**
 * Parse the knowledge-source.md file and return an array of chunks
 * with metadata, ready for embedding.
 */
export function parseKnowledgeSource(filePath?: string): Chunk[] {
  const path = filePath || resolve(__dirname, "knowledge-source.md");
  const raw = readFileSync(path, "utf-8");

  // Split by H2 headings (## ...)
  const sections = raw.split(/^## /m).slice(1); // skip content before first H2
  const chunks: Chunk[] = [];

  for (const section of sections) {
    const [headingLine, ...bodyLines] = section.split("\n");
    const heading = headingLine.trim();
    const body = bodyLines.join("\n").trim();

    if (!body) continue;

    const { category, subcategory } = categorize(heading);
    const windowChunks = slidingWindow(body);

    for (const chunkText of windowChunks) {
      chunks.push({
        content: chunkText,
        metadata: {
          category,
          subcategory: subcategory,
          keywords: extractKeywords(chunkText, category),
        },
      });
    }
  }

  return chunks;
}

// Allow running directly for testing
if (require.main === module) {
  const chunks = parseKnowledgeSource();
  console.log(`\nParsed ${chunks.length} chunks:\n`);
  for (const [i, chunk] of chunks.entries()) {
    const tokens = estimateTokens(chunk.content);
    console.log(
      `[${i + 1}] ${chunk.metadata.category} (${tokens} tokens, ${chunk.metadata.keywords.length} keywords)`,
    );
    console.log(`    ${chunk.content.slice(0, 80)}...`);
    console.log();
  }
}
