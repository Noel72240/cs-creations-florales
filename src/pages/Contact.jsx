import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import SocialIconLinks from '../components/SocialIconLinks'
import { useSiteConfig } from '../context/SiteContentContext'
import { P, w1200 } from '../data/flowerPhotos'

export default function Contact() {
  const location = useLocation()
  const { content } = useSiteConfig()
  const site = content.site
  const contactInfo = content.contact
  const ft = content.footer

  const coordItems = useMemo(
    () => [
      { icon: '📍', label: 'Adresse', content: contactInfo.addressLine, href: null },
      { icon: '📞', label: 'Téléphone', content: site.phoneDisplay, href: site.phoneHref },
      { icon: '✉️', label: 'Email', content: site.email, href: `mailto:${site.email}` },
      { icon: '🕐', label: 'Disponibilités', content: contactInfo.availability, href: null },
    ],
    [contactInfo.addressLine, contactInfo.availability, site.email, site.phoneDisplay, site.phoneHref],
  )

  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', sujet: '', message: '', rgpd: false })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const prefillMessage = location.state?.prefillMessage
  const prefillSujet = location.state?.prefillSujet

  useEffect(() => {
    if (prefillMessage) {
      setForm((prev) => ({
        ...prev,
        message: prefillMessage,
        sujet: prefillSujet || prev.sujet || 'Commande (panier)',
      }))
    }
  }, [location.key, prefillMessage, prefillSujet])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.rgpd) return
    setLoading(true)
    // Simulation d'envoi (à connecter à votre backend / Formspree / EmailJS)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <>
      <div>
        <PageHeader
          title="Nous contacter"
          subtitle="Parlons de votre projet"
          image={w1200(P.peonies)}
        />
      </div>

      <section className="contact-page py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Coordonnées */}
            <div className="lg:col-span-1">
              <h2 className="font-heading text-2xl mb-6" style={{ color: 'var(--violet)' }}>
                Retrouvez-moi
              </h2>
              <div className="space-y-6">
                {coordItems.map(({ icon, label, content: line, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base"
                      style={{ background: 'rgba(240,210,221,0.3)' }}
                    >
                      {icon}
                    </div>
                    <div>
                      <p className="font-refined text-base font-semibold tracking-wide mb-0.5" style={{ color: 'var(--mauve)' }}>{label}</p>
                      {href
                        ? <a href={href} className="font-refined text-sm hover:text-mauve transition-colors" style={{ color: 'var(--text-dark)' }}>{line}</a>
                        : <p className="font-refined text-sm" style={{ color: 'var(--text-dark)' }}>{line}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Paiement SumUp */}
              <div className="mt-8 p-4 rounded-xl border border-mauve-light/30" style={{ background: 'rgba(240,210,221,0.12)' }}>
                <p className="font-heading text-sm mb-2" style={{ color: 'var(--violet)' }}>Paiement en ligne</p>
                <p className="font-refined text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                  Après validation de votre devis, vous pouvez régler par carte sur la page sécurisée SumUp.
                </p>
                <Link to="/paiement" className="btn-outline btn-contact-secondary inline-block text-xs py-2 px-4 w-full text-center">
                  Voir la page Paiement
                </Link>
              </div>

              {/* Réseaux sociaux */}
              <div className="mt-8 pt-8 border-t border-mauve-light/30">
                <p className="font-refined text-xs font-semibold tracking-wide mb-4" style={{ color: 'var(--mauve)' }}>Suivez-moi</p>
                <SocialIconLinks
                  facebookUrl={ft.facebookUrl}
                  instagramUrl={ft.instagramUrl}
                  tiktokUrl={ft.tiktokUrl}
                />
              </div>
            </div>

            {/* Formulaire */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="text-5xl mb-4">✿</div>
                  <h3 className="font-heading text-2xl mb-3" style={{ color: 'var(--violet)' }}>
                    Message envoyé !
                  </h3>
                  <p className="font-refined text-sm" style={{ color: 'var(--text-mid)' }}>
                    Merci {form.prenom}, je vous répondrai sous 24 heures. À très vite !
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>Prénom *</label>
                      <input type="text" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Votre prénom" className="form-field" required />
                    </div>
                    <div>
                      <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>Nom *</label>
                      <input type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Votre nom" className="form-field" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>Email *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="votre@email.fr" className="form-field" required />
                    </div>
                    <div>
                      <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>Téléphone</label>
                      <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} placeholder="06 XX XX XX XX" className="form-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>Sujet</label>
                    <select name="sujet" value={form.sujet} onChange={handleChange} className="form-field">
                      <option value="">Choisir un sujet</option>
                      <option>Commande (panier)</option>
                      <option>Demande de devis — Mariage</option>
                      <option>Demande de devis — Anniversaire</option>
                      <option>Demande de devis — Baptême / Communion</option>
                      <option>Demande de devis — Création funéraire</option>
                      <option>Demande de devis — Personnalisation</option>
                      <option>Renseignement général</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Décrivez votre projet, la date souhaitée, vos couleurs préférées..." className="form-field" required />
                  </div>

                  {/* Mention RGPD */}
                  <div className="p-4 rounded-xl text-xs font-refined leading-relaxed" style={{ background: 'rgba(240,210,221,0.15)', color: 'var(--text-mid)' }}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" name="rgpd" checked={form.rgpd} onChange={handleChange} className="mt-0.5 accent-mauve shrink-0" required />
                      <span>
                        J'accepte que mes données personnelles (nom, prénom, email, téléphone, message) soient collectées par <strong style={{ color: 'var(--violet)' }}>{site.ownerFullName} — {site.businessName}</strong> dans le seul but de traiter ma demande de contact ou de devis. Ces données ne seront pas transmises à des tiers et seront conservées pendant 3 ans maximum. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression en écrivant à <a href={`mailto:${site.email}`} style={{ color: 'var(--mauve)' }}>{site.email}</a>. *
                      </span>
                    </label>
                  </div>

                  <button type="submit" disabled={!form.rgpd || loading} className="btn-primary btn-contact-submit w-full py-3.5">
                    {loading ? 'Envoi en cours…' : 'Envoyer mon message ✿'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
