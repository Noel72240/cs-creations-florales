/** Nom de marque C&S — police Cookie sur tout le site */
export default function BrandName({ children, className = '' }) {
  if (children == null || children === '') return null
  const classes = ['font-brand', className].filter(Boolean).join(' ')
  return <span className={classes}>{children}</span>
}
