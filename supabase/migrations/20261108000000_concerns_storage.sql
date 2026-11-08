-- FNEA concerns + private attachment storage
-- Run once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.concerns (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique default (
    'FNEA-' || upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 12))
  ),
  full_name text not null,
  email text not null,
  phone text,
  university text not null,
  faculty text not null,
  level text not null,
  category text not null,
  subject text not null,
  message text not null,
  file_path text,
  file_name text,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.concerns enable row level security;

-- Public visitors may submit concerns, but cannot read or enumerate submissions.
drop policy if exists "Anyone can submit a concern" on public.concerns;
create policy "Anyone can submit a concern"
  on public.concerns for insert
  to anon, authenticated
  with check (true);

-- Private bucket: files are not publicly readable.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'concern-files',
  'concern-files',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Visitors can upload concern attachments" on storage.objects;
create policy "Visitors can upload concern attachments"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'concern-files');
