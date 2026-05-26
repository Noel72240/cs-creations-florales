/** Sélecteur de note 1–5 pour l’admin (étoiles cliquables). */
export default function StarRatingInput({ value = 0, onChange, id }) {
  const current = Math.min(5, Math.max(0, Math.round(Number(value) || 0)))

  return (
    <div className="star-rating-input" role="radiogroup" aria-labelledby={id}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={current === n}
          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
          className={`star-rating-input__btn ${n <= current ? 'star-rating-input__btn--on' : ''}`}
          onClick={() => onChange(n)}
        >
          ★
        </button>
      ))}
      <span className="star-rating-input__label text-xs ml-2" style={{ color: 'var(--text-mid)' }}>
        {current > 0 ? `${current}/5` : 'Choisir une note'}
      </span>
    </div>
  )
}
