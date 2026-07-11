import { useCart } from '../context/CartContext'
import { formatEuro } from '../utils/formatEuro'

/** Sous-total, réduction promo, livraison et total à payer. */
export default function CartTotals({
  size = 'default',
  shippingFee = 0,
  shippingNote = '',
}) {
  const { subtotal, appliedPromo, total } = useCart()
  const large = size === 'large'
  const deliveryFee = Number(shippingFee) > 0 ? Number(shippingFee) : 0
  const grandTotal = total + deliveryFee

  return (
    <div className="cart-totals space-y-2">
      <div className="flex justify-between items-baseline gap-4">
        <span className={large ? 'font-heading text-lg' : 'font-body text-sm'} style={{ color: 'var(--text-mid)' }}>
          Sous-total
        </span>
        <span className={large ? 'font-heading text-lg' : 'font-body text-sm'} style={{ color: 'var(--violet)' }}>
          {formatEuro(subtotal)}
        </span>
      </div>
      {appliedPromo ? (
        <div className="flex justify-between items-baseline gap-4">
          <span className={large ? 'font-heading text-lg' : 'font-body text-sm'} style={{ color: 'var(--mauve)' }}>
            Réduction ({appliedPromo.percentOff} %)
          </span>
          <span className={large ? 'font-heading text-lg' : 'font-body text-sm'} style={{ color: 'var(--mauve)' }}>
            −{formatEuro(appliedPromo.discount)}
          </span>
        </div>
      ) : null}
      {deliveryFee > 0 ? (
        <div className="flex justify-between items-baseline gap-4">
          <span className={large ? 'font-heading text-lg' : 'font-body text-sm'} style={{ color: 'var(--text-mid)' }}>
            Livraison Point Relais
            {shippingNote ? (
              <span className="block text-[11px] font-normal mt-0.5 opacity-85">{shippingNote}</span>
            ) : null}
          </span>
          <span className={large ? 'font-heading text-lg' : 'font-body text-sm'} style={{ color: 'var(--violet)' }}>
            {formatEuro(deliveryFee)}
          </span>
        </div>
      ) : null}
      <div className="flex justify-between items-baseline gap-4 pt-2 border-t border-mauve-light/30">
        <span className={large ? 'font-heading text-xl' : 'font-heading text-base'} style={{ color: 'var(--violet)' }}>
          Total à payer
        </span>
        <span className={large ? 'font-heading text-2xl' : 'font-heading text-xl'} style={{ color: 'var(--mauve)' }}>
          {formatEuro(grandTotal)}
        </span>
      </div>
    </div>
  )
}
