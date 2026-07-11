/**
 * E-mail de notification commande payée → propriétaire (facturation).
 * Envoi via Resend (https://resend.com) — fetch natif, sans dépendance npm.
 */
import { formatShippingSummary } from '../../shared/shipping.js'

function formatEuro(amount) {
  const n = Number(amount)
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)
}

function formatParisDate(iso) {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Europe/Paris',
    }).format(new Date(iso))
  } catch {
    return String(iso || '')
  }
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function getOrderNotificationRecipient() {
  return (
    process.env.ORDER_NOTIFICATION_EMAIL ||
    process.env.SUMUP_PAY_TO_EMAIL ||
    'contact@cscreationsflorales.com'
  )
    .trim()
    .slice(0, 254)
}

export function getOrderEmailFrom() {
  const from =
    process.env.ORDER_EMAIL_FROM ||
    'C&S Créations Florales <contact@cscreationsflorales.com>'
  return from.trim().slice(0, 254)
}

function buildLineItemsText(lineItems) {
  const items = Array.isArray(lineItems) ? lineItems : []
  if (!items.length) return '—'
  return items
    .map((item, i) => {
      const lines = [
        `${i + 1}. ${item.title} — ${formatEuro(item.price)} × ${item.quantity} = ${formatEuro(item.lineTotal ?? item.price * item.quantity)}`,
      ]
      if (item.selectedColor) lines.push(`   Couleur : ${item.selectedColor}`)
      if (item.personalizationMessage) lines.push(`   Message : ${item.personalizationMessage}`)
      if (Array.isArray(item.customOptionsSummary)) {
        for (const row of item.customOptionsSummary) {
          if (row?.label && row?.value) lines.push(`   ${row.label} : ${row.value}`)
        }
      }
      if (item.path) lines.push(`   Fiche : ${item.path}`)
      return lines.join('\n')
    })
    .join('\n\n')
}

function buildLineItemsHtml(lineItems) {
  const items = Array.isArray(lineItems) ? lineItems : []
  if (!items.length) return '<p>—</p>'
  return items
    .map((item) => {
      const details = []
      if (item.selectedColor) details.push(`<li>Couleur : ${escapeHtml(item.selectedColor)}</li>`)
      if (item.personalizationMessage) {
        details.push(`<li>Message : ${escapeHtml(item.personalizationMessage)}</li>`)
      }
      if (Array.isArray(item.customOptionsSummary)) {
        for (const row of item.customOptionsSummary) {
          if (row?.label && row?.value) {
            details.push(`<li>${escapeHtml(row.label)} : ${escapeHtml(row.value)}</li>`)
          }
        }
      }
      if (item.path) details.push(`<li>Fiche : ${escapeHtml(item.path)}</li>`)
      const total = formatEuro(item.lineTotal ?? Number(item.price) * Number(item.quantity))
      return `<tr>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top;">
          <strong>${escapeHtml(item.title)}</strong>
          ${details.length ? `<ul style="margin:6px 0 0;padding-left:18px;font-size:13px;color:#555;">${details.join('')}</ul>` : ''}
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right;">${formatEuro(item.price)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right;font-weight:600;">${total}</td>
      </tr>`
    })
    .join('')
}

export function buildOrderNotificationContent(order) {
  const ref = order.checkout_reference || '—'
  const customerName = String(order.customer_name || '').trim() || '—'
  const customerEmail = String(order.customer_email || '').trim() || '—'
  const paidAt = formatParisDate(order.updated_at || order.created_at)
  const amount = formatEuro(order.amount_eur)
  const subtotal = order.subtotal_eur != null ? formatEuro(order.subtotal_eur) : null
  const discount = order.discount_eur != null ? formatEuro(order.discount_eur) : null
  const promo = order.promo_code ? String(order.promo_code) : null
  const shippingSummary = formatShippingSummary(order)
  const phone = order.customer_phone ? String(order.customer_phone) : ''

  const text = [
    'Nouvelle commande payée sur cscreationsflorales.com',
    '',
    `Référence : ${ref}`,
    `Date : ${paidAt}`,
    '',
    '── Client ──',
    `Nom : ${customerName}`,
    `E-mail : ${customerEmail}`,
    phone ? `Téléphone : ${phone}` : null,
    '',
    shippingSummary ? '── Livraison ──' : null,
    shippingSummary || null,
    shippingSummary ? '' : null,
    '── Articles ──',
    buildLineItemsText(order.line_items),
    '',
    '── Montants ──',
    subtotal ? `Sous-total : ${subtotal}` : null,
    promo && discount ? `Code promo ${promo} : -${discount}` : promo ? `Code promo : ${promo}` : null,
    `Total payé : ${amount}`,
    '',
    '—',
    'C&S Créations Florales — notification automatique',
  ]
    .filter(Boolean)
    .join('\n')

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="font-family:Georgia,'Times New Roman',serif;background:#fdf8fa;margin:0;padding:24px;color:#3d2a4a;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e8d4e0;border-radius:12px;overflow:hidden;">
    <div style="background:#6b4c6e;color:#fff;padding:20px 24px;">
      <h1 style="margin:0;font-size:20px;font-weight:600;">Nouvelle commande payée</h1>
      <p style="margin:8px 0 0;font-size:13px;opacity:0.9;">cscreationsflorales.com</p>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;">
        Une commande vient d'être réglée via SumUp. Voici le récapitulatif pour facturation.
      </p>
      <table style="width:100%;font-size:13px;margin-bottom:20px;border-collapse:collapse;">
        <tr><td style="padding:4px 0;color:#777;">Référence</td><td style="padding:4px 0;font-family:monospace;">${escapeHtml(ref)}</td></tr>
        <tr><td style="padding:4px 0;color:#777;">Date</td><td style="padding:4px 0;">${escapeHtml(paidAt)}</td></tr>
      </table>
      <h2 style="font-size:15px;color:#6b4c6e;margin:0 0 8px;">Client</h2>
      <table style="width:100%;font-size:13px;margin-bottom:20px;border-collapse:collapse;">
        <tr><td style="padding:4px 0;color:#777;width:90px;">Nom</td><td style="padding:4px 0;">${escapeHtml(customerName)}</td></tr>
        <tr><td style="padding:4px 0;color:#777;">E-mail</td><td style="padding:4px 0;"><a href="mailto:${escapeHtml(customerEmail)}" style="color:#6b4c6e;">${escapeHtml(customerEmail)}</a></td></tr>
        ${phone ? `<tr><td style="padding:4px 0;color:#777;">Téléphone</td><td style="padding:4px 0;">${escapeHtml(phone)}</td></tr>` : ''}
      </table>
      ${
        shippingSummary
          ? `<h2 style="font-size:15px;color:#6b4c6e;margin:0 0 8px;">Livraison</h2>
      <p style="font-size:13px;line-height:1.55;margin:0 0 20px;white-space:pre-line;">${escapeHtml(shippingSummary)}</p>`
          : ''
      }
      <h2 style="font-size:15px;color:#6b4c6e;margin:0 0 8px;">Articles</h2>
      <table style="width:100%;font-size:13px;margin-bottom:20px;border-collapse:collapse;">
        <thead>
          <tr style="background:#faf5f8;">
            <th style="padding:8px;text-align:left;">Article</th>
            <th style="padding:8px;text-align:center;">Qté</th>
            <th style="padding:8px;text-align:right;">P.U.</th>
            <th style="padding:8px;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>${buildLineItemsHtml(order.line_items)}</tbody>
      </table>
      <table style="width:100%;font-size:14px;margin-bottom:8px;">
        ${subtotal ? `<tr><td style="padding:4px 0;color:#777;">Sous-total</td><td style="padding:4px 0;text-align:right;">${subtotal}</td></tr>` : ''}
        ${promo && discount ? `<tr><td style="padding:4px 0;color:#777;">Promo ${escapeHtml(promo)}</td><td style="padding:4px 0;text-align:right;color:#b42318;">-${discount}</td></tr>` : ''}
        <tr>
          <td style="padding:8px 0;font-weight:700;font-size:16px;color:#6b4c6e;">Total payé</td>
          <td style="padding:8px 0;text-align:right;font-weight:700;font-size:16px;color:#6b4c6e;">${amount}</td>
        </tr>
      </table>
    </div>
    <div style="padding:14px 24px;background:#faf5f8;font-size:11px;color:#888;text-align:center;">
      Notification automatique — C&amp;S Créations Florales
    </div>
  </div>
</body>
</html>`

  return { text, html, subject: `Commande payée ${amount} — ${ref.slice(0, 8)}` }
}

/**
 * @param {Record<string, unknown>} order
 * @returns {Promise<{ sent: boolean, reason?: string, id?: string }>}
 */
export async function sendOrderNotificationEmail(order) {
  const apiKey = (process.env.RESEND_API_KEY || '').trim()
  const to = getOrderNotificationRecipient()
  const from = getOrderEmailFrom()

  if (!apiKey) {
    console.warn('[order-email] RESEND_API_KEY manquante — notification non envoyée')
    return { sent: false, reason: 'no_api_key' }
  }
  if (!to) {
    console.warn('[order-email] destinataire manquant')
    return { sent: false, reason: 'no_recipient' }
  }

  const { subject, text, html } = buildOrderNotificationContent(order)

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      console.error('[order-email] Resend error', res.status, data)
      return { sent: false, reason: data?.message || `resend_${res.status}` }
    }

    return { sent: true, id: data?.id }
  } catch (e) {
    console.error('[order-email]', e)
    return { sent: false, reason: e?.message || 'send_failed' }
  }
}
