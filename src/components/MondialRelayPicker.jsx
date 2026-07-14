import { useEffect, useId, useRef } from 'react'
import { formatRelayPointSummary, mondialRelayColLivMod, normalizeRelayPoint, padMondialRelayBrand } from '../../shared/shipping.js'
import { getMondialRelayBrandCode } from '../lib/checkoutShipping'

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Script ${src}`))
    document.body.appendChild(script)
  })
}

function loadStylesheet(href) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve()
      return
    }
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Stylesheet ${href}`))
    document.head.appendChild(link)
  })
}

/**
 * Widget officiel Mondial Relay (carte + liste de Points Relais).
 * Nécessite VITE_MONDIAL_RELAY_BRAND_CODE (code enseigne 6–8 car.).
 */
export default function MondialRelayPicker({ value, onChange, defaultPostcode = '72220', parcelTier }) {
  const brand = getMondialRelayBrandCode()
  const zoneId = useId().replace(/:/g, '')
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (!brand) return undefined

    let cancelled = false

    async function mountWidget() {
      try {
        await loadStylesheet(
          'https://widget.mondialrelay.com/parcelshop-picker/css/jquery.plugin.mondialrelay.parcelshoppicker.min.css',
        )
        await loadScript('https://code.jquery.com/jquery-3.7.1.min.js')
        await loadScript(
          'https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js',
        )
        if (cancelled) return

        const $ = window.jQuery
        const selector = `#mr-zone-${zoneId}`
        if (!$?.fn?.MR_ParcelShopPicker || !document.querySelector(selector)) return

        $(selector).MR_ParcelShopPicker({
          Brand: padMondialRelayBrand(brand),
          Country: 'FR',
          PostCode: defaultPostcode,
          ColLivMod: mondialRelayColLivMod(parcelTier),
          NbResults: '10',
          ShowResultsOnMap: true,
          Responsive: true,
          OnParcelShopSelected(data) {
            onChangeRef.current?.(
              normalizeRelayPoint({
                id: data?.ID,
                name: data?.Nom,
                addressLine1: data?.Adresse1,
                addressLine2: data?.Adresse2,
                postcode: data?.CP,
                city: data?.Ville,
                country: data?.Pays,
              }),
            )
          },
        })
      } catch (e) {
        if (import.meta.env.DEV) console.warn('[MondialRelayPicker]', e)
      }
    }

    mountWidget()

    return () => {
      cancelled = true
    }
  }, [brand, zoneId, defaultPostcode, parcelTier])

  if (!brand) {
    return (
      <div
        className="mondial-relay-picker__placeholder rounded-lg border border-dashed border-mauve-light/50 px-4 py-3 text-xs leading-relaxed"
        style={{ color: 'var(--text-mid)', background: 'rgba(255,255,255,0.6)' }}
      >
        <p className="font-medium mb-1" style={{ color: 'var(--violet)' }}>
          Sélecteur Point Relais — activation en cours
        </p>
        <p>
          Le choix sur carte sera disponible dès que le code enseigne Mondial Relay sera configuré sur le site.
          En attendant, choisissez la <strong>récupération main à main</strong> à l’atelier.
        </p>
      </div>
    )
  }

  const summary = value ? formatRelayPointSummary(value) : ''

  return (
    <div className="mondial-relay-picker space-y-3">
      {summary ? (
        <div
          className="mondial-relay-picker__selected rounded-lg border border-mauve-light/40 px-3 py-2.5 text-xs"
          style={{ background: 'rgba(240,210,221,0.2)' }}
        >
          <p className="font-medium mb-0.5" style={{ color: 'var(--violet)' }}>
            Point Relais sélectionné
          </p>
          <p style={{ color: 'var(--text-mid)' }}>{summary}</p>
        </div>
      ) : (
        <p className="text-[11px]" style={{ color: 'var(--text-mid)' }}>
          Recherchez par code postal ou utilisez la carte pour choisir votre Point Relais.
        </p>
      )}
      <div id={`mr-zone-${zoneId}`} className="mondial-relay-picker__zone" />
    </div>
  )
}
