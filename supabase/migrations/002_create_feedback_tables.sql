-- ============================================================
-- Phase 4: Feedback loop + admin dashboard tables
-- ============================================================

-- 1. Unanswered questions — logged when similarity < threshold
create table unanswered_questions (
  id         bigint primary key generated always as identity,
  question   text not null,
  max_similarity float default 0,
  frequency  int default 1,
  status     text default 'pending' check (status in ('pending', 'resolved', 'added_to_kb', 'dismissed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for admin dashboard queries
create index idx_unanswered_status on unanswered_questions(status);
create index idx_unanswered_freq on unanswered_questions(frequency desc);

-- 2. Feedback — thumbs up/down on assistant messages
create table feedback (
  id         bigint primary key generated always as identity,
  question   text not null,
  answer     text not null,
  rating     text not null check (rating in ('positive', 'negative')),
  comment    text,
  created_at timestamptz default now()
);

create index idx_feedback_rating on feedback(rating);

-- 3. Chat analytics — lightweight log for stats
create table chat_analytics (
  id              bigint primary key generated always as identity,
  question        text not null,
  model_used      text,
  max_similarity  float,
  response_time_ms int,
  created_at      timestamptz default now()
);

create index idx_analytics_created on chat_analytics(created_at desc);

-- 4. Helper: auto-update updated_at on unanswered_questions
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger unanswered_questions_updated_at
  before update on unanswered_questions
  for each row
  execute function update_updated_at();

-- 5. RPC: upsert unanswered question (increment frequency if duplicate)
create or replace function log_unanswered_question(
  p_question text,
  p_max_similarity float
)
returns void
language plpgsql
as $$
declare
  normalized text := lower(trim(p_question));
begin
  -- Check for similar existing question (exact match on normalized text)
  update unanswered_questions
  set frequency = frequency + 1,
      max_similarity = greatest(max_similarity, p_max_similarity)
  where lower(trim(question)) = normalized
    and status = 'pending';

  -- If no existing row was updated, insert new
  if not found then
    insert into unanswered_questions (question, max_similarity)
    values (p_question, p_max_similarity);
  end if;
end;
$$;

-- 6. RPC: get admin dashboard stats
create or replace function get_admin_stats()
returns json
language sql stable
as $$
  select json_build_object(
    'total_chats', (select count(*) from chat_analytics),
    'chats_today', (select count(*) from chat_analytics where created_at > now() - interval '1 day'),
    'chats_this_week', (select count(*) from chat_analytics where created_at > now() - interval '7 days'),
    'pending_questions', (select count(*) from unanswered_questions where status = 'pending'),
    'total_feedback', (select count(*) from feedback),
    'positive_feedback', (select count(*) from feedback where rating = 'positive'),
    'negative_feedback', (select count(*) from feedback where rating = 'negative'),
    'avg_similarity', (select round(avg(max_similarity)::numeric, 3) from chat_analytics where max_similarity > 0)
  );
$$;
