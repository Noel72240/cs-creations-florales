-- Commandes créées avant redirection SumUp (service role côté /api uniquement).
-- RLS : aucune politique pour anon/authenticated = lecture/écriture publique bloquée ;
-- la clé service_role du backend contourne RLS.

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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_checkout_reference_idx on public.orders (checkout_reference);

alter table public.orders enable row level security;

comment on table public.orders is 'Commandes site — insert/update via Vercel API + service_role uniquement';
