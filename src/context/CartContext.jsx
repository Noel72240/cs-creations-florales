import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { formatEuro } from '../utils/formatEuro'

const STORAGE_KEY = 'cs_cart_v1'

const CartContext = createContext(null)

function normalizeItem(raw) {
  const id = String(raw?.id ?? '').trim()
  if (!id) return null
  const title = String(raw?.title ?? 'Article').slice(0, 220)
  const price = Math.max(0, Number(raw?.price) || 0)
  let qty = parseInt(raw?.quantity, 10)
  if (!Number.isFinite(qty) || qty < 1) qty = 1
  if (qty > 99) qty = 99
  return {
    id,
    title,
    price,
    quantity: qty,
    imageUrl: raw?.imageUrl ? String(raw.imageUrl).slice(0, 500) : undefined,
    path: raw?.path ? String(raw.path).slice(0, 300) : undefined,
  }
}

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeItem).filter(Boolean)
  } catch {
    return []
  }
}

function persist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* quota / private mode */
  }
}

/** Texte prêt à coller dans le formulaire contact */
export function buildCartPrefillMessage(items) {
  if (!items?.length) return ''
  const lines = items.map(
    (i) => `• ${i.title} × ${i.quantity} — ${formatEuro(i.price * i.quantity)} (${formatEuro(i.price)} / unité)`,
  )
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  return [
    'Bonjour,',
    '',
    'Je souhaite vous contacter au sujet des articles suivants (panier sur le site) :',
    '',
    ...lines,
    '',
    `Total indicatif : ${formatEuro(total)}`,
    '',
    'Merci de me confirmer la disponibilité, les délais et les modalités de retrait ou de livraison.',
    '',
    'Cordialement',
  ].join('\n')
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadStored())

  useEffect(() => {
    persist(items)
  }, [items])

  const itemCount = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items])

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items])

  const addItem = useCallback((raw) => {
    const next = normalizeItem(raw)
    if (!next) return
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === next.id)
      if (idx === -1) return [...prev, next]
      const copy = [...prev]
      const merged = { ...copy[idx], quantity: Math.min(99, copy[idx].quantity + next.quantity) }
      copy[idx] = merged
      return copy
    })
  }, [])

  const setQuantity = useCallback((id, quantity) => {
    const q = parseInt(quantity, 10)
    if (!Number.isFinite(q) || q < 1) {
      setItems((prev) => prev.filter((p) => p.id !== id))
      return
    }
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.min(99, q) } : p)),
    )
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [items, itemCount, subtotal, addItem, setQuantity, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart doit être utilisé dans un CartProvider')
  }
  return ctx
}
