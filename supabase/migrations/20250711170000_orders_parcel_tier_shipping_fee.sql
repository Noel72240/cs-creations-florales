-- Taille colis (définie par l'atelier) et frais de livraison calculés côté serveur.

alter table public.orders
  add column if not exists parcel_tier text
    check (parcel_tier is null or parcel_tier in ('petit', 'moyen', 'grand')),
  add column if not exists shipping_fee_eur numeric(10, 2);

comment on column public.orders.parcel_tier is 'Format colis Mondial Relay (petit / moyen / grand), déterminé par les articles';
comment on column public.orders.shipping_fee_eur is 'Frais de livraison Point Relais ajoutés au total (0 ou null si retrait atelier)';
