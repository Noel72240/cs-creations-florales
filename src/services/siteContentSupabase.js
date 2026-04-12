/**
 * Persistance du JSON site dans Supabase (optionnel).
 *
 * 1. Créer une table, ex. :
 *    create table public.site_content (
 *      id text primary key default 'main',
 *      payload jsonb not null default '{}'::jsonb,
 *      updated_at timestamptz not null default now()
 *    );
 *
 * 2. RLS : lecture `anon` si le site doit lire le contenu sans auth ;
 *    écriture réservée à un rôle service / utilisateurs authentifiés (admin).
 *
 * 3. Définir sur Vercel : VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, puis
 *    VITE_CONTENT_DRIVER=supabase dans `SiteContentContext` (chargement + save).
 */
import { getSupabase } from './supabaseClient'

const ROW_ID = 'main'

/** @returns {Promise<object|null>} */
export async function fetchSiteContentPayload() {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('site_content').select('payload').eq('id', ROW_ID).maybeSingle()
  if (error) {
    if (import.meta.env.DEV) {
      console.warn('[siteContentSupabase] fetch', error.message)
    }
    return null
  }
  const p = data?.payload
  return p && typeof p === 'object' ? p : null
}

/** @returns {Promise<boolean>} */
export async function upsertSiteContentPayload(payload) {
  const sb = getSupabase()
  if (!sb) return false
  const { error } = await sb.from('site_content').upsert(
    {
      id: ROW_ID,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )
  if (error) {
    if (import.meta.env.DEV) {
      console.warn('[siteContentSupabase] upsert', error.message)
    }
    return false
  }
  return true
}
