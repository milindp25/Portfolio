-- Enable pgvector extension
create extension if not exists vector;

-- Knowledge chunks table for RAG
create table knowledge_chunks (
  id         bigint primary key generated always as identity,
  content    text not null,
  metadata   jsonb default '{}',
  embedding  vector(768) not null,
  created_at timestamptz default now()
);

-- HNSW index for fast cosine similarity search
create index on knowledge_chunks using hnsw (embedding vector_cosine_ops);

-- RPC function to match knowledge chunks against a query embedding
create or replace function match_knowledge(
  query_embedding vector(768),
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    knowledge_chunks.id,
    knowledge_chunks.content,
    knowledge_chunks.metadata,
    1 - (knowledge_chunks.embedding <=> query_embedding) as similarity
  from knowledge_chunks
  where 1 - (knowledge_chunks.embedding <=> query_embedding) > match_threshold
  order by knowledge_chunks.embedding <=> query_embedding
  limit match_count;
$$;
