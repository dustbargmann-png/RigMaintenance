-- Inspection log photos: technicians can upload but, by default, can't see
-- what gets submitted — only admins see everything. An admin can flip
-- individual photos visible, at which point every technician assigned to
-- that unit can see them too. Unit and inventory item thumbnails are
-- unaffected; this only applies to photos attached to inspection/service logs.

alter table inspection_log_photos
  add column visible_to_technicians boolean not null default false;

drop policy "inspection_log_photos_all" on inspection_log_photos;

create policy "inspection_log_photos_insert" on inspection_log_photos
  for insert
  with check (
    exists (select 1 from inspection_logs l where l.id = inspection_log_id and can_access_unit(l.unit_id))
  );

create policy "inspection_log_photos_select" on inspection_log_photos
  for select
  using (
    exists (
      select 1 from inspection_logs l
      where l.id = inspection_log_id
        and can_access_unit(l.unit_id)
        and (is_admin() or visible_to_technicians)
    )
  );

create policy "inspection_log_photos_update" on inspection_log_photos
  for update
  using (
    exists (select 1 from inspection_logs l where l.id = inspection_log_id and can_access_unit(l.unit_id) and is_admin())
  )
  with check (
    exists (select 1 from inspection_logs l where l.id = inspection_log_id and can_access_unit(l.unit_id) and is_admin())
  );

create policy "inspection_log_photos_delete" on inspection_log_photos
  for delete
  using (
    exists (select 1 from inspection_logs l where l.id = inspection_log_id and can_access_unit(l.unit_id) and is_admin())
  );
