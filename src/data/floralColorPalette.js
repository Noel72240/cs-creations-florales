/** Pastilles couleur — libellés affichés au client (roses en mousse). */
export const FLORAL_COLOR_PALETTE = {
  // ─── Palette roses (16 teintes atelier) ───
  blanc: { label: 'Blanc', hex: '#f5f5f0' },
  rose: { label: 'Rose', hex: '#d9668f' },
  camel: { label: 'Camel', hex: '#b8895c' },
  beige: { label: 'Beige', hex: '#d4bc96' },
  bleuRoi: { label: 'Bleu roi', hex: '#1e4a8c' },
  noir: { label: 'Noir', hex: '#1f1f1f' },
  rosePale: { label: 'Rose pâle', hex: '#f0b4c4' },
  vertAnis: { label: 'Vert anis', hex: '#9ed42e' },
  jaune: { label: 'Jaune', hex: '#f0d832' },
  gris: { label: 'Gris', hex: '#9a9a9a' },
  peche: { label: 'Pêche', hex: '#f0a070' },
  bleuCiel: { label: 'Bleu ciel', hex: '#4ec4b8' },
  orange: { label: 'Orange', hex: '#f07828' },
  bordeaux: { label: 'Bordeaux', hex: '#7a2838' },
  violet: { label: 'Violet', hex: '#9b68b8' },
  fuchsia: { label: 'Fuchsia', hex: '#e83898' },

  // ─── Texte / personnalisation (palette élargie) ───
  creme: { label: 'Crème', hex: '#f5f0e6' },
  rouge: { label: 'Rouge', hex: '#c41e3a' },
  roseBonbon: { label: 'Rose bonbon', hex: '#ff69b4' },
  roseFuchsia: { label: 'Rose fuchsia', hex: '#ff00aa' },
  bleuClair: { label: 'Bleu clair', hex: '#87ceeb' },
  bleuFonce: { label: 'Bleu foncé', hex: '#1e3a5f' },
  vertClair: { label: 'Vert clair', hex: '#90ee90' },
  vertFonce: { label: 'Vert foncé', hex: '#2d5016' },
  marronClair: { label: 'Camel', hex: '#b8895c' },
  marronFonce: { label: 'Camel', hex: '#b8895c' },
  dore: { label: 'Doré', hex: '#d4af37' },
  argente: { label: 'Argenté', hex: '#c0c0c0' },

  // ─── Yeux (ourson et peluches) ───
  yeuxBleu: { label: 'Bleu', hex: '#2563b8' },
  yeuxBleuClair: { label: 'Bleu clair', hex: '#6eb5e8' },
  yeuxMarron: { label: 'Marron', hex: '#6b4423' },
  yeuxVert: { label: 'Vert', hex: '#3d7a3d' },
  yeuxNoir: { label: 'Noir', hex: '#1a1a1a' },
  yeuxGris: { label: 'Gris', hex: '#7a7a7a' },
  yeuxDore: { label: 'Doré', hex: '#c9a227' },
  yeuxAmbre: { label: 'Ambre', hex: '#b8860b' },
}

/** 16 couleurs de roses en mousse (référence atelier). */
export const ROSE_FOAM_COLOR_KEYS = [
  'blanc',
  'rose',
  'camel',
  'beige',
  'bleuRoi',
  'noir',
  'rosePale',
  'vertAnis',
  'jaune',
  'gris',
  'peche',
  'bleuCiel',
  'orange',
  'bordeaux',
  'violet',
  'fuchsia',
]

/** Couleurs d’yeux pour oursons et peluches. */
export const EYE_COLOR_KEYS = [
  'yeuxBleu',
  'yeuxBleuClair',
  'yeuxMarron',
  'yeuxVert',
  'yeuxNoir',
  'yeuxGris',
  'yeuxDore',
  'yeuxAmbre',
]

export const PALETTE_SETS = {
  roses: [...ROSE_FOAM_COLOR_KEYS],
  rosesExtended: [...ROSE_FOAM_COLOR_KEYS, 'dore', 'argente'],
  eyes: [...EYE_COLOR_KEYS],
  text: [
    'blanc', 'creme', 'jaune', 'orange', 'rouge', 'bordeaux',
    'rosePale', 'rose', 'fuchsia', 'violet',
    'bleuCiel', 'bleuRoi', 'bleuClair', 'bleuFonce',
    'vertAnis', 'vertClair', 'vertFonce',
    'camel', 'beige', 'gris', 'noir', 'dore', 'argente',
  ],
}

export function paletteEntries(setName = 'roses') {
  const keys = PALETTE_SETS[setName] || PALETTE_SETS.roses
  return keys.map((key) => ({ key, ...FLORAL_COLOR_PALETTE[key] })).filter((e) => e.hex)
}

export function colorLabelFromKey(key) {
  return FLORAL_COLOR_PALETTE[key]?.label || key || ''
}

export function colorLabelsFromKeys(keys) {
  return (keys || []).map(colorLabelFromKey).filter(Boolean).join(', ')
}
