/**
 * Photos Unsplash — thématique fleurs uniquement (bouquets, compositions, atelier).
 * Remplacez par vos propres clichés en conservant les imports dans les pages.
 */
const q = 'auto=format&fit=crop&q=80'
export const flower = (photoId, w) =>
  `https://images.unsplash.com/photo-${photoId}?${q}&w=${w}`

/** IDs vérifiés : bouquets, pivoines, roses, tulipes, atelier floral, etc. */
export const P = {
  peonies: '1490750967868-88df5691cc34',
  weddingBouquet: '1519378058457-4c29a0a2efac',
  bouquetSoft: '1518895949257-7621c3c786d7',
  wildflowers: '1463936575829-25148e1db1b8',
  vaseInterior: '1487530811015-780f2cdd7a44',
  rosesBouquet: '1526047932273-341f2f3c46fe',
  floristShop: '1520763185290-1fd75a4a5c71',
  /** Femme au travail en boutique / atelier floral (Unsplash) */
  womanFlorist: '1603213060894-6924801a1be6',
  bouquetGift: '1527529482837-4698179dc6ce',
  tulips: '1518621018168-697fe31c68d0',
  dahlias: '1561181286-d3fee7d55364',
  flowerWall: '1516467508483-a7212febe31a',
  rosesPink: '1455659817273-f96807779a38',
  weddingTableFlorals: '1465495976277-4387d4b0b4c6',
  flatlayBlooms: '1508610048659-a06b669e3321',
}

export const w500 = (id) => flower(id, 500)
export const w600 = (id) => flower(id, 600)
export const w700 = (id) => flower(id, 700)
export const w800 = (id) => flower(id, 800)
export const w1200 = (id) => flower(id, 1200)
