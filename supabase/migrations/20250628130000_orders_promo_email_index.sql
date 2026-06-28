-- Recherche rapide : code promo déjà utilisé par e-mail client.

create index if not exists orders_promo_customer_email_idx
  on public.orders (lower(customer_email), lower(promo_code))
  where promo_code is not null and customer_email is not null;
