/**
 * E-mail demande de contact / devis → propriétaire (Resend).
 */
import { getOrderEmailFrom, getOrderNotificationRecipient } from './orderNotificationEmail.js'

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function clean(s, max = 2000) {
  return String(s ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, max)
}

function cleanMultiline(s, max = 5000) {
  return String(s ?? '')
    .trim()
    .replace(/\r\n/g, '\n')
    .slice(0, max)
}

export function normalizeContactPayload(raw) {
  const prenom = clean(raw?.prenom, 80)
  const nom = clean(raw?.nom, 80)
  const email = clean(raw?.email, 254).toLowerCase()
  const telephone = clean(raw?.telephone, 40)
  const sujet = clean(raw?.sujet, 160) || 'Demande de contact'
  const message = cleanMultiline(raw?.message, 5000)
  const rgpd = Boolean(raw?.rgpd)

  const errors = []
  if (!prenom) errors.push('Prénom requis')
  if (!nom) errors.push('Nom requis')
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Email invalide')
  if (!message || message.length < 5) errors.push('Message trop court')
  if (!rgpd) errors.push('Consentement RGPD requis')

  return {
    ok: errors.length === 0,
    errors,
    data: { prenom, nom, email, telephone, sujet, message, rgpd },
  }
}

function buildContactEmailContent(data) {
  const fullName = `${data.prenom} ${data.nom}`.trim()
  const subject = `[Devis / Contact] ${data.sujet} — ${fullName}`.slice(0, 200)

  const text = [
    'Nouvelle demande depuis le site C&S Créations Florales',
    '',
    `Sujet : ${data.sujet}`,
    `Nom : ${fullName}`,
    `Email : ${data.email}`,
    `Téléphone : ${data.telephone || '—'}`,
    '',
    'Message :',
    data.message,
    '',
    '—',
    'Répondez directement à cet e-mail pour contacter le client.',
  ].join('\n')

  const html = `
    <div style="font-family:Georgia,serif;color:#2d1f2a;line-height:1.5;max-width:640px">
      <h2 style="color:#6b3a5a;font-weight:normal">Nouvelle demande de devis / contact</h2>
      <p><strong>Sujet :</strong> ${escapeHtml(data.sujet)}</p>
      <p><strong>Nom :</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email :</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
      <p><strong>Téléphone :</strong> ${escapeHtml(data.telephone || '—')}</p>
      <hr style="border:none;border-top:1px solid #f0d2dd;margin:1.25rem 0" />
      <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
      <p style="margin-top:1.5rem;font-size:13px;color:#7a6672">
        Répondez directement à cet e-mail pour contacter le client.
      </p>
    </div>
  `

  return { subject, text, html }
}

/**
 * @param {ReturnType<typeof normalizeContactPayload>['data']} data
 * @returns {Promise<{ sent: boolean, reason?: string, id?: string }>}
 */
export async function sendContactNotificationEmail(data) {
  const apiKey = (process.env.RESEND_API_KEY || '').trim()
  const to = (
    process.env.CONTACT_NOTIFICATION_EMAIL ||
    getOrderNotificationRecipient()
  )
    .trim()
    .slice(0, 254)
  const from = getOrderEmailFrom()

  if (!apiKey) {
    console.warn('[contact-email] RESEND_API_KEY manquante')
    return { sent: false, reason: 'no_api_key' }
  }
  if (!to) {
    console.warn('[contact-email] destinataire manquant')
    return { sent: false, reason: 'no_recipient' }
  }

  const { subject, text, html } = buildContactEmailContent(data)

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
        reply_to: data.email,
        subject,
        text,
        html,
      }),
    })

    const payload = await res.json().catch(() => ({}))
    if (!res.ok) {
      console.error('[contact-email] Resend error', res.status, payload)
      return { sent: false, reason: payload?.message || `resend_${res.status}` }
    }

    return { sent: true, id: payload?.id }
  } catch (e) {
    console.error('[contact-email]', e)
    return { sent: false, reason: e?.message || 'send_failed' }
  }
}
