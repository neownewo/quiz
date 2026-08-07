
create table if not exists public.quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nickname text not null,
  note text default '',
  answers jsonb not null,
  scores jsonb not null,
  compatibility integer not null default 0,
  personality_type text not null
);

alter table public.quiz_submissions enable row level security;

-- 不建立任何 anon policy。
-- 前端不直接連 Supabase；所有新增與後台讀取都經過 Vercel Serverless API，
-- 並使用只存在伺服器環境變數中的 Service Role Key。
