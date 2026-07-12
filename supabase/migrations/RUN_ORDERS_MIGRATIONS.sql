-- À exécuter dans Supabase → SQL Editor si le paiement affiche
-- « Enregistrement commande impossible ».
-- Idempotent : safe à relancer.

alter table public.orders
  add column if not exists promo_code text,
  add column if not exists discount_eur numeric(12, 2),
  add column if not exists subtotal_eur numeric(12, 2);

alter table public.orders
  add column if not exists customer_name text,
  add column if not exists owner_notified_at timestamptz;

alter table public.orders
  add column if not exists customer_phone text,
  add column if not exists shipping_method text,
  add column if not exists relay_point jsonb,
  add column if not exists parcel_weight_grams integer default 1000,
  add column if not exists mondial_relay_expedition_id text,
  add column if not exists mondial_relay_label_url text;

alter table public.orders
  add column if not exists parcel_tier text,
  add column if not exists shipping_fee_eur numeric(10, 2);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_shipping_method_check'
  ) then
    alter table public.orders
      add constraint orders_shipping_method_check
      check (shipping_method is null or shipping_method in ('pickup', 'mondial_relay'));
  end if;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_parcel_tier_check'
  ) then
    alter table public.orders
      add constraint orders_parcel_tier_check
      check (parcel_tier is null or parcel_tier in ('petit', 'moyen', 'grand'));
  end if;
exception
  when duplicate_object then null;
end $$;

create index if not exists orders_promo_email_idx
  on public.orders (lower(customer_email), promo_code)
  where promo_code is not null and customer_email is not null;
