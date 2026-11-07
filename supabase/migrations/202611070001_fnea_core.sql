-- FNEA Ouargla: core content + admin + private concerns
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'editor' check (role in ('super_admin','admin','editor','concerns_manager')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profile self read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "admins read profiles" on public.profiles for select to authenticated using (
  exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('super_admin','admin'))
);

create table if not exists public.news (
 id uuid primary key default gen_random_uuid(), title text not null, slug text unique,
 excerpt text default '', content text default '', image_url text default '',
 category text default 'news', published boolean not null default false,
 published_at timestamptz, created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(), created_by uuid references auth.users(id)
);
create table if not exists public.activities (
 id uuid primary key default gen_random_uuid(), title text not null, description text default '',
 date date, location text default '', image_url text default '', published boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.members (
 id uuid primary key default gen_random_uuid(), full_name text not null, position text not null default '',
 bio text default '', image_url text default '', email text default '', phone text default '',
 display_order int not null default 0, active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.branches (
 id uuid primary key default gen_random_uuid(), name text not null, university text default '',
 description text default '', contact text default '', active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.concerns (
 id uuid primary key default gen_random_uuid(), reference_code text unique not null default ('FNEA-'||upper(substr( gen_random_uuid()::text,1,8))),
 full_name text not null, email text not null, phone text default '', university text default '',
 faculty text default '', level text default '', category text not null, subject text not null,
 message text not null, file_path text, status text not null default 'new' check(status in ('new','in_progress','resolved','closed')),
 admin_note text default '', assigned_to uuid references auth.users(id), created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists concerns_status_created_idx on public.concerns(status,created_at desc);
create index if not exists news_published_idx on public.news(published,published_at desc);

-- public can read only published content; write access is role-gated
alter table public.news enable row level security;
alter table public.activities enable row level security;
alter table public.members enable row level security;
alter table public.branches enable row level security;
alter table public.concerns enable row level security;
create policy "public published news" on public.news for select to anon,authenticated using (published=true);
create policy "staff manage news" on public.news for all to authenticated using (exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin','editor'))) with check (exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin','editor')));
create policy "public published activities" on public.activities for select to anon,authenticated using (published=true);
create policy "staff manage activities" on public.activities for all to authenticated using (exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin','editor'))) with check (exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin','editor')));
create policy "public active members" on public.members for select to anon,authenticated using (active=true);
create policy "admins manage members" on public.members for all to authenticated using (exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin'))) with check (exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin')));
create policy "public active branches" on public.branches for select to anon,authenticated using (active=true);
create policy "admins manage branches" on public.branches for all to authenticated using (exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin'))) with check (exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin')));
-- Submission is public insert only. Concern details are staff-only; no anon select/update/delete.
create policy "public submit concern" on public.concerns for insert to anon,authenticated with check (status='new' and admin_note='');
create policy "staff read concerns" on public.concerns for select to authenticated using (exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin','concerns_manager')));
create policy "staff update concerns" on public.concerns for update to authenticated using (exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin','concerns_manager'))) with check (exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin','concerns_manager')));

-- Storage bucket for public editorial images; private bucket for concern attachments
insert into storage.buckets(id,name,public) values ('fnea-media','fnea-media',true),('concern-files','concern-files',false) on conflict(id) do nothing;
create policy "public view FNEA media" on storage.objects for select to anon,authenticated using(bucket_id='fnea-media');
create policy "staff upload FNEA media" on storage.objects for insert to authenticated with check(bucket_id='fnea-media' and exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin','editor')));
create policy "staff update FNEA media" on storage.objects for update to authenticated using(bucket_id='fnea-media' and exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin','editor')));
create policy "staff access concern files" on storage.objects for select to authenticated using(bucket_id='concern-files' and exists(select 1 from profiles p where p.id=auth.uid() and p.role in ('super_admin','admin','concerns_manager')));
create policy "public upload concern files" on storage.objects for insert to anon,authenticated with check(bucket_id='concern-files');

-- Automatically create a least-privilege profile for every new auth user.
create or replace function public.handle_new_user_profile() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,full_name,role) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),'editor'); return new; end; $$;
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users for each row execute procedure public.handle_new_user_profile();
