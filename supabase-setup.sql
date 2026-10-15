-- Run in Supabase SQL Editor. Never enable public access to this table.
create table if not exists public.train_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.train_data enable row level security;
revoke all on table public.train_data from anon;
grant select, insert, update, delete on table public.train_data to authenticated;
drop policy if exists "read own training" on public.train_data;
drop policy if exists "insert own training" on public.train_data;
drop policy if exists "update own training" on public.train_data;
drop policy if exists "delete own training" on public.train_data;
create policy "read own training" on public.train_data for select to authenticated using (auth.uid() = user_id);
create policy "insert own training" on public.train_data for insert to authenticated with check (auth.uid() = user_id);
create policy "update own training" on public.train_data for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own training" on public.train_data for delete to authenticated using (auth.uid() = user_id);
