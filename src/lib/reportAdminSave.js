/** Message après enregistrement admin (local + Supabase). */
export function messageAfterAdminSave(result, contentDriver) {
  if (!result?.localOk) {
    return {
      ok: false,
      text: 'Erreur : impossible d’enregistrer dans ce navigateur (stockage plein ?).',
    }
  }

  if (contentDriver !== 'supabase') {
    return {
      ok: true,
      text: 'Enregistré sur cet ordinateur seulement. Pour le site en ligne : VITE_CONTENT_DRIVER=supabase + variables Vercel, puis Redeploy.',
    }
  }

  if (!result.supabaseOk) {
    const err = result.supabaseError || 'erreur serveur'
    const storageHint =
      result.strippedImages > 0 && /stockage|bucket|base64|ordinateur/i.test(err)
        ? ' Voir supabase/README.md → Étape 2 (Storage).'
        : ''
    return {
      ok: false,
      text: `Pas enregistré en ligne : ${err}.${storageHint} Vérifiez aussi SUPABASE_SERVICE_ROLE_KEY et ADMIN_PASSWORD sur Vercel.`,
    }
  }

  let text = 'Enregistré en ligne (Supabase) — visible pour tous les visiteurs après rechargement.'
  if (result.strippedImages > 0) {
    text += ` ${result.strippedImages} image(s) lourde(s) non envoyée(s) : utilisez des fichiers dans public/ ou l’upload cloud.`
  }
  if (result.payloadTooLarge) {
    text =
      'Contenu trop volumineux pour le serveur. Réduisez les images intégrées (base64) ou utilisez l’upload cloud / public/.'
  }
  return { ok: true, text }
}
