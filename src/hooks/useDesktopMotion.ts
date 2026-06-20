import { useEffect, useState } from 'react'

const desktopMotionQuery = '(hover: hover) and (pointer: fine) and (min-width: 861px)'

function readDesktopMotion() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia(desktopMotionQuery).matches
}

export function useDesktopMotion(reducedMotion: boolean) {
  const [matchesDesktopMotion, setMatchesDesktopMotion] = useState(readDesktopMotion)

  useEffect(() => {
    const query = window.matchMedia(desktopMotionQuery)
    const updateEnabled = () => setMatchesDesktopMotion(query.matches)
    query.addEventListener('change', updateEnabled)

    return () => query.removeEventListener('change', updateEnabled)
  }, [])

  return !reducedMotion && matchesDesktopMotion
}
