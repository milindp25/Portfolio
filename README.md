# Milind Prabhakar — Portfolio + AI Chatbot

Personal portfolio website with an AI-powered chatbot that answers questions about my professional background using RAG (Retrieval-Augmented Generation).

## Tech Stack

- **Framework:** Next.js 16 (App Router), TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **Database:** Supabase (PostgreSQL + pgvector)
- **AI/LLM:** Google Gemini (embeddings + chat)
- **Deployment:** Vercel

## Features

### Portfolio
- Dark-themed, terminal/IDE-inspired design with cyan accent
- Home page with hero, about, featured projects, skills, and contact
- Experience page with interactive career timeline
- Projects page with tech stack badges
- Fully responsive (mobile, tablet, desktop)

### AI Chatbot
- Floating chat widget available on all pages
- RAG pipeline: question embedding, vector search, LLM generation
- Dynamic model routing based on similarity scores
- Markdown rendering in responses with copy button
- Suggested starter questions
- Streaming responses with typing indicator
- Strict guardrails — only answers questions about Milind
- Rate limiting (20 req/min per IP) with quirky error messages

### Admin Dashboard
- Password-protected admin area
- Dashboard with chat stats, satisfaction rate, pending questions
- Unanswered questions management with "Answer & Add to KB" workflow
- Feedback viewer (thumbs up/down from users)
- Analytics page: chat volume chart, model usage breakdown, response times

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project with pgvector enabled
- A Google Gemini API key

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/milindp25/Portfolio.git
   cd Portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` from the example:
   ```bash
   cp .env.example .env.local
   ```
   Then fill in your actual values (see `.env.example` for required keys).

4. Run the database migrations in Supabase SQL editor:
   - `supabase/migrations/001_create_knowledge_chunks.sql`
   - `supabase/migrations/002_create_feedback_tables.sql`

5. Seed the knowledge base:
   ```bash
   npx tsx scripts/seed-knowledge.ts
   ```

6. Start the dev server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for the full list. Required:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `ADMIN_SECRET` | Password for the admin dashboard |

## Deployment

Deploy to Vercel by connecting this repo. Add the environment variables in the Vercel dashboard. Vercel auto-deploys on push to `main`.

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    admin/                # Admin dashboard (login, stats, questions, feedback, analytics)
    api/                  # API routes (chat, feedback, admin endpoints)
    experience/           # Career timeline page
    projects/             # Projects showcase page
  components/
    chat/                 # Chat widget (toggle, window, messages, input, feedback)
    experience/           # Timeline components
    home/                 # Hero, About, Skills, Contact, FeaturedProjects
    layout/               # Header, Footer
    projects/             # ProjectCard, ProjectGrid
    ui/                   # Shared primitives (Button, Badge, Card, etc.)
  data/                   # Static data (experience, projects, skills, personal)
  lib/
    rag/                  # RAG pipeline (types, model-router, prompt, pipeline)
    supabase/             # Supabase clients, queries, search, types
    admin-auth.ts         # Simple admin authentication
    embeddings.ts         # Gemini embedding generation
    rate-limit.ts         # In-memory rate limiter
    utils.ts              # Utility helpers (cn)
scripts/                  # Knowledge base seeding and test scripts
supabase/migrations/      # SQL migrations
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed system architecture overview.
