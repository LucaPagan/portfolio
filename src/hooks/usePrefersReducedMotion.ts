import { useEffect, useState } from 'react'

const query = '(prefers-reduced-motion: reduce)'

function readPreference() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia(query).matches
}

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(readPreference)

  useEffect(() => {
    const media = window.matchMedia(query)
    const updatePreference = () => setPrefersReducedMotion(media.matches)

    updatePreference()
    media.addEventListener('change', updatePreference)

    return () => media.removeEventListener('change', updatePreference)
  }, [])

  return prefersReducedMotion
}
