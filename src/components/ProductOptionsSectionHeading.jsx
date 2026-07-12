export default function ProductOptionsSectionHeading({ title }) {
  const label = String(title || '').trim()
  if (!label) return null

  return (
    <div className="article-product-options-heading">
      <p className="article-product-options-heading__title">{label}</p>
      <div className="article-product-options-heading__divider" aria-hidden="true">
        <span>♡</span>
      </div>
    </div>
  )
}
