# Architecture Overview

This document describes the system architecture of the portfolio site and AI chatbot.

## High-Level Architecture

```
                         ┌─────────────────────────────────┐
                         │           Vercel                 │
                         │  ┌───────────────────────────┐   │
    User Browser ──────▶ │  │   Next.js App Router      │   │
                         │  │                           │   │
                         │  │  Static Pages (SSG)       │   │
                         │  │  /, /experience, /projects │   │
                         │  │                           │   │
                         │  │  API Routes (Serverless)  │   │
                         │  │  /api/chat                │   │
                         │  │  /api/feedback            │   │
                         │  │  /api/admin/*             │   │
                         │  └─────┬──────────┬──────────┘   │
                         └────────┼──────────┼──────────────┘
                                  │          │
                    ┌─────────────┘          └──────────────┐
                    ▼                                       ▼
          ┌─────────────────┐                    ┌─────────────────┐
          │    Supabase     │                    │  Google Gemini  │
          │                 │                    │                 │
          │  PostgreSQL     │                    │  Embeddings     │
          │  + pgvector     │                    │  (embedding-001)│
          │                 │                    │                 │
          │  Tables:        │                    │  LLM Chat       │
          │  knowledge_chunks│                   │  (Flash / Lite) │
          │  unanswered_q's │                    │                 │
          │  feedback       │                    └─────────────────┘
          │  chat_analytics │
          └─────────────────┘
```

## RAG Chatbot Pipeline

The chatbot uses a stateless RAG (Retrieval-Augmented Generation) architecture. Each question is independent — no conversation history is sent to the LLM.

### Request Flow

```
User Question
     │
     ▼
┌──────────────────┐
│  POST /api/chat  │
│                  │
│  1. Rate Limit   │──── 429? → Quirky error message
│     Check        │
│                  │
│  2. Generate     │
│     Embedding    │──── Gemini embedding-001 (768 dimensions)
│                  │
│  3. Vector       │
│     Search       │──── Supabase pgvector (cosine similarity)
│                  │         match_knowledge RPC
│                  │         threshold: 0.45, top 8 results
│                  │
│  4. Route Model  │──── Based on max similarity score:
│                  │
│     ┌────────────┤
│     │ > 0.70     │──── Gemini 2.5 Flash Lite (fast, factual)
│     │ 0.55-0.70  │──── Gemini 2.5 Flash (synthesis needed)
│     │ < 0.55     │──── Skip LLM → fallback message
│     └────────────┤         + log as unanswered question
│                  │
│  5. Build Prompt │──── System prompt with:
│                  │     • Strict guardrails (scope enforcement)
│                  │     • Core identity context (always present)
│                  │     • Retrieved knowledge chunks
│                  │
│  6. Stream       │
│     Response     │──── Gemini streaming API (SSE)
│                  │     Piped directly to client
│                  │
│  7. Log          │──── Fire-and-forget analytics logging
│     Analytics    │     (doesn't block response)
└──────────────────┘
```

### Model Routing

The model router optimizes cost and speed based on how confident the vector search is:

| Max Similarity | Model | Rationale | Cost |
|---------------|-------|-----------|------|
| > 0.70 | Gemini 2.5 Flash Lite | Direct factual match — fast lookup | Lowest |
| 0.55 – 0.70 | Gemini 2.5 Flash | Needs synthesis across chunks | Medium |
| < 0.55 | None (skipped) | No relevant context — log question | Free |

### Prompt Architecture

The system prompt has three layers:

1. **Guardrails** — Strict rules that scope the bot to only answer about Milind. Off-topic questions are redirected without consuming LLM tokens.

2. **Core Identity Context** — A hardcoded block with essential facts (name, current job, career timeline, contact info). This is always included regardless of vector search results, ensuring basic "who/where/what" questions always work.

3. **Retrieved Context** — Knowledge chunks from the vector database, ranked by similarity. Only chunks with similarity >= 0.55 are included in the prompt.

## Knowledge Base

### Embedding Pipeline

```
knowledge-source.md (personal data in markdown)
        │
        ▼
  chunk-utils.ts (split by H2 headers, sliding window)
        │
        ▼
  ~40 chunks (max ~500 tokens each, with metadata)
        │
        ▼
  Gemini embedding-001 (768 dimensions per chunk)
        │
        ▼
  Supabase knowledge_chunks table (with pgvector index)
```

### Vector Search

Uses Supabase's `match_knowledge` RPC function with HNSW indexing for fast cosine similarity search. Queries retrieve the top 8 results above a 0.45 threshold, then the pipeline filters to >= 0.55 for the actual prompt.

### Feedback Loop

Unanswered questions (similarity < 0.55) are automatically logged. Admins can:
1. Write an answer → generates embedding → inserts as new knowledge chunk
2. Mark as resolved (no KB addition needed)
3. Dismiss (spam/irrelevant)

This creates a continuous improvement cycle where gaps in the knowledge base are identified and filled.

## Authentication & Security

### Admin Auth
- Simple cookie-based session using `ADMIN_SECRET` environment variable
- Session token: Base64-encoded `portfolio-admin:{secret}`
- HttpOnly cookie with 7-day expiry
- Middleware protects all `/admin/*` and `/api/admin/*` routes (except login)

### Security Headers
- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `poweredByHeader: false` — hides Next.js identity

### Rate Limiting
- In-memory rate limiter (per serverless instance)
- 20 requests per minute per IP address
- Stale entries cleaned up every 5 minutes
- Suitable for personal portfolio traffic; upgrade to Redis for higher scale

## Database Schema

### knowledge_chunks
Stores the RAG knowledge base with vector embeddings.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint (auto) | Primary key |
| content | text | Chunk text content |
| metadata | jsonb | Category, subcategory, keywords |
| embedding | vector(768) | Gemini embedding |
| created_at | timestamptz | Creation timestamp |

**Index:** HNSW on `embedding` using `vector_cosine_ops`

### unanswered_questions
Tracks questions the chatbot couldn't answer (similarity below threshold).

| Column | Type | Description |
|--------|------|-------------|
| id | bigint (auto) | Primary key |
| question | text | The user's question |
| max_similarity | float | Highest similarity score found |
| frequency | int | Times this question was asked (deduplication) |
| status | text | pending / resolved / added_to_kb / dismissed |

### feedback
User thumbs up/down on chatbot responses.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint (auto) | Primary key |
| question | text | The user's question |
| answer | text | The chatbot's response |
| rating | text | positive / negative |
| comment | text (nullable) | Optional user comment |

### chat_analytics
Logs every chat request for analytics.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint (auto) | Primary key |
| question | text | The user's question |
| model_used | text | fast / quality / none |
| max_similarity | float | Highest similarity score |
| response_time_ms | int | Total response time |

## API Routes

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/chat` | POST | Public (rate limited) | Chat with the AI assistant |
| `/api/feedback` | POST | Public | Submit thumbs up/down |
| `/api/admin/login` | POST | Public | Admin authentication |
| `/api/admin/stats` | GET | Admin | Dashboard statistics |
| `/api/admin/questions` | GET/PATCH | Admin | Manage unanswered questions |
| `/api/admin/questions/add-to-kb` | POST | Admin | Add answer to knowledge base |
| `/api/admin/feedback` | GET | Admin | List all feedback |
| `/api/admin/analytics` | GET | Admin | Chat analytics data |

## Key Design Decisions

1. **Stateless chatbot** — No conversation history sent to the LLM. Each question is independent (system prompt + chunks + question only). Saves tokens and reduces cost.

2. **Dynamic model routing** — Uses cheaper/faster model for simple lookups, more capable model for synthesis. Below-threshold questions skip the LLM entirely.

3. **Persistent identity context** — Core facts are hardcoded in the system prompt so basic biographical questions always work, even if vector search misses the relevant chunk.

4. **Strict guardrails** — Off-topic questions are redirected without any LLM call, saving API costs.

5. **In-memory rate limiting** — Good enough for a personal portfolio. Each Vercel serverless instance has its own memory, so limits are per-instance (conservative enough for this use case).

6. **Static data files** — Projects, experience, and skills stored as typed TypeScript arrays in `src/data/`. Simple, type-safe, no CMS dependency.

7. **Fire-and-forget logging** — Analytics and unanswered question logging happen asynchronously and don't block the chat response.
