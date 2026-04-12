import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SITE_CONTENT_DEFAULTS } from '../data/siteContent.defaults'
import { SUMUP_PAYMENT_URL as SUMUP_ENV } from '../config/site'
import {
  clearLocalSiteOverrides,
  fetchStaticSiteContentSeed,
  readLocalSiteOverrides,
  writeLocalSiteOverrides,
} from '../services/siteContentPersistence'
import { isSupabaseConfigured } from '../services/supabaseClient'
import { fetchSiteContentPayload, upsertSiteContentPayload } from '../services/siteContentSupabase'

/** `local` = localStorage (+ site-content.json). `supabase` = ligne JSON dans Postgres (voir siteContentSupabase.js). */
const CONTENT_DRIVER = (import.meta.env.VITE_CONTENT_DRIVER || 'local').trim()
const USE_SUPABASE = CONTENT_DRIVER === 'supabase' && isSupabaseConfigured()

if (import.meta.env.DEV && CONTENT_DRIVER === 'supabase' && !isSupabaseConfigured()) {
  console.warn(
    '[SiteContent] VITE_CONTENT_DRIVER=supabase mais VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants — repli sur localStorage.',
  )
}

function deepMerge(base, patch) {
  if (!patch || typeof patch !== 'object') return base
  if (Array.isArray(patch)) return patch
  const out = Array.isArray(base) ? [...base] : { ...base }
  for (const key of Object.keys(patch)) {
    const pv = patch[key]
    const bv = base[key]
    if (pv && typeof pv === 'object' && !Array.isArray(pv) && bv && typeof bv === 'object' && !Array.isArray(bv)) {
      out[key] = deepMerge(bv, pv)
    } else if (pv !== undefined && pv !== null) {
      out[key] = pv
    }
  }
  return out
}

export function getMergedContent(overrides) {
  const raw = JSON.parse(JSON.stringify(SITE_CONTENT_DEFAULTS))
  return deepMerge(raw, overrides || {})
}

export function getSumupUrlFromContent(content) {
  const fromAdmin = content?.sumupPaymentUrl?.trim()
  return fromAdmin || SUMUP_ENV || ''
}

const SiteContentContext = createContext(null)

export function SiteContentProvider({ children }) {
  const [overrides, setOverrides] = useState(null)
  const [remoteLoaded, setRemoteLoaded] = useState(false)
  const overridesRef = useRef(null)
  overridesRef.current = overrides

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (USE_SUPABASE) {
        const seed = await fetchStaticSiteContentSeed()
        const fromDb = await fetchSiteContentPayload()
        const merged = deepMerge(seed || {}, fromDb || readLocalSiteOverrides() || {})
        if (!cancelled) setOverrides(merged)
        if (!cancelled) setRemoteLoaded(true)
        return
      }

      const local = readLocalSiteOverrides()
      if (local && !cancelled) setOverrides(local)

      const data = await fetchStaticSiteContentSeed()
      if (data && typeof data === 'object' && !cancelled) {
        setOverrides((prev) => deepMerge(data, prev || {}))
      }
      if (!cancelled) setRemoteLoaded(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const content = useMemo(() => getMergedContent(overrides), [overrides])

  const save = useCallback((patch) => {
    const prev = overridesRef.current
    const next = deepMerge(prev || {}, patch)

    if (USE_SUPABASE) {
      const ok = writeLocalSiteOverrides(next)
      if (ok) {
        overridesRef.current = next
        setOverrides(next)
      }
      void upsertSiteContentPayload(next)
      return ok
    }

    const ok = writeLocalSiteOverrides(next)
    if (ok) {
      overridesRef.current = next
      setOverrides(next)
    }
    return ok
  }, [])

  const reset = useCallback(() => {
    clearLocalSiteOverrides()
    setOverrides({})
  }, [])

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(getMergedContent(overrides), null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'site-content.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }, [overrides])

  const importJson = useCallback((text) => {
    const data = JSON.parse(text)
    setOverrides(data)
    if (USE_SUPABASE) {
      void upsertSiteContentPayload(data)
    }
    writeLocalSiteOverrides(data)
  }, [])

  const value = useMemo(
    () => ({
      content,
      overrides,
      remoteLoaded,
      contentDriver: USE_SUPABASE ? 'supabase' : 'local',
      save,
      reset,
      exportJson,
      importJson,
    }),
    [content, overrides, remoteLoaded, save, reset, exportJson, importJson],
  )

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext)
  if (!ctx) {
    throw new Error('useSiteContent must be used within SiteContentProvider')
  }
  return ctx
}

export function useSiteConfig() {
  const ctx = useContext(SiteContentContext)
  const content = ctx ? ctx.content : getMergedContent(null)
  const sumupUrl = useMemo(() => getSumupUrlFromContent(content), [content])
  if (!ctx) {
    return {
      content,
      overrides: null,
      remoteLoaded: true,
      contentDriver: 'local',
      save: () => true,
      reset: () => {},
      exportJson: () => {},
      importJson: () => {},
      sumupUrl,
    }
  }
  return { ...ctx, sumupUrl }
}
