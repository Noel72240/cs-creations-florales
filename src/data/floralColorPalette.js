/** Pastilles couleur standard — libellés affichés au client. */
export const FLORAL_COLOR_PALETTE = {
  blanc: { label: 'Blanc', hex: '#ffffff' },
  creme: { label: 'Crème', hex: '#f5f0e6' },
  jaune: { label: 'Jaune', hex: '#f5d547' },
  orange: { label: 'Orange', hex: '#f58a3c' },
  peche: { label: 'Pêche', hex: '#ffb07a' },
  rouge: { label: 'Rouge', hex: '#c41e3a' },
  bordeaux: { label: 'Bordeaux', hex: '#722f37' },
  rosePale: { label: 'Rose pâle', hex: '#f4c2c2' },
  roseBonbon: { label: 'Rose bonbon', hex: '#ff69b4' },
  roseFuchsia: { label: 'Rose fuchsia', hex: '#ff00aa' },
  violet: { label: 'Violet', hex: '#8b5cf6' },
  bleuClair: { label: 'Bleu clair', hex: '#87ceeb' },
  bleuFonce: { label: 'Bleu foncé', hex: '#1e3a5f' },
  vertClair: { label: 'Vert clair', hex: '#90ee90' },
  vertFonce: { label: 'Vert foncé', hex: '#2d5016' },
  marronClair: { label: 'Marron clair', hex: '#c4a484' },
  marronFonce: { label: 'Marron foncé', hex: '#5c4033' },
  gris: { label: 'Gris', hex: '#9ca3af' },
  noir: { label: 'Noir', hex: '#1a1a1a' },
  dore: { label: 'Doré', hex: '#d4af37' },
  argente: { label: 'Argenté', hex: '#c0c0c0' },
}

export const PALETTE_SETS = {
  roses: [
    'blanc', 'creme', 'jaune', 'orange', 'rouge', 'bordeaux',
    'rosePale', 'roseBonbon', 'roseFuchsia', 'violet',
    'bleuClair', 'bleuFonce', 'vertClair', 'vertFonce',
    'marronClair', 'marronFonce', 'gris', 'noir',
  ],
  rosesExtended: [
    'blanc', 'creme', 'jaune', 'orange', 'rouge', 'bordeaux',
    'rosePale', 'roseBonbon', 'roseFuchsia', 'violet',
    'bleuClair', 'bleuFonce', 'vertClair', 'vertFonce',
    'marronClair', 'marronFonce', 'gris', 'noir', 'dore', 'argente',
  ],
  text: [
    'blanc', 'creme', 'jaune', 'orange', 'rouge', 'bordeaux',
    'rosePale', 'roseBonbon', 'roseFuchsia', 'violet',
    'bleuClair', 'bleuFonce', 'vertClair', 'vertFonce',
    'marronClair', 'marronFonce', 'gris', 'noir', 'dore', 'argente',
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
