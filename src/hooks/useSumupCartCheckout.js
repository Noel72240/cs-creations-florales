import { useCallback, useState } from 'react'
import { useSiteConfig } from '../context/SiteContentContext'
import { getMaintenanceState, MAINTENANCE_PAYMENT_BLOCKED_MSG } from '../lib/maintenance'
import { createSumupCheckout } from '../lib/sumupCheckoutApi'

/** Redirection vers Hosted Checkout SumUp (URL renvoyée par `/api/create-sumup-checkout`). */
export function useSumupCartCheckout() {
  const { content } = useSiteConfig()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const pay = useCallback(async (items, { customerEmail, customerName, promoCode } = {}) => {
    const maintenance = getMaintenanceState(content)
    if (maintenance.active) {
      setError(maintenance.message || MAINTENANCE_PAYMENT_BLOCKED_MSG)
      return
    }

    setError('')
    setBusy(true)
    try {
      const { url } = await createSumupCheckout({
        items,
        customerEmail,
        customerName,
        ...(promoCode ? { promoCode } : {}),
      })
      window.location.assign(url)
    } catch (e) {
      setError(e?.message || 'Impossible de démarrer le paiement')
      setBusy(false)
    }
  }, [content])

  const maintenance = getMaintenanceState(content)

  return {
    pay,
    busy,
    error,
    paymentsBlocked: maintenance.active,
    maintenanceMessage: maintenance.message,
    clearError: () => setError(''),
  }
}
