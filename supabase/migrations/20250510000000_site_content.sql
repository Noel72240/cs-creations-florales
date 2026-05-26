-- Étape 1 : contenu éditable du site (textes admin, maintenance, avis Google, etc.)
-- Lecture publique (visiteurs). Écriture : utilisateurs Supabase Auth uniquement (admin connecté).

create table if not exists public.site_content (
  id text primary key default 'main',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.site_content is 'JSON fusionné du site — une ligne id=main';
comment on column public.site_content.payload is 'Surcharges admin (home, footer, articles, googleReviews, maintenance…)';

alter table public.site_content enable row level security;

drop policy if exists "site_content_public_read" on public.site_content;
create policy "site_content_public_read"
  on public.site_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "site_content_authenticated_insert" on public.site_content;
create policy "site_content_authenticated_insert"
  on public.site_content
  for insert
  to authenticated
  with check (true);

drop policy if exists "site_content_authenticated_update" on public.site_content;
create policy "site_content_authenticated_update"
  on public.site_content
  for update
  to authenticated
  using (true)
  with check (true);
