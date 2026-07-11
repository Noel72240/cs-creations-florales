-- Livraison / Mondial Relay (préparation étiquettes).

alter table public.orders
  add column if not exists customer_phone text,
  add column if not exists shipping_method text
    check (shipping_method is null or shipping_method in ('pickup', 'mondial_relay')),
  add column if not exists relay_point jsonb,
  add column if not exists parcel_weight_grams integer default 1000,
  add column if not exists mondial_relay_expedition_id text,
  add column if not exists mondial_relay_label_url text;

comment on column public.orders.shipping_method is 'pickup = retrait atelier, mondial_relay = Point Relais';
comment on column public.orders.relay_point is 'Point Relais sélectionné (id, nom, adresse, CP, ville)';
comment on column public.orders.mondial_relay_label_url is 'URL PDF étiquette Mondial Relay (génération API à venir)';
