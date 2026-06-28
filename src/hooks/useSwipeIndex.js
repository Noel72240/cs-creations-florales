import { useMemo, useRef } from 'react'

/** Glissement gauche/droite pour changer d’image (mobile). */
export function useSwipeIndex(length, setIndex) {
  const startX = useRef(null)

  return useMemo(() => {
    const onTouchStart = (e) => {
      startX.current = e.touches[0]?.clientX ?? null
    }
    const onTouchEnd = (e) => {
      if (startX.current == null || length < 2) return
      const endX = e.changedTouches[0]?.clientX
      if (endX == null) return
      const dx = endX - startX.current
      if (Math.abs(dx) >= 44) {
        setIndex((i) => (dx < 0 ? Math.min(length - 1, i + 1) : Math.max(0, i - 1)))
      }
      startX.current = null
    }
    return { onTouchStart, onTouchEnd }
  }, [length, setIndex])
}
