import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import { P, w1200 } from '../../data/flowerPhotos'

export default function Connexion() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/compte'
  const { login, isAuthenticated } = useCustomerAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    const res = await login({ email: form.email, password: form.password })
    setLoading(false)
    if (res.ok) {
      navigate(from, { replace: true })
    } else {
      setErr(res.error || 'Connexion impossible.')
    }
  }

  return (
    <>
      <PageHeader title="Connexion" subtitle="Espace client" image={w1200(P.peonies)} />
      <section className="contact-page py-16 px-4" style={{ background: 'var(--blanc)' }}>
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="form-field"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block font-refined text-base font-semibold tracking-wide mb-2" style={{ color: 'var(--mauve)' }}>
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="form-field"
                required
                autoComplete="current-password"
              />
            </div>
            {err && (
              <p className="text-sm font-refined p-3 rounded-xl" style={{ background: 'rgba(220,100,120,0.12)', color: 'var(--violet)' }}>
                {err}
              </p>
            )}
            <button type="submit" disabled={loading} className="btn-primary btn-contact-submit w-full py-3.5">
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
          <p className="text-center mt-8 font-refined text-sm" style={{ color: 'var(--text-mid)' }}>
            Pas encore de compte ?{' '}
            <Link to="/compte/inscription" style={{ color: 'var(--mauve)' }} className="font-semibold underline-offset-2 hover:underline">
              S’inscrire
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
