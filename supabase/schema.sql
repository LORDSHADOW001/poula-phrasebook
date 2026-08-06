-- Run this in your Supabase project's SQL Editor (left sidebar -> SQL Editor -> New query)
-- Then click "Run".

create table entries (
  id uuid primary key default gen_random_uuid(),
  poula_text text not null,
  english_text text not null,
  category text,
  contributed_by text,
  audio_url text,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Row Level Security: on for safety, with open policies for the prototype stage.
-- This is intentionally permissive so you and your speakers can use the app
-- immediately with no login system. Tighten this later once you add auth
-- (see the "Where to go after the prototype" section in README.md).

alter table entries enable row level security;

create policy "Anyone can read entries"
  on entries for select
  using (true);

create policy "Anyone can add entries"
  on entries for insert
  with check (true);

create policy "Anyone can mark entries verified"
  on entries for update
  using (true);

-- ---------- Audio storage ----------
-- Creates a public storage bucket called "audio" for pronunciation recordings,
-- and permissive policies matching the entries table above (open for the
-- prototype stage, tighten later once you add real authentication).

insert into storage.buckets (id, name, public)
values ('audio', 'audio', true)
on conflict (id) do nothing;

create policy "Anyone can upload audio"
  on storage.objects for insert
  with check (bucket_id = 'audio');

create policy "Anyone can read audio"
  on storage.objects for select
  using (bucket_id = 'audio');
