-- Ekzekutoje në Supabase > SQL Editor

create table files (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size bigint not null,
  path text not null,
  description text,
  uploaded_by uuid not null default auth.uid(),
  username text not null,
  created_at timestamptz not null default now()
);

create table activity (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  action text not null check (action in ('upload', 'download', 'edit', 'delete')),
  user_id uuid not null default auth.uid(),
  username text not null,
  created_at timestamptz not null default now()
);

alter table files enable row level security;
alter table activity enable row level security;

-- Vetëm përdoruesit e autorizuar mund t'i lexojnë, shtojnë, ndryshojnë dhe fshijnë file-t.
create policy "files read" on files for select to authenticated using (true);
create policy "files insert" on files for insert to authenticated with check (uploaded_by = auth.uid());
create policy "files update" on files for update to authenticated using (true) with check (true);
create policy "files delete" on files for delete to authenticated using (true);
create policy "activity read" on activity for select to authenticated using (true);
create policy "activity insert" on activity for insert to authenticated with check (user_id = auth.uid());

-- Storage privat, 50 MB për file
insert into storage.buckets (id, name, public, file_size_limit)
values ('ecu-files', 'ecu-files', false, 52428800)
on conflict (id) do nothing;

create policy "ecu upload" on storage.objects for insert to authenticated with check (bucket_id = 'ecu-files');
create policy "ecu read" on storage.objects for select to authenticated using (bucket_id = 'ecu-files');
create policy "ecu delete" on storage.objects for delete to authenticated using (bucket_id = 'ecu-files');

-- Fshirja çdo natë (edhe mban projektin aktiv). Zëvendëso PROJECT_REF dhe SECRET.
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.schedule('cleanup-30d', '0 3 * * *', $$
  select net.http_post(
    url := 'https://PROJECT_REF.supabase.co/functions/v1/cleanup',
    headers := '{"x-cron-secret": "SECRET"}'::jsonb
  )
$$);
