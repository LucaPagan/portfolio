import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

type CursorFollowerProps = {
  reducedMotion: boolean
}

export function CursorFollower({ reducedMotion }: CursorFollowerProps) {
  const cursorX = useMotionValue(-120)
  const cursorY = useMotionValue(-120)
  const smoothX = useSpring(cursorX, { stiffness: 260, damping: 34, mass: 0.4 })
  const smoothY = useSpring(cursorY, { stiffness: 260, damping: 34, mass: 0.4 })
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: fine)')
    const updateEnabled = () => setEnabled(pointerQuery.matches && !reducedMotion)

    updateEnabled()
    pointerQuery.addEventListener('change', updateEnabled)

    return () => pointerQuery.removeEventListener('change', updateEnabled)
  }, [reducedMotion])

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    const moveCursor = (event: PointerEvent) => {
      cursorX.set(event.clientX - 18)
      cursorY.set(event.clientY - 18)
      setVisible(true)
    }
    const hideCursor = () => setVisible(false)

    window.addEventListener('pointermove', moveCursor)
    document.documentElement.addEventListener('mouseleave', hideCursor)

    return () => {
      window.removeEventListener('pointermove', moveCursor)
      document.documentElement.removeEventListener('mouseleave', hideCursor)
    }
  }, [cursorX, cursorY, enabled])

  if (!enabled) {
    return null
  }

  return (
    <motion.div
      aria-hidden="true"
      className="cursor-follower"
      style={{ x: smoothX, y: smoothY, opacity: visible ? 1 : 0 }}
    />
  )
}
