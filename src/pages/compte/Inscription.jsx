import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import { P, w1200 } from '../../data/flowerPhotos'

export default function Inscription() {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useCustomerAuth()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
  })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/compte" replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    if (form.password !== form.password2) {
      setErr('Les deux mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    const res = await register({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
    })
    setLoading(false)
    if (res.ok) {
      navigate('/compte', { replace: true })
    } else {
      setErr(res.error || 'Inscription impossible.')
    }
  }

  return (
    <>
      <PageHeader title="Créer un compte" subtitle="Espace client" image={w1200(P.bouquetSoft)} />
      <section className="contact-page py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-lg mx-auto">
          <p className="text-refined--sm text-center mb-8" style={{ color: 'var(--text-mid)' }}>
            Créez un compte pour retrouver vos informations plus facilement lors de vos commandes. Les données sont
            enregistrées dans votre navigateur sur cet appareil — pour un compte partagé entre appareils, une solution
            avec serveur sécurisé sera nécessaire plus tard.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>
                  Prénom *
                </label>
                <input name="firstName" value={form.firstName} onChange={handleChange} className="form-field" required autoComplete="given-name" />
              </div>
              <div>
                <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>
                  Nom *
                </label>
                <input name="lastName" value={form.lastName} onChange={handleChange} className="form-field" required autoComplete="family-name" />
              </div>
            </div>
            <div>
              <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>
                E-mail *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-field"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>
                Téléphone (optionnel)
              </label>
              <input name="phone" value={form.phone} onChange={handleChange} className="form-field" autoComplete="tel" />
            </div>
            <div>
              <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>
                Mot de passe * (min. 8 caractères)
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-field"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                name="password2"
                value={form.password2}
                onChange={handleChange}
                className="form-field"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            {err && (
              <p className="text-sm font-refined p-3 rounded-xl" style={{ background: 'rgba(220,100,120,0.12)', color: 'var(--violet)' }}>
                {err}
              </p>
            )}
            <button type="submit" disabled={loading} className="btn-primary btn-contact-submit w-full py-3.5">
              {loading ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>
          <p className="text-center mt-8 font-refined text-sm" style={{ color: 'var(--text-mid)' }}>
            Déjà un compte ?{' '}
            <Link to="/compte/connexion" style={{ color: 'var(--mauve)' }} className="font-semibold underline-offset-2 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
