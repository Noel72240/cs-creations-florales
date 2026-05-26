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
 * 2. RLS : lecture `anon` ; écriture via API serveur + SUPABASE_SERVICE_ROLE_KEY.
 *
 * 3. Vercel : VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_CONTENT_DRIVER=supabase,
 *    SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD (ou VITE_ADMIN_PASSWORD).
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

/** @returns {Promise<{ ok: boolean, error?: string }>} */
export async function upsertSiteContentPayload(payload) {
  const { saveSiteContentViaApi } = await import('../lib/adminServerApi.js')
  return saveSiteContentViaApi(payload)
}
