-- Champs code promo sur les commandes (checkout SumUp).

alter table public.orders
  add column if not exists promo_code text,
  add column if not exists discount_eur numeric(12, 2),
  add column if not exists subtotal_eur numeric(12, 2);

comment on column public.orders.promo_code is 'Code promo appliqué au checkout';
comment on column public.orders.discount_eur is 'Montant de la réduction en euros';
comment on column public.orders.subtotal_eur is 'Sous-total avant réduction';
