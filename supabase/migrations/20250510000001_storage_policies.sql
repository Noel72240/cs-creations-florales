-- Étape 2 (après création du bucket dans le dashboard) : policies Storage
-- Dashboard → Storage → New bucket → nom : site-images → cocher « Public bucket »
-- Puis exécuter ce script (remplacez site-images si autre nom).

drop policy if exists "storage_public_read_site_images" on storage.objects;
create policy "storage_public_read_site_images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'site-images');

drop policy if exists "storage_authenticated_insert_site_images" on storage.objects;
create policy "storage_authenticated_insert_site_images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'site-images');

drop policy if exists "storage_authenticated_update_site_images" on storage.objects;
create policy "storage_authenticated_update_site_images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'site-images')
  with check (bucket_id = 'site-images');

drop policy if exists "storage_authenticated_delete_site_images" on storage.objects;
create policy "storage_authenticated_delete_site_images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'site-images');
