import { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import { P, w1200 } from '../../data/flowerPhotos'

export default function MonCompte() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, updateProfile } = useCustomerAuth()
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  })
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
    })
  }, [user])

  if (!isAuthenticated || !user) {
    return <Navigate to="/compte/connexion" replace state={{ from: { pathname: '/compte' } }} />
  }

  const handleSave = (e) => {
    e.preventDefault()
    setMsg('')
    setSaving(true)
    const res = updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
    })
    setSaving(false)
    if (res.ok) setMsg('Profil enregistré.')
    else setMsg(res.error || 'Erreur.')
  }

  return (
    <>
      <PageHeader title="Mon compte" subtitle={`Bonjour ${user.firstName || user.email}`} image={w1200(P.vaseInterior)} />
      <section className="contact-page py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-xl mx-auto">
          <div className="p-5 rounded-2xl border border-mauve-light/30 mb-8" style={{ background: 'rgba(240,210,221,0.1)' }}>
            <p className="font-refined text-sm leading-relaxed" style={{ color: 'var(--text-mid)' }}>
              <strong style={{ color: 'var(--violet)' }}>E-mail :</strong> {user.email}
              <span className="block mt-2">
                Votre compte est stocké localement sur cet appareil. Pour un historique de commandes synchronisé partout,
                une évolution avec base de données sécurisée pourra être ajoutée.
              </span>
            </p>
          </div>

          <h2 className="font-heading text-xl mb-4" style={{ color: 'var(--violet)' }}>
            Mes coordonnées
          </h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>
                  Prénom
                </label>
                <input
                  className="form-field"
                  value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>
                  Nom
                </label>
                <input
                  className="form-field"
                  value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  autoComplete="family-name"
                />
              </div>
            </div>
            <div>
              <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>
                Téléphone
              </label>
              <input
                className="form-field"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                autoComplete="tel"
              />
            </div>
            {msg && (
              <p className="text-sm font-refined" style={{ color: 'var(--mauve)' }}>
                {msg}
              </p>
            )}
            <button type="submit" disabled={saving} className="btn-primary btn-contact-submit">
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-mauve-light/30">
            <h2 className="font-heading text-xl mb-4" style={{ color: 'var(--violet)' }}>
              Commandes & panier
            </h2>
            <p className="text-refined--sm mb-4" style={{ color: 'var(--text-mid)' }}>
              L’historique de commandes en ligne pourra être relié à ce compte lorsque la boutique sera connectée à un
              back-office.
            </p>
            <Link to="/panier" className="btn-outline inline-block">
              Voir mon panier
            </Link>
          </div>

          <div className="mt-10">
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="text-sm font-refined underline underline-offset-2"
              style={{ color: 'var(--text-mid)' }}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
