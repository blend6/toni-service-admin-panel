-- Run in Supabase SQL Editor to enable file edits, deletes, and their history events.
alter table public.activity
  drop constraint if exists activity_action_check;

alter table public.activity
  add constraint activity_action_check
  check (action in ('upload', 'download', 'edit', 'delete'));

drop policy if exists "files update" on public.files;
create policy "files update" on public.files
  for update to authenticated using (true) with check (true);

drop policy if exists "files delete" on public.files;
create policy "files delete" on public.files
  for delete to authenticated using (true);

drop policy if exists "ecu delete" on storage.objects;
create policy "ecu delete" on storage.objects
  for delete to authenticated using (bucket_id = 'ecu-files');
