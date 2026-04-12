import { useCart } from '../context/CartContext'
import { formatEuro } from '../utils/formatEuro'

/**
 * @param {{ id: string, title: string, price: number, imageUrl?: string, path?: string }} product
 * @param {string} [label]
 * @param {string} [className]
 */
export default function AddToCartButton({ product, label = 'Ajouter au panier', className = '' }) {
  const { addItem } = useCart()

  return (
    <button
      type="button"
      className={`btn-primary text-sm py-2.5 px-5 ${className}`.trim()}
      onClick={() => addItem({ ...product, quantity: 1 })}
    >
      {label}
      {typeof product.price === 'number' && (
        <span className="opacity-90 ml-1">· {formatEuro(product.price)}</span>
      )}
    </button>
  )
}
