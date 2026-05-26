/** Affichage d’une note sur 5 (étoiles pleines / vides). */
export default function StarRating({ rating = 0, max = 5, className = '', size = 'md' }) {
  const value = Math.min(max, Math.max(0, Math.round(Number(rating) || 0)))
  const sizeClass = size === 'sm' ? 'star-rating--sm' : size === 'lg' ? 'star-rating--lg' : ''

  return (
    <span
      className={`star-rating inline-flex items-center gap-0.5 ${sizeClass} ${className}`.trim()}
      role="img"
      aria-label={`${value} sur ${max} étoiles`}
    >
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < value ? 'star-rating__star star-rating__star--on' : 'star-rating__star'} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  )
}
