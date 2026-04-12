import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../context/SiteContentContext'
import { MAX_PAGE_ARTICLES } from '../data/siteContent.defaults'
import { PHOTO_KEY_OPTIONS } from '../data/homePhotos'
import { resolveBackgroundSrc, resolvePhotoSrc } from '../data/photoResolver'

const AUTH_KEY = 'cs_admin_auth'

/** Réduit la taille pour le stockage local (localStorage). */
function imageFileToCompressedDataUrl(file, maxW = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let w = img.width
      let h = img.height
      if (w > maxW) {
        h = Math.round((h * maxW) / w)
        w = maxW
      }
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('canvas'))
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('load'))
    }
    img.src = url
  })
}

async function fileToGallerySrc(file) {
  if (!file || !file.type.startsWith('image/')) return undefined
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve(String(r.result))
      r.onerror = reject
      r.readAsDataURL(file)
    })
  }
  try {
    return await imageFileToCompressedDataUrl(file)
  } catch {
    return new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve(String(r.result))
      r.onerror = reject
      r.readAsDataURL(file)
    })
  }
}

/**
 * Compression forte pour les articles boutique (localStorage ~5 Mo au total).
 * Évite le fallback « fichier entier en base64 » qui fait exploser la taille.
 */
async function fileToArticleImageSrc(file) {
  if (!file || !file.type.startsWith('image/')) return undefined
  if (file.type === 'image/svg+xml') {
    if (file.size > 120_000) return undefined
    return new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve(String(r.result))
      r.onerror = reject
      r.readAsDataURL(file)
    })
  }
  const attempts = [
    [720, 0.68],
    [560, 0.62],
    [480, 0.55],
  ]
  for (const [maxW, q] of attempts) {
    try {
      const url = await imageFileToCompressedDataUrl(file, maxW, q)
      if (url && url.length < 950_000) return url
    } catch {
      /* try next */
    }
  }
  return undefined
}

function computeFullName(first, last) {
  return `${first || ''} ${last || ''}`.trim()
}

export default function Admin() {
  const { content, save, reset, exportJson, importJson, contentDriver } = useSiteContent()
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD?.trim()
  const [auth, setAuth] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1')
  const [pwd, setPwd] = useState('')
  const [tab, setTab] = useState('identity')
  const [articlePageKey, setArticlePageKey] = useState('evenementsFloraux')
  const [msg, setMsg] = useState('')
  const [importText, setImportText] = useState('')
  const coupsDraftRef = useRef(null)
  const prestationsDraftRef = useRef(null)
  const heroBackgroundDraftRef = useRef({
    backgroundSrc: '',
    backgroundPhotoKey: '',
  })
  const handleCoupsDraft = useCallback((next) => {
    coupsDraftRef.current = next
  }, [])
  const handlePrestationsDraft = useCallback((next) => {
    prestationsDraftRef.current = next
  }, [])
  const handleHeroBackgroundDraft = useCallback((next) => {
    heroBackgroundDraftRef.current = next
  }, [])

  useEffect(() => {
    heroBackgroundDraftRef.current = {
      backgroundSrc: content.home.hero.backgroundSrc || '',
      backgroundPhotoKey: content.home.hero.backgroundPhotoKey || '',
    }
  }, [content.home.hero.backgroundSrc, content.home.hero.backgroundPhotoKey])

  /** Doit rester avant tout return — sinon l’ordre des hooks change après connexion (écran vide sans F5). */
  useEffect(() => {
    if (!auth || tab !== 'home') return
    coupsDraftRef.current = content.home.coupsDeCoeur
  }, [auth, tab, content.home.coupsDeCoeur])

  useEffect(() => {
    if (!auth || tab !== 'home') return
    prestationsDraftRef.current = content.home.prestations
  }, [auth, tab, content.home.prestations])

  const login = (e) => {
    e.preventDefault()
    if (!adminPassword) {
      setMsg('Admin désactivé : ajoutez VITE_ADMIN_PASSWORD dans .env')
      return
    }
    if (pwd === adminPassword) {
      sessionStorage.setItem(AUTH_KEY, '1')
      setAuth(true)
      setPwd('')
      setMsg('')
    } else {
      setMsg('Mot de passe incorrect.')
    }
  }

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setAuth(false)
  }

  const handleSaveIdentity = useCallback(
    (e) => {
      e.preventDefault()
      const fd = new FormData(e.target)
      const site = {
        ownerFirstName: fd.get('ownerFirstName')?.trim() || '',
        ownerLastName: fd.get('ownerLastName')?.trim() || '',
        businessName: fd.get('businessName')?.trim() || '',
        city: fd.get('city')?.trim() || '',
        postalCode: fd.get('postalCode')?.trim() || '',
        region: fd.get('region')?.trim() || '',
        email: fd.get('email')?.trim() || '',
        phoneDisplay: fd.get('phoneDisplay')?.trim() || '',
        phoneHref: fd.get('phoneHref')?.trim() || '',
      }
      site.ownerFullName = computeFullName(site.ownerFirstName, site.ownerLastName)
      const webDev = {
        contactName: fd.get('contactName')?.trim() || '',
        company: fd.get('company')?.trim() || '',
        legalForm: fd.get('legalForm')?.trim() || '',
        addressLine: fd.get('addressLine')?.trim() || '',
        city: fd.get('wd_city')?.trim() || '',
        postalCode: fd.get('wd_postalCode')?.trim() || '',
        phoneDisplay: fd.get('wd_phoneDisplay')?.trim() || '',
        phoneHref: fd.get('wd_phoneHref')?.trim() || '',
        email: fd.get('wd_email')?.trim() || '',
        siret: fd.get('siret')?.trim() || '',
      }
      const sumupPaymentUrl = fd.get('sumupPaymentUrl')?.trim() || ''
      save({ site, webDev, sumupPaymentUrl })
      setMsg('Enregistré.')
    },
    [save],
  )

  const handleSaveHome = useCallback(
    (e) => {
      e.preventDefault()
      const fd = new FormData(e.target)
      const intro = {
        headline: fd.get('intro_headline')?.trim() || '',
        tagline: fd.get('intro_tagline')?.trim() || '',
        paragraph: fd.get('intro_paragraph')?.trim() || '',
      }
      const bgDraft = heroBackgroundDraftRef.current || {}
      const hero = {
        pretitle: fd.get('hero_pretitle') || '',
        titleLine1: fd.get('hero_title1') || '',
        titleLine2: fd.get('hero_title2') || '',
        searchPlaceholder: fd.get('hero_search') || '',
        searchHint: fd.get('hero_searchHint') || '',
        ctaPrimaryLabel: fd.get('hero_cta1') || '',
        ctaPrimaryPath: fd.get('hero_cta1p') || '',
        ctaSecondaryLabel: fd.get('hero_cta2') || '',
        ctaSecondaryPath: fd.get('hero_cta2p') || '',
        scrollLabel: fd.get('hero_scroll') || '',
        backgroundSrc: bgDraft.backgroundSrc ?? '',
        backgroundPhotoKey: bgDraft.backgroundPhotoKey ?? '',
      }
      const quiSuisJe = {
        sectionPretitle: fd.get('qs_pretitle') || '',
        sectionTitle: fd.get('qs_title') || '',
        badgeTitle: fd.get('qs_badgeT') || '',
        badgeLine: fd.get('qs_badgeL') || '',
        ctaLabel: fd.get('qs_cta') || '',
        paragraphs: (fd.get('qs_paragraphs') || '')
          .split(/\n\n+/)
          .map((s) => s.trim())
          .filter(Boolean),
      }
      const moto = {
        overlayTitle: fd.get('moto_overlay') || '',
        pretitle: fd.get('moto_pre') || '',
        title: fd.get('moto_title') || '',
        tip: fd.get('moto_tip') || '',
        ctaPrimary: fd.get('moto_cta1') || '',
        ctaSecondary: fd.get('moto_cta2') || '',
        paragraphs: (fd.get('moto_paragraphs') || '')
          .split(/\n\n+/)
          .map((s) => s.trim())
          .filter(Boolean),
      }
      const coupsDeCoeur = coupsDraftRef.current || content.home.coupsDeCoeur
      const prestations = prestationsDraftRef.current || content.home.prestations
      const contactStrip = {
        pretitle: fd.get('cs_pre') || '',
        title: fd.get('cs_title') || '',
        subtitle: fd.get('cs_sub') || '',
        ctaLabel: fd.get('cs_cta') || '',
        phoneCtaPrefix: fd.get('cs_phone') || '',
      }
      save({
        home: {
          intro,
          hero,
          quiSuisJe,
          moto,
          coupsDeCoeur,
          prestations,
          contactStrip,
        },
      })
      setMsg('Enregistré.')
    },
    [save, content.home.coupsDeCoeur, content.home.prestations],
  )

  const handleSaveFooter = useCallback(
    (e) => {
      e.preventDefault()
      const fd = new FormData(e.target)
      save({
        navbar: {
          topBarMessage: fd.get('topBar') || '',
          promoBanner: {
            enabled: fd.get('promo_enabled') === 'on',
            text: fd.get('promo_text') || '',
            code: fd.get('promo_code')?.trim() || '',
            fontScale: (() => {
              const v = parseFloat(fd.get('promo_font_scale'))
              if (!Number.isFinite(v)) return 1.08
              return Math.min(1.5, Math.max(0.75, v))
            })(),
          },
        },
        footer: {
          brandTitle: fd.get('ft_brand') || '',
          brandLead: fd.get('ft_lead') || '',
          paymentWithSumup: fd.get('ft_pay1') || '',
          paymentWithoutSumup: fd.get('ft_pay0') || '',
          facebookUrl: fd.get('fb') || '',
          instagramUrl: fd.get('ig') || '',
          tiktokUrl: fd.get('tt') || '',
        },
      })
      setMsg('Enregistré.')
    },
    [save],
  )

  const handleSaveContact = useCallback(
    (e) => {
      e.preventDefault()
      const fd = new FormData(e.target)
      save({
        contact: {
          addressLine: fd.get('addr') || '',
          availability: fd.get('avail') || '',
        },
      })
      setMsg('Enregistré.')
    },
    [save],
  )

  const doImport = () => {
    try {
      importJson(importText)
      setMsg('Import OK — rechargez la page si besoin.')
      setImportText('')
    } catch {
      setMsg('JSON invalide.')
    }
  }

  if (!adminPassword) {
    return (
      <div className="admin-page font-sans pt-6 px-4 pb-20 max-w-lg mx-auto">
        <h1 className="text-2xl mb-4" style={{ color: 'var(--violet)' }}>Admin</h1>
        <p className="text-sm" style={{ color: 'var(--text-mid)' }}>
          Ajoutez <code className="text-xs">VITE_ADMIN_PASSWORD=votre_mot_de_passe</code> dans le fichier <code>.env</code> à la racine du projet, puis redémarrez le serveur de dev.
        </p>
        <Link to="/" className="btn-outline inline-block mt-6 text-xs">← Retour</Link>
      </div>
    )
  }

  if (!auth) {
    return (
      <div className="admin-page font-sans pt-6 px-4 pb-20 max-w-sm mx-auto">
        <h1 className="text-2xl mb-6" style={{ color: 'var(--violet)' }}>Connexion admin</h1>
        <form onSubmit={login} className="space-y-4">
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="form-field"
            placeholder="Mot de passe"
            autoComplete="current-password"
          />
          <button type="submit" className="btn-primary w-full">Entrer</button>
        </form>
        {msg && <p className="text-sm mt-3" style={{ color: 'var(--mauve)' }}>{msg}</p>}
        <Link to="/" className="inline-block mt-8 text-xs" style={{ color: 'var(--text-mid)' }}>← Retour au site</Link>
      </div>
    )
  }

  const c = content
  const h = c.home

  return (
    <div className="admin-page font-sans pt-24 pb-20 px-4 max-w-4xl mx-auto text-sm" style={{ color: 'var(--text-mid)' }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--violet)' }}>Administration du site</h1>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportJson} className="btn-outline text-xs py-2 px-4">Exporter JSON</button>
          <button type="button" onClick={() => { reset(); setMsg('Réinitialisé (stockage local).') }} className="btn-outline text-xs py-2 px-4">Réinitialiser</button>
          <button type="button" onClick={logout} className="btn-outline text-xs py-2 px-4">Déconnexion</button>
          <Link to="/" className="btn-primary text-xs py-2 px-4">Voir le site</Link>
        </div>
      </div>

      {msg && <p className="mb-4 text-xs" style={{ color: 'var(--violet)' }}>{msg}</p>}

      <p className="text-xs mb-6 leading-relaxed">
        {contentDriver === 'supabase' ? (
          <>
            Contenu : <strong>Supabase</strong> (synchronisation en arrière-plan) + copie locale dans le navigateur. Vérifiez les politiques RLS et la table <code className="text-[11px]">site_content</code> (voir <code className="text-[11px]">src/services/siteContentSupabase.js</code>).
          </>
        ) : (
          <>
            Les modifications sont enregistrées dans le navigateur (localStorage). Pour le site en ligne, exportez le JSON et placez-le dans <code>public/site-content.json</code>, puis déployez — ou passez à <strong>Supabase</strong> (<code className="text-[11px]">VITE_CONTENT_DRIVER=supabase</code> sur Vercel).
          </>
        )}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {['identity', 'home', 'articles', 'footer', 'contact', 'import'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setMsg('') }}
            className={`text-xs py-2 px-3 rounded-full border ${tab === t ? 'bg-mauve text-white border-mauve' : 'border-mauve-light/40'}`}
          >
            {t === 'identity' && 'Identité & légal'}
            {t === 'home' && 'Accueil'}
            {t === 'articles' && 'Articles (boutique)'}
            {t === 'footer' && 'Menu & pied de page'}
            {t === 'contact' && 'Contact (page)'}
            {t === 'import' && 'Import / export'}
          </button>
        ))}
      </div>

      {tab === 'identity' && (
        <form onSubmit={handleSaveIdentity} className="space-y-4">
          <h2 className="text-lg" style={{ color: 'var(--violet)' }}>Entreprise</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">Prénom <input name="ownerFirstName" defaultValue={c.site.ownerFirstName} className="form-field mt-1" /></label>
            <label className="block">Nom <input name="ownerLastName" defaultValue={c.site.ownerLastName} className="form-field mt-1" /></label>
            <label className="block sm:col-span-2">Raison sociale <input name="businessName" defaultValue={c.site.businessName} className="form-field mt-1" /></label>
            <label className="block">Ville <input name="city" defaultValue={c.site.city} className="form-field mt-1" /></label>
            <label className="block">Code postal <input name="postalCode" defaultValue={c.site.postalCode} className="form-field mt-1" /></label>
            <label className="block sm:col-span-2">Région <input name="region" defaultValue={c.site.region} className="form-field mt-1" /></label>
            <label className="block sm:col-span-2">Email <input name="email" type="email" defaultValue={c.site.email} className="form-field mt-1" /></label>
            <label className="block">Téléphone (affichage) <input name="phoneDisplay" defaultValue={c.site.phoneDisplay} className="form-field mt-1" /></label>
            <label className="block">Lien tel <input name="phoneHref" defaultValue={c.site.phoneHref} className="form-field mt-1" placeholder="tel:+33..." /></label>
          </div>
          <h2 className="text-lg pt-4" style={{ color: 'var(--violet)' }}>Agence web (mentions)</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">Contact <input name="contactName" defaultValue={c.webDev.contactName} className="form-field mt-1" /></label>
            <label className="block">Entreprise <input name="company" defaultValue={c.webDev.company} className="form-field mt-1" /></label>
            <label className="block">Forme juridique <input name="legalForm" defaultValue={c.webDev.legalForm} className="form-field mt-1" /></label>
            <label className="block sm:col-span-2">Adresse <input name="addressLine" defaultValue={c.webDev.addressLine} className="form-field mt-1" /></label>
            <label className="block">Ville <input name="wd_city" defaultValue={c.webDev.city} className="form-field mt-1" /></label>
            <label className="block">CP <input name="wd_postalCode" defaultValue={c.webDev.postalCode} className="form-field mt-1" /></label>
            <label className="block">Tél <input name="wd_phoneDisplay" defaultValue={c.webDev.phoneDisplay} className="form-field mt-1" /></label>
            <label className="block">Lien tel <input name="wd_phoneHref" defaultValue={c.webDev.phoneHref} className="form-field mt-1" /></label>
            <label className="block sm:col-span-2">Email <input name="wd_email" type="email" defaultValue={c.webDev.email} className="form-field mt-1" /></label>
            <label className="block">SIRET <input name="siret" defaultValue={c.webDev.siret} className="form-field mt-1" /></label>
          </div>
          <h2 className="text-lg pt-4" style={{ color: 'var(--violet)' }}>Paiement SumUp</h2>
          <label className="block">URL lien de paiement (optionnel, remplace .env) <input name="sumupPaymentUrl" defaultValue={c.sumupPaymentUrl || ''} className="form-field mt-1" placeholder="https://..." /></label>
          <button type="submit" className="btn-primary">Enregistrer</button>
        </form>
      )}

      {tab === 'home' && (
        <form onSubmit={handleSaveHome} className="space-y-6">
          <fieldset className="space-y-2">
            <legend className="text-lg mb-2" style={{ color: 'var(--violet)' }}>Hero</legend>
            <input name="hero_pretitle" defaultValue={h.hero.pretitle} className="form-field" placeholder="Sous-titre" />
            <input name="hero_title1" defaultValue={h.hero.titleLine1} className="form-field" placeholder="Titre ligne 1" />
            <input name="hero_title2" defaultValue={h.hero.titleLine2} className="form-field" placeholder="Titre ligne 2" />
            <input name="hero_search" defaultValue={h.hero.searchPlaceholder} className="form-field" placeholder="Placeholder recherche" />
            <input name="hero_searchHint" defaultValue={h.hero.searchHint} className="form-field" />
            <div className="grid sm:grid-cols-2 gap-2">
              <input name="hero_cta1" defaultValue={h.hero.ctaPrimaryLabel} className="form-field" />
              <input name="hero_cta1p" defaultValue={h.hero.ctaPrimaryPath} className="form-field" placeholder="chemin" />
              <input name="hero_cta2" defaultValue={h.hero.ctaSecondaryLabel} className="form-field" />
              <input name="hero_cta2p" defaultValue={h.hero.ctaSecondaryPath} className="form-field" />
            </div>
            <input name="hero_scroll" defaultValue={h.hero.scrollLabel} className="form-field" />
          </fieldset>

          <HeroBackgroundEditor initial={h.hero} onDraftChange={handleHeroBackgroundDraft} />

          <fieldset className="space-y-2">
            <legend className="text-lg mb-2" style={{ color: 'var(--violet)' }}>Texte d’intro (sous le bandeau hero)</legend>
            <p className="text-xs">Affiché avant « Mes réalisations / Coup de cœur ». Laissez vide pour masquer.</p>
            <input name="intro_headline" defaultValue={h.intro?.headline || ''} className="form-field" placeholder="ex. Créatrice florale en Sarthe" />
            <input name="intro_tagline" defaultValue={h.intro?.tagline || ''} className="form-field" placeholder="ex. Des fleurs qui racontent votre histoire." />
            <textarea name="intro_paragraph" rows={3} className="form-field" defaultValue={h.intro?.paragraph || ''} placeholder="Paragraphe" />
          </fieldset>

          <HomeCoupsEditor key={JSON.stringify(h.coupsDeCoeur)} initial={h.coupsDeCoeur} onDraftChange={handleCoupsDraft} />

          <HomePrestationsEditor key={JSON.stringify(h.prestations)} initial={h.prestations} onDraftChange={handlePrestationsDraft} />

          <fieldset className="space-y-2">
            <legend className="text-lg mb-2" style={{ color: 'var(--violet)' }}>Moto florale</legend>
            <input name="moto_overlay" defaultValue={h.moto.overlayTitle} className="form-field" />
            <input name="moto_pre" defaultValue={h.moto.pretitle} className="form-field" />
            <input name="moto_title" defaultValue={h.moto.title} className="form-field" />
            <textarea name="moto_paragraphs" rows={5} className="form-field" defaultValue={(h.moto.paragraphs || []).join('\n\n')} />
            <input name="moto_tip" defaultValue={h.moto.tip} className="form-field" />
            <div className="grid sm:grid-cols-2 gap-2">
              <input name="moto_cta1" defaultValue={h.moto.ctaPrimary} className="form-field" />
              <input name="moto_cta2" defaultValue={h.moto.ctaSecondary} className="form-field" />
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="text-lg mb-2" style={{ color: 'var(--violet)' }}>Qui suis-je ? (après les coups de cœur)</legend>
            <input name="qs_pretitle" defaultValue={h.quiSuisJe.sectionPretitle} className="form-field" />
            <input name="qs_title" defaultValue={h.quiSuisJe.sectionTitle} className="form-field" />
            <input name="qs_badgeT" defaultValue={h.quiSuisJe.badgeTitle} className="form-field" />
            <input name="qs_badgeL" defaultValue={h.quiSuisJe.badgeLine} className="form-field" />
            <label className="block text-xs">Paragraphes (séparés par une ligne vide). Utilisez {'{firstName}'} pour le prénom.</label>
            <textarea name="qs_paragraphs" rows={12} className="form-field" defaultValue={(h.quiSuisJe.paragraphs || []).join('\n\n')} />
            <input name="qs_cta" defaultValue={h.quiSuisJe.ctaLabel} className="form-field" />
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="text-lg mb-2" style={{ color: 'var(--violet)' }}>Bandeau contact (bas d’accueil)</legend>
            <input name="cs_pre" defaultValue={h.contactStrip.pretitle} className="form-field" />
            <input name="cs_title" defaultValue={h.contactStrip.title} className="form-field" />
            <input name="cs_sub" defaultValue={h.contactStrip.subtitle} className="form-field" />
            <input name="cs_cta" defaultValue={h.contactStrip.ctaLabel} className="form-field" />
            <input name="cs_phone" defaultValue={h.contactStrip.phoneCtaPrefix} className="form-field" placeholder="Préfixe bouton téléphone" />
          </fieldset>

          <button type="submit" className="btn-primary">Enregistrer l’accueil</button>
        </form>
      )}

      {tab === 'articles' && (
        <PageArticlesEditor
          pageKey={articlePageKey}
          setPageKey={setArticlePageKey}
          pageArticles={c.pageArticles}
          save={save}
          setMsg={setMsg}
        />
      )}

      {tab === 'footer' && (
        <form onSubmit={handleSaveFooter} className="space-y-3">
          <fieldset className="space-y-2">
            <legend className="text-lg mb-2" style={{ color: 'var(--violet)' }}>
              Bannière promo (tout en haut)
            </legend>
            <label className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                name="promo_enabled"
                defaultChecked={c.navbar.promoBanner?.enabled !== false}
                className="rounded border-mauve-light"
              />
              <span className="text-sm">Afficher la bannière promotionnelle</span>
            </label>
            <label className="block text-xs" style={{ color: 'var(--text-mid)' }}>
              Texte (manuscrite Great Vibes, fond fuchsia). Le code doit être identique au champ ci-dessous pour
              être mis en avant.
            </label>
            <textarea
              name="promo_text"
              rows={3}
              className="form-field mt-1"
              defaultValue={c.navbar.promoBanner?.text || ''}
              placeholder="Pour votre 1ère commande…"
            />
            <label className="block text-sm">Code promo (optionnel — surligné)
              <input
                name="promo_code"
                defaultValue={c.navbar.promoBanner?.code || ''}
                className="form-field mt-1"
                placeholder="Bienvenuecscreationflorale10"
              />
            </label>
            <label className="block text-sm">
              Taille du texte (1 = 100 %, un peu plus gros par défaut)
              <input
                type="number"
                name="promo_font_scale"
                min={0.75}
                max={1.5}
                step={0.05}
                defaultValue={c.navbar.promoBanner?.fontScale ?? 1.08}
                className="form-field mt-1 max-w-[10rem]"
              />
            </label>
            <p className="text-xs" style={{ color: 'var(--text-mid)' }}>
              Valeur entre 0,75 et 1,5. Augmentez pour un texte plus grand sur la bannière.
            </p>
          </fieldset>
          <label className="block">Barre du haut (menu)
            <input name="topBar" defaultValue={c.navbar.topBarMessage} className="form-field mt-1" />
          </label>
          <label className="block">Titre marque (footer)
            <input name="ft_brand" defaultValue={c.footer.brandTitle} className="form-field mt-1" />
          </label>
          <label className="block">Texte d’introduction
            <textarea name="ft_lead" rows={3} className="form-field mt-1" defaultValue={c.footer.brandLead} />
          </label>
          <label className="block">Texte paiement (avec lien SumUp)
            <textarea name="ft_pay1" rows={2} className="form-field mt-1" defaultValue={c.footer.paymentWithSumup} />
          </label>
          <label className="block">Texte paiement (sans lien SumUp)
            <textarea name="ft_pay0" rows={2} className="form-field mt-1" defaultValue={c.footer.paymentWithoutSumup} />
          </label>
          <label className="block">Facebook URL
            <input name="fb" defaultValue={c.footer.facebookUrl} className="form-field mt-1" />
          </label>
          <label className="block">Instagram URL
            <input name="ig" defaultValue={c.footer.instagramUrl} className="form-field mt-1" />
          </label>
          <label className="block">TikTok URL
            <input name="tt" defaultValue={c.footer.tiktokUrl || ''} className="form-field mt-1" placeholder="https://www.tiktok.com/@..." />
          </label>
          <button type="submit" className="btn-primary">Enregistrer</button>
        </form>
      )}

      {tab === 'contact' && (
        <form onSubmit={handleSaveContact} className="space-y-3">
          <label className="block">Adresse (ligne affichée)
            <input name="addr" defaultValue={c.contact.addressLine} className="form-field mt-1" />
          </label>
          <label className="block">Disponibilités
            <input name="avail" defaultValue={c.contact.availability} className="form-field mt-1" />
          </label>
          <button type="submit" className="btn-primary">Enregistrer</button>
          <p className="text-xs mt-4">
            Les emails / téléphone du bloc contact et le texte RGPD du formulaire sont liés à l’onglet Identité (nom, email, téléphone).
          </p>
        </form>
      )}

      {tab === 'import' && (
        <div className="space-y-4">
          <p className="text-xs">Collez un JSON complet (export) ou partiel (fusion).</p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={8}
            className="form-field font-mono text-xs"
            placeholder="{}"
          />
          <button type="button" onClick={doImport} className="btn-primary">Importer</button>
        </div>
      )}
    </div>
  )
}

function HeroBackgroundEditor({ initial, onDraftChange }) {
  const [src, setSrc] = useState(initial?.backgroundSrc || '')
  const [photoKey, setPhotoKey] = useState(initial?.backgroundPhotoKey || '')

  useEffect(() => {
    setSrc(initial?.backgroundSrc || '')
    setPhotoKey(initial?.backgroundPhotoKey || '')
  }, [initial?.backgroundSrc, initial?.backgroundPhotoKey])

  const pickImage = async (fileList) => {
    const file = fileList?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToGallerySrc(file)
      if (dataUrl) setSrc(dataUrl)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    onDraftChange({ backgroundSrc: src, backgroundPhotoKey: photoKey })
  }, [src, photoKey, onDraftChange])

  const previewSrc = resolveBackgroundSrc(src, photoKey)

  return (
    <fieldset className="space-y-3 rounded-xl border p-4" style={{ borderColor: 'rgba(139,75,106,0.25)', background: 'rgba(255,248,251,0.6)' }}>
      <legend className="text-lg mb-2" style={{ color: 'var(--violet)' }}>
        Fond du bandeau d’accueil
      </legend>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-mid)' }}>
        Par défaut : dégradé rose doux, sans image. Vous pouvez ajouter une image comme pour les galeries (fichier, URL ou
        chemin <code className="text-[11px]">/…</code> dans <code className="text-[11px]">public/</code>
        ), ou une clé Unsplash. Priorité hors admin :{' '}
        <code className="text-[11px]">VITE_HERO_BG</code>, puis <code className="text-[11px]">hero.png</code> /{' '}
        <code className="text-[11px]">hero.jpg</code> dans <code className="text-[11px]">public/</code>.
      </p>
      <label className="block">
        Clé photo (Unsplash) — si « src » vide
        <select className="form-field mt-1" value={photoKey} onChange={(e) => setPhotoKey(e.target.value)}>
          <option value="">— Dégradé (sans image) —</option>
          {PHOTO_KEY_OPTIONS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </label>
      <div className="block">
        <span className="block text-sm">Image depuis l’ordinateur</span>
        <span className="mt-1 flex flex-wrap items-center gap-2">
          <label className="btn-outline text-xs py-2 px-4 cursor-pointer inline-block mb-0">
            Parcourir…
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                pickImage(e.target.files)
                e.target.value = ''
              }}
            />
          </label>
          {src?.startsWith('data:') && (
            <button type="button" className="btn-outline text-[11px] py-2 px-3" onClick={() => setSrc('')}>
              Retirer l’image intégrée
            </button>
          )}
        </span>
      </div>
      <label className="block">
        src (optionnel — prioritaire sur la clé)
        <input
          className="form-field mt-1"
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          placeholder="https://... ou /mon-fond.jpg"
        />
      </label>
      <div className="flex flex-wrap items-start gap-3">
        {previewSrc ? (
          <img
            src={previewSrc}
            alt=""
            className="h-24 w-40 rounded-lg object-cover border border-mauve-light/30 shrink-0 bg-mauve-light/10"
          />
        ) : (
          <div
            className="h-24 w-40 rounded-lg border border-mauve-light/30 shrink-0 bg-gradient-to-br from-[#fff8fb] via-[#f7e9ef] to-[#f0d2dd]"
            aria-hidden="true"
          />
        )}
        <p className="text-[11px] leading-snug max-w-md" style={{ color: 'var(--text-mid)' }}>
          Aperçu du bandeau d’accueil. Sans image : dégradé comme sur le site. Les très grandes images peuvent remplir le
          stockage du navigateur : préférez un fichier dans <code className="text-[10px]">public/</code> et un chemin en
          src.
        </p>
      </div>
    </fieldset>
  )
}

function HomeCoupsEditor({ initial, onDraftChange }) {
  const [pretitle, setPretitle] = useState(initial?.pretitle || '')
  const [title, setTitle] = useState(initial?.title || '')
  const [intro, setIntro] = useState(initial?.intro || '')
  const [ctaLabel, setCtaLabel] = useState(initial?.ctaLabel || '')
  const [ctaPath, setCtaPath] = useState(initial?.ctaPath || '')
  const [items, setItems] = useState(() =>
    (initial?.items || []).map((it) => ({
      ...it,
      src: it.src || '',
      photoKey: it.photoKey || 'weddingBouquet',
      label: it.label || '',
    })),
  )

  const setField = (idx, key, value) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)))
  }

  const pickImage = async (idx, fileList) => {
    const file = fileList?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToGallerySrc(file)
      if (dataUrl) setField(idx, 'src', dataUrl)
    } catch {
      /* ignore */
    }
  }

  const addItem = () => {
    setItems((prev) => [...prev, { photoKey: 'weddingBouquet', label: 'Nouvelle image', src: '' }])
  }

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const move = (from, to) => {
    setItems((prev) => {
      const next = [...prev]
      const [it] = next.splice(from, 1)
      next.splice(to, 0, it)
      return next
    })
  }

  useEffect(() => {
    onDraftChange({
      pretitle,
      title,
      intro,
      ctaLabel,
      ctaPath,
      items: items.map((it) => ({
        photoKey: it.photoKey || 'weddingBouquet',
        label: it.label || '',
        src: it.src || '',
      })),
    })
  }, [pretitle, title, intro, ctaLabel, ctaPath, items, onDraftChange])

  return (
    <fieldset className="space-y-3">
      <legend className="text-lg mb-2" style={{ color: 'var(--violet)' }}>Coups de cœur (page d’accueil)</legend>
      <p className="text-xs leading-relaxed">
        Gérez le titre, le texte et chaque photo (clé Unsplash, fichier depuis l’ordinateur, ou URL / chemin <code>/...</code> dans « src »).
      </p>
      <input className="form-field" value={pretitle} onChange={(e) => setPretitle(e.target.value)} placeholder="Sous-titre (ex. Mes réalisations)" />
      <input className="form-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre (ex. Coup de cœur)" />
      <textarea className="form-field" rows={3} value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="Texte d’introduction" />
      <div className="grid sm:grid-cols-2 gap-2">
        <input className="form-field" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Libellé du bouton" />
        <input className="form-field" value={ctaPath} onChange={(e) => setCtaPath(e.target.value)} placeholder="/chemin" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-outline text-xs py-2 px-4" onClick={addItem}>
          + Ajouter une image
        </button>
      </div>
      <div className="space-y-4">
        {items.map((it, idx) => (
          <div key={idx} className="border border-mauve-light/30 rounded-xl p-3 space-y-2">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <p className="text-xs font-medium" style={{ color: 'var(--violet)' }}>
                Image {idx + 1}
              </p>
              <div className="flex gap-2">
                <button type="button" className="btn-outline text-[11px] py-1.5 px-3" disabled={idx === 0} onClick={() => move(idx, idx - 1)}>
                  ↑
                </button>
                <button
                  type="button"
                  className="btn-outline text-[11px] py-1.5 px-3"
                  disabled={idx === items.length - 1}
                  onClick={() => move(idx, idx + 1)}
                >
                  ↓
                </button>
                <button type="button" className="btn-outline text-[11px] py-1.5 px-3" onClick={() => removeItem(idx)}>
                  Supprimer
                </button>
              </div>
            </div>
            <label className="block">
              Légende
              <input className="form-field mt-1" value={it.label || ''} onChange={(e) => setField(idx, 'label', e.target.value)} />
            </label>
            <label className="block">
              Clé photo (Unsplash)
              <select className="form-field mt-1" value={it.photoKey || 'weddingBouquet'} onChange={(e) => setField(idx, 'photoKey', e.target.value)}>
                {PHOTO_KEY_OPTIONS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <div className="block">
              <span className="block text-sm">Image depuis l’ordinateur</span>
              <span className="mt-1 flex flex-wrap items-center gap-2">
                <label className="btn-outline text-xs py-2 px-4 cursor-pointer inline-block mb-0">
                  Parcourir…
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      pickImage(idx, e.target.files)
                      e.target.value = ''
                    }}
                  />
                </label>
                {it.src?.startsWith('data:') && (
                  <button type="button" className="btn-outline text-[11px] py-2 px-3" onClick={() => setField(idx, 'src', '')}>
                    Retirer l’image intégrée
                  </button>
                )}
              </span>
            </div>
            <label className="block">
              src (optionnel — prioritaire sur la clé)
              <input
                className="form-field mt-1"
                value={it.src || ''}
                onChange={(e) => setField(idx, 'src', e.target.value)}
                placeholder="https://... ou /dossier/photo.jpg"
              />
            </label>
            <div className="flex items-start gap-3">
              <img
                src={it.src?.trim() ? resolvePhotoSrc(it.src) : resolvePhotoSrc(it.photoKey)}
                alt=""
                className="h-20 w-28 rounded-lg object-cover border border-mauve-light/30 shrink-0 bg-mauve-light/10"
              />
              <p className="text-[11px] leading-snug" style={{ color: 'var(--text-mid)' }}>
                Aperçu : « src » si présent, sinon la clé Unsplash.
              </p>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  )
}

function HomePrestationsEditor({ initial, onDraftChange }) {
  const [pretitle, setPretitle] = useState(initial?.pretitle || '')
  const [title, setTitle] = useState(initial?.title || '')
  const [categories, setCategories] = useState(() =>
    (initial?.categories || []).map((c) => ({
      ...c,
      title: c.title || '',
      desc: c.desc || '',
      icon: c.icon || '',
      path: c.path || '',
      photoKey: c.photoKey || 'weddingTableFlorals',
      src: c.src || '',
    })),
  )

  const setField = (idx, key, value) => {
    setCategories((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)))
  }

  const pickImage = async (idx, fileList) => {
    const file = fileList?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToGallerySrc(file)
      if (dataUrl) setField(idx, 'src', dataUrl)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    onDraftChange({
      pretitle,
      title,
      categories: categories.map((c) => ({
        title: c.title || '',
        desc: c.desc || '',
        icon: c.icon || '',
        path: c.path || '',
        photoKey: c.photoKey || 'weddingTableFlorals',
        src: c.src || '',
      })),
    })
  }, [pretitle, title, categories, onDraftChange])

  return (
    <fieldset className="space-y-3">
      <legend className="text-lg mb-2" style={{ color: 'var(--violet)' }}>Prestations (cartes accueil)</legend>
      <p className="text-xs leading-relaxed">
        Comme pour les coups de cœur, vous pouvez choisir une image sur l’ordinateur (stockée dans le navigateur) ou saisir un <code>src</code> (URL / <code>/...</code>).
      </p>
      <input className="form-field" value={pretitle} onChange={(e) => setPretitle(e.target.value)} placeholder="Sous-titre" />
      <input className="form-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" />

      <div className="space-y-4">
        {categories.map((cat, i) => (
          <div key={i} className="border border-mauve-light/30 rounded-xl p-3 space-y-2">
            <p className="text-xs font-medium" style={{ color: 'var(--violet)' }}>Carte {i + 1}</p>
            <input className="form-field" value={cat.title} onChange={(e) => setField(i, 'title', e.target.value)} placeholder="Titre" />
            <textarea className="form-field" rows={2} value={cat.desc} onChange={(e) => setField(i, 'desc', e.target.value)} placeholder="Description" />
            <input className="form-field" value={cat.icon} onChange={(e) => setField(i, 'icon', e.target.value)} placeholder="Emoji" />
            <input className="form-field" value={cat.path} onChange={(e) => setField(i, 'path', e.target.value)} placeholder="/chemin" />
            <label className="block">
              Clé photo (Unsplash)
              <select className="form-field mt-1" value={cat.photoKey} onChange={(e) => setField(i, 'photoKey', e.target.value)}>
                {PHOTO_KEY_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </label>
            <div className="block">
              <span className="block text-sm">Image depuis l’ordinateur</span>
              <span className="mt-1 flex flex-wrap items-center gap-2">
                <label className="btn-outline text-xs py-2 px-4 cursor-pointer inline-block mb-0">
                  Parcourir…
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      pickImage(i, e.target.files)
                      e.target.value = ''
                    }}
                  />
                </label>
                {cat.src?.startsWith('data:') && (
                  <button type="button" className="btn-outline text-[11px] py-2 px-3" onClick={() => setField(i, 'src', '')}>
                    Retirer l’image intégrée
                  </button>
                )}
              </span>
            </div>
            <label className="block">
              src (optionnel — prioritaire sur la clé)
              <input className="form-field mt-1" value={cat.src || ''} onChange={(e) => setField(i, 'src', e.target.value)} placeholder="https://... ou /dossier/photo.jpg" />
            </label>
            <div className="flex items-start gap-3">
              <img
                src={cat.src?.trim() ? resolvePhotoSrc(cat.src) : resolvePhotoSrc(cat.photoKey)}
                alt=""
                className="h-20 w-28 rounded-lg object-cover border border-mauve-light/30 shrink-0 bg-mauve-light/10"
              />
              <p className="text-[11px] leading-snug" style={{ color: 'var(--text-mid)' }}>
                Aperçu : « src » si présent, sinon la clé Unsplash.
              </p>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  )
}

const ARTICLE_PAGE_OPTIONS = [
  { value: 'evenementsFloraux', label: 'Événements floraux (page)' },
  { value: 'creationsFlorales', label: 'Créations florales (page)' },
  { value: 'creationsFuneraires', label: 'Créations funéraires (page)' },
  { value: 'creationsSaisonnieres', label: 'Créations saisonnières (page)' },
  { value: 'personnalisation', label: 'Personnalisation (page)' },
  { value: 'mariage', label: 'Mariage' },
  { value: 'anniversaire', label: 'Anniversaire' },
  { value: 'baptemeCommunion', label: 'Baptême & Communion' },
  { value: 'paques', label: 'Pâques' },
  { value: 'noel', label: 'Noël' },
  { value: 'feteDesMeres', label: 'Fête des Mères' },
]

function emptyArticleItem() {
  return {
    id: `article-${Date.now()}`,
    title: '',
    description: '',
    price: 0,
    photoKey: 'weddingBouquet',
    src: '',
  }
}

function PageArticlesEditor({ pageKey, setPageKey, pageArticles, save, setMsg }) {
  const current = pageArticles?.[pageKey] || { sectionTitle: '', intro: '', items: [] }
  const [saveFeedback, setSaveFeedback] = useState(null)
  const [localTitle, setLocalTitle] = useState(current.sectionTitle || '')
  const [localIntro, setLocalIntro] = useState(current.intro || '')
  const [localItems, setLocalItems] = useState(() =>
    (current.items || []).slice(0, MAX_PAGE_ARTICLES).map((it) => ({ ...it, price: Number(it.price) || 0 })),
  )

  useEffect(() => {
    setSaveFeedback(null)
  }, [pageKey])

  useEffect(() => {
    const next = pageArticles?.[pageKey] || { sectionTitle: '', intro: '', items: [] }
    setLocalTitle(next.sectionTitle || '')
    setLocalIntro(next.intro || '')
    setLocalItems((next.items || []).slice(0, MAX_PAGE_ARTICLES).map((it) => ({ ...it, price: Number(it.price) || 0 })))
  }, [pageKey, pageArticles])

  const setField = (idx, key, value) => {
    setLocalItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)))
  }

  const addItem = () => {
    if (localItems.length >= MAX_PAGE_ARTICLES) return
    setLocalItems((prev) => [...prev, emptyArticleItem()])
  }

  const removeItem = (idx) => {
    setLocalItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const pickImage = async (idx, fileList) => {
    const file = fileList?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToArticleImageSrc(file)
      if (dataUrl) {
        setField(idx, 'src', dataUrl)
        setMsg('')
      } else {
        setMsg(
          'Image trop lourde même après réduction. Enregistrez le fichier dans le dossier public/ du site (ex. public/boutique/photo.jpg) et indiquez /boutique/photo.jpg dans le champ src.',
        )
      }
    } catch {
      setMsg('Impossible de lire cette image.')
    }
  }

  const savePage = () => {
    const items = localItems.slice(0, MAX_PAGE_ARTICLES).map((it) => ({
      id: String(it.id || '').trim() || `id-${Date.now()}`,
      title: String(it.title || '').trim(),
      description: String(it.description || '').trim(),
      price: Math.max(0, Math.round((Number(it.price) || 0) * 100) / 100),
      photoKey: String(it.photoKey || 'weddingBouquet').trim() || 'weddingBouquet',
      src: String(it.src || '').trim(),
    }))
    const ok = save({
      pageArticles: {
        [pageKey]: {
          sectionTitle: localTitle.trim(),
          intro: localIntro.trim(),
          items,
        },
      },
    })
    if (ok) {
      setMsg('Articles enregistrés pour cette page.')
      setSaveFeedback({ ok: true, text: 'Enregistré dans ce navigateur (localStorage).' })
    } else {
      setMsg(
        'Impossible d’enregistrer : stockage plein. Réduisez les images intégrées ou utilisez des fichiers dans public/.',
      )
      setSaveFeedback({
        ok: false,
        text: 'Échec : espace navigateur insuffisant ou sauvegarde bloquée. Utilisez des images dans public/ (chemins /…) plutôt que des photos intégrées.',
      })
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="text-xs leading-relaxed rounded-xl border p-4 space-y-2"
        style={{ borderColor: 'rgba(139,75,106,0.3)', background: 'rgba(240,210,221,0.18)', color: 'var(--text-mid)' }}
      >
        <p className="font-semibold" style={{ color: 'var(--violet)' }}>Voir les photos à jour sur le site public</p>
        <p>
          L’enregistrement ci-dessous va dans <strong>ce navigateur</strong> (localStorage). Vous les voyez tout de suite ici en visitant le site sur <strong>le même ordinateur / navigateur</strong>.
        </p>
        <p>
          Pour <strong>la mise en ligne</strong> (autres appareils, clients) : en haut de l’admin, cliquez <strong>Exporter JSON</strong>, remplacez le fichier{' '}
          <code className="text-[11px] bg-white/80 px-1 rounded">public/site-content.json</code> par ce fichier, puis reconstruisez et redéployez le site.
        </p>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-mid)' }}>
        Modifiez les fiches (photo, texte, prix) affichées sur chaque page rubrique — jusqu’à <strong>{MAX_PAGE_ARTICLES} articles</strong> par page.
        L’identifiant technique sert au panier : gardez-le stable si des clients ont déjà commandé.
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          Page
          <select className="form-field mt-1 min-w-[16rem]" value={pageKey} onChange={(e) => setPageKey(e.target.value)}>
            {ARTICLE_PAGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={savePage} className="btn-primary text-xs py-2 px-4">
          Enregistrer cette page
        </button>
      </div>

      {saveFeedback ? (
        <p
          className="text-sm font-medium rounded-lg px-3 py-2 border"
          role="status"
          style={{
            borderColor: saveFeedback.ok ? 'rgba(34, 139, 34, 0.45)' : 'rgba(192, 122, 151, 0.65)',
            background: saveFeedback.ok ? 'rgba(230, 255, 230, 0.5)' : 'rgba(255, 240, 245, 0.9)',
            color: saveFeedback.ok ? '#1d5a1d' : 'var(--violet)',
          }}
        >
          {saveFeedback.text}
        </p>
      ) : null}

      <div className="grid gap-3">
        <label className="block">
          Titre de la section
          <input className="form-field mt-1" value={localTitle} onChange={(e) => setLocalTitle(e.target.value)} placeholder="ex. Nos créations…" />
        </label>
        <label className="block">
          Introduction (sous le titre)
          <textarea className="form-field mt-1" rows={2} value={localIntro} onChange={(e) => setLocalIntro(e.target.value)} placeholder="Texte optionnel" />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium" style={{ color: 'var(--violet)' }}>
          Articles ({localItems.length}/{MAX_PAGE_ARTICLES})
        </p>
        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            className="btn-outline text-xs py-2 px-4"
            disabled={localItems.length >= MAX_PAGE_ARTICLES}
            onClick={addItem}
          >
            + Ajouter un article
          </button>
          {localItems.length >= MAX_PAGE_ARTICLES ? (
            <span className="text-[11px] max-w-[14rem] text-right" style={{ color: 'var(--mauve)' }}>
              Limite atteinte. Supprimez un article pour en ajouter un autre.
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        {localItems.map((it, idx) => (
          <div key={`${pageKey}-${idx}`} className="border border-mauve-light/30 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap justify-between gap-2 items-center">
              <span className="text-xs font-medium" style={{ color: 'var(--violet)' }}>
                Article {idx + 1}
              </span>
              <button type="button" className="btn-outline text-[11px] py-1.5 px-3" onClick={() => removeItem(idx)}>
                Supprimer
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <label className="block sm:col-span-2">
                Identifiant (panier / technique)
                <input className="form-field mt-1 font-mono text-xs" value={it.id || ''} onChange={(e) => setField(idx, 'id', e.target.value)} />
              </label>
              <label className="block sm:col-span-2">
                Titre
                <input className="form-field mt-1" value={it.title || ''} onChange={(e) => setField(idx, 'title', e.target.value)} />
              </label>
              <label className="block sm:col-span-2">
                Description
                <textarea className="form-field mt-1" rows={3} value={it.description || ''} onChange={(e) => setField(idx, 'description', e.target.value)} />
              </label>
              <label className="block">
                Prix (€)
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  className="form-field mt-1"
                  value={it.price === '' || it.price === undefined ? '' : it.price}
                  onChange={(e) => setField(idx, 'price', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                />
              </label>
              <label className="block">
                Clé photo (Unsplash)
                <select className="form-field mt-1" value={it.photoKey || 'weddingBouquet'} onChange={(e) => setField(idx, 'photoKey', e.target.value)}>
                  {PHOTO_KEY_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </label>
              <div className="sm:col-span-2 space-y-2">
                <span className="block text-sm">Image depuis l’ordinateur</span>
                <p className="text-[11px] leading-snug" style={{ color: 'var(--text-mid)' }}>
                  Les photos sont fortement réduites pour tenir dans le stockage du navigateur. Si l’enregistrement échoue encore, placez les fichiers dans{' '}
                  <code className="text-[10px]">public/</code> et mettez le chemin <code className="text-[10px]">/dossier/fichier.jpg</code> dans src.
                </p>
                <label className="btn-outline text-xs py-2 px-4 cursor-pointer inline-block">
                  Parcourir…
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      pickImage(idx, e.target.files)
                      e.target.value = ''
                    }}
                  />
                </label>
                {it.src?.startsWith('data:') && (
                  <button type="button" className="btn-outline text-[11px] py-2 px-3 ml-2" onClick={() => setField(idx, 'src', '')}>
                    Retirer l’image intégrée
                  </button>
                )}
                <label className="block">
                  src (optionnel — URL ou /chemin/public)
                  <input className="form-field mt-1" value={it.src || ''} onChange={(e) => setField(idx, 'src', e.target.value)} placeholder="vide = clé Unsplash" />
                </label>
                <div className="flex items-start gap-3">
                  <img
                    src={it.src?.trim() ? resolvePhotoSrc(it.src) : resolvePhotoSrc(it.photoKey)}
                    alt=""
                    className="h-24 w-36 rounded-lg object-cover border border-mauve-light/30 shrink-0 bg-mauve-light/10"
                  />
                  <p className="text-[11px] leading-snug" style={{ color: 'var(--text-mid)' }}>
                    Aperçu : « src » si renseigné, sinon la clé Unsplash.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={savePage} className="btn-primary">
        Enregistrer cette page
      </button>
    </div>
  )
}
