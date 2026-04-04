-- Minimal setup: portfolio JSON table only (no file uploads until you also run schema.sql storage part
-- or create the bucket in the Dashboard).
--
-- Supabase Dashboard → SQL Editor → New query → paste → Run

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
