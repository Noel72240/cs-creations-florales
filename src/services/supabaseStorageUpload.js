/**
 * Upload d’images vers Supabase Storage (bucket public).
 *
 * Prérequis côté Supabase :
 * 1. Créer un bucket (ex. site-images), cocher « Public » pour la lecture web.
 * 2. Authentication → créer un utilisateur dédié à l’admin (email + mot de passe).
 * 3. SQL → policies sur storage.objects (remplacer site-images par votre nom) :
 *
 *    create policy "Lecture publique des images"
 *    on storage.objects for select
 *    using ( bucket_id = 'site-images' );
 *
 *    create policy "Upload admin authentifié"
 *    on storage.objects for insert to authenticated
 *    with check ( bucket_id = 'site-images' );
 *
 *    create policy "Mise à jour admin authentifié"
 *    on storage.objects for update to authenticated
 *    using ( bucket_id = 'site-images' );
 *
 *    create policy "Suppression admin authentifié"
 *    on storage.objects for delete to authenticated
 *    using ( bucket_id = 'site-images' );
 */
import { isSupabaseConfigured } from './supabaseClient'

export function getSupabaseStorageBucketName() {
  return (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || '').trim()
}

export function isSupabaseStorageConfigured() {
  return isSupabaseConfigured() && Boolean(getSupabaseStorageBucketName())
}

function safeFileExtension(file) {
  const fromName = (file?.name || '').split('.').pop()
  if (fromName && /^[a-z0-9]+$/i.test(fromName) && fromName.length <= 8) {
    return fromName.toLowerCase()
  }
  const t = (file?.type || '').toLowerCase()
  if (t === 'image/jpeg' || t === 'image/jpg') return 'jpg'
  if (t === 'image/png') return 'png'
  if (t === 'image/webp') return 'webp'
  if (t === 'image/gif') return 'gif'
  if (t === 'image/svg+xml') return 'svg'
  return 'jpg'
}

function randomSegment() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {File} file
 * @param {string} folder ex. "site/hero", "articles"
 * @returns {Promise<string>} URL publique
 */
export async function uploadPublicSiteImage(supabase, file, folder) {
  const bucket = getSupabaseStorageBucketName()
  if (!bucket) throw new Error('Bucket Storage non configuré (VITE_SUPABASE_STORAGE_BUCKET).')
  const sub = String(folder || 'site').replace(/^\/+|\/+$/g, '')
  const ext = safeFileExtension(file)
  const path = `${sub}/${randomSegment()}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  const url = data?.publicUrl
  if (!url) throw new Error('URL publique indisponible.')
  return url
}

/** Indique si l’URL pointe vers ce bucket (pour bouton « retirer » dans l’admin). */
export function isLikelySupabaseBucketUrl(src) {
  const s = String(src || '').trim()
  if (!s.startsWith('https://')) return false
  return /\/storage\/v1\/object\/public\//.test(s)
}
