/** @param {number} n Montant en euros */
export function formatEuro(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '0,00 €'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)
}
