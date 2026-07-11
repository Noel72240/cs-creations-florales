-- =============================================================================
-- C&S Créations Florales — tout le SQL en un seul script
-- Supabase → SQL Editor → New query → coller → Run
-- =============================================================================

-- ─── 1. Contenu du site ───
create table if not exists public.site_content (
  id text primary key default 'main',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "site_content_public_read" on public.site_content;
create policy "site_content_public_read"
  on public.site_content for select to anon, authenticated using (true);

drop policy if exists "site_content_authenticated_insert" on public.site_content;
create policy "site_content_authenticated_insert"
  on public.site_content for insert to authenticated with check (true);

drop policy if exists "site_content_authenticated_update" on public.site_content;
create policy "site_content_authenticated_update"
  on public.site_content for update to authenticated using (true) with check (true);

-- ─── 2. Commandes (paiement SumUp — plus tard) ───
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  checkout_reference text not null unique,
  sumup_checkout_id text,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'cancelled', 'expired')),
  amount_eur numeric(12, 2) not null check (amount_eur > 0),
  currency text not null default 'EUR',
  line_items jsonb not null default '[]'::jsonb,
  customer_email text,
  payee_email text,
  promo_code text,
  discount_eur numeric(12, 2),
  subtotal_eur numeric(12, 2),
  customer_name text,
  owner_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_checkout_reference_idx on public.orders (checkout_reference);

alter table public.orders enable row level security;

-- ─── 3. Storage (APRÈS avoir créé le bucket « site-images » public) ───
drop policy if exists "storage_public_read_site_images" on storage.objects;
create policy "storage_public_read_site_images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-images');

drop policy if exists "storage_authenticated_insert_site_images" on storage.objects;
create policy "storage_authenticated_insert_site_images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-images');

drop policy if exists "storage_authenticated_update_site_images" on storage.objects;
create policy "storage_authenticated_update_site_images"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-images') with check (bucket_id = 'site-images');

drop policy if exists "storage_authenticated_delete_site_images" on storage.objects;
create policy "storage_authenticated_delete_site_images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-images');
