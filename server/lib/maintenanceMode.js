import { createClient } from '@supabase/supabase-js'

const ROW_ID = 'main'
const DEFAULT_MESSAGE =
  'Notre site est momentanément en maintenance. Les paiements en ligne sont suspendus.'

/**
 * Maintenance active : variable d’environnement (urgence) ou contenu admin (Supabase).
 * @returns {Promise<{ active: boolean, message: string }>}
 */
export async function fetchMaintenanceMode() {
  const envOn = process.env.SITE_MAINTENANCE === 'true' || process.env.SITE_MAINTENANCE === '1'
  if (envOn) {
    return {
      active: true,
      message: (process.env.SITE_MAINTENANCE_MESSAGE || DEFAULT_MESSAGE).trim(),
    }
  }

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  if (!supabaseUrl || !serviceKey) {
    return { active: false, message: '' }
  }

  try {
    const sb = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data, error } = await sb.from('site_content').select('payload').eq('id', ROW_ID).maybeSingle()
    if (error) {
      console.warn('[maintenanceMode] fetch', error.message)
      return { active: false, message: '' }
    }
    const m = data?.payload?.maintenance
    if (m?.enabled) {
      return {
        active: true,
        message: String(m.message || DEFAULT_MESSAGE).trim().slice(0, 500) || DEFAULT_MESSAGE,
      }
    }
  } catch (e) {
    console.warn('[maintenanceMode]', e?.message || e)
  }

  return { active: false, message: '' }
}
