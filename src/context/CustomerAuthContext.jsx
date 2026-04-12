import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { hashPassword, verifyPassword } from '../utils/customerAuthCrypto'

const USERS_KEY = 'cs_customer_accounts_v1'
const SESSION_KEY = 'cs_customer_session_v1'

const CustomerAuthContext = createContext(null)

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {
    /* quota */
  }
}

function loadSessionRaw() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    if (!s?.userId || !s?.email) return null
    return s
  } catch {
    return null
  }
}

function saveSession(session) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    /* */
  }
}

function getInitialSession() {
  const s = loadSessionRaw()
  if (!s) return null
  const u = loadUsers().find((x) => x.id === s.userId && x.email === s.email)
  if (!u) {
    saveSession(null)
    return null
  }
  return {
    userId: u.id,
    email: u.email,
    firstName: u.firstName || '',
    lastName: u.lastName || '',
    phone: u.phone || '',
  }
}

export function CustomerAuthProvider({ children }) {
  const [session, setSession] = useState(() => getInitialSession())

  const register = useCallback(
    async ({ email, password, firstName, lastName, phone }) => {
      const em = String(email || '')
        .trim()
        .toLowerCase()
      if (!em || !em.includes('@')) return { ok: false, error: 'Adresse e-mail invalide.' }
      if (String(password || '').length < 8) return { ok: false, error: 'Le mot de passe doit contenir au moins 8 caractères.' }

      const list = loadUsers()
      if (list.some((u) => u.email === em)) return { ok: false, error: 'Un compte existe déjà avec cette adresse e-mail.' }

      const passwordHash = await hashPassword(password)
      const user = {
        id: crypto.randomUUID(),
        email: em,
        passwordHash,
        firstName: String(firstName || '').trim(),
        lastName: String(lastName || '').trim(),
        phone: String(phone || '').trim(),
        createdAt: new Date().toISOString(),
      }
      list.push(user)
      saveUsers(list)

      const sess = {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      }
      saveSession(sess)
      setSession(sess)
      return { ok: true }
    },
    [],
  )

  const login = useCallback(async ({ email, password }) => {
    const em = String(email || '')
      .trim()
      .toLowerCase()
    const list = loadUsers()
    const user = list.find((u) => u.email === em)
    if (!user) return { ok: false, error: 'E-mail ou mot de passe incorrect.' }
    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) return { ok: false, error: 'E-mail ou mot de passe incorrect.' }

    const sess = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
    }
    saveSession(sess)
    setSession(sess)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    saveSession(null)
    setSession(null)
  }, [])

  const updateProfile = useCallback(
    ({ firstName, lastName, phone }) => {
      if (!session?.userId) return { ok: false, error: 'Non connecté.' }
      const list = loadUsers()
      const idx = list.findIndex((u) => u.id === session.userId)
      if (idx === -1) return { ok: false, error: 'Compte introuvable.' }
      list[idx] = {
        ...list[idx],
        firstName: String(firstName || '').trim(),
        lastName: String(lastName || '').trim(),
        phone: String(phone || '').trim(),
      }
      saveUsers(list)
      const sess = {
        ...session,
        firstName: list[idx].firstName,
        lastName: list[idx].lastName,
        phone: list[idx].phone,
      }
      saveSession(sess)
      setSession(sess)
      return { ok: true }
    },
    [session],
  )

  const value = useMemo(
    () => ({
      user: session,
      isAuthenticated: Boolean(session?.userId),
      register,
      login,
      logout,
      updateProfile,
    }),
    [session, register, login, logout, updateProfile],
  )

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext)
  if (!ctx) throw new Error('useCustomerAuth doit être utilisé dans CustomerAuthProvider')
  return ctx
}
