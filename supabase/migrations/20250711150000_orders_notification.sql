-- Notification propriétaire après paiement SumUp + nom client optionnel.

alter table public.orders
  add column if not exists customer_name text,
  add column if not exists owner_notified_at timestamptz;

comment on column public.orders.customer_name is 'Nom saisi au checkout (facturation)';
comment on column public.orders.owner_notified_at is 'Horodatage envoi e-mail notification propriétaire';
