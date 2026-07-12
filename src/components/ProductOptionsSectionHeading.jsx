export default function ProductOptionsSectionHeading({ title }) {
  const label = String(title || '').trim()
  if (!label) return null

  return (
    <div className="article-product-options-heading">
      <div className="article-product-options-heading__divider">
        <span className="article-product-options-heading__title">{label}</span>
      </div>
    </div>
  )
}
