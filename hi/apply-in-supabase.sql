-- Same script as supabase/schema.sql — copy this file if the nested path is awkward.
-- Run in Supabase → SQL Editor → New query → paste → Run.

-- ============================================================================
-- HOW TO RUN
-- 1. Open https://supabase.com → your project
-- 2. Left sidebar: SQL Editor → New query
-- 3. Paste this entire file → click Run (or Ctrl+Enter)
-- 4. Table Editor → public.portfolios → row id: main-portfolio
--
-- If storage.buckets INSERT errors: Storage → New bucket → portfolio-files (public, 50 MB),
-- then run from "drop policy if exists portfolio_files_read_public" to the end.
-- ============================================================================

create table if not exists public.portfolios (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.portfolios enable row level security;

drop policy if exists "portfolios_select_public" on public.portfolios;
drop policy if exists "portfolios_insert_authenticated" on public.portfolios;
drop policy if exists "portfolios_update_authenticated" on public.portfolios;

create policy "portfolios_select_public"
  on public.portfolios for select
  using (true);

create policy "portfolios_insert_authenticated"
  on public.portfolios for insert
  with check (auth.role() = 'authenticated');

create policy "portfolios_update_authenticated"
  on public.portfolios for update
  using (auth.role() = 'authenticated');

insert into public.portfolios (id, data)
values ('main-portfolio', '{}'::jsonb)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit)
values ('portfolio-files', 'portfolio-files', true, 52428800)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

drop policy if exists "portfolio_files_read_public" on storage.objects;
drop policy if exists "portfolio_files_insert_authenticated" on storage.objects;
drop policy if exists "portfolio_files_update_authenticated" on storage.objects;
drop policy if exists "portfolio_files_delete_authenticated" on storage.objects;

create policy "portfolio_files_read_public"
  on storage.objects for select
  using (bucket_id = 'portfolio-files');

create policy "portfolio_files_insert_authenticated"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio-files'
    and auth.role() = 'authenticated'
  );

create policy "portfolio_files_update_authenticated"
  on storage.objects for update
  using (
    bucket_id = 'portfolio-files'
    and auth.role() = 'authenticated'
  );

create policy "portfolio_files_delete_authenticated"
  on storage.objects for delete
  using (
    bucket_id = 'portfolio-files'
    and auth.role() = 'authenticated'
  );
