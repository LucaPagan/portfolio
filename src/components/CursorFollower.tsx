import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

const interactiveSelector = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  '[role="button"]',
  '.darkroom-repo-button',
  '.darkroom-project',
].join(', ')

export function CursorFollower() {
  const cursorX = useMotionValue(-120)
  const cursorY = useMotionValue(-120)
  const smoothX = useSpring(cursorX, { stiffness: 420, damping: 38, mass: 0.3 })
  const smoothY = useSpring(cursorY, { stiffness: 420, damping: 38, mass: 0.3 })
  const [visible, setVisible] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('custom-cursor-active')

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [])

  useEffect(() => {
    const isInteractiveTarget = (target: EventTarget | null) => {
      return target instanceof Element && Boolean(target.closest(interactiveSelector))
    }

    const moveCursor = (event: PointerEvent) => {
      cursorX.set(event.clientX - 18)
      cursorY.set(event.clientY - 18)
      setInteractive(isInteractiveTarget(event.target))
      setVisible(true)
    }
    const pressCursor = () => setPressed(true)
    const releaseCursor = () => setPressed(false)
    const hideCursor = () => {
      setVisible(false)
      setInteractive(false)
      setPressed(false)
    }

    window.addEventListener('pointermove', moveCursor)
    window.addEventListener('pointerdown', pressCursor)
    window.addEventListener('pointerup', releaseCursor)
    window.addEventListener('blur', hideCursor)
    document.documentElement.addEventListener('mouseleave', hideCursor)

    return () => {
      window.removeEventListener('pointermove', moveCursor)
      window.removeEventListener('pointerdown', pressCursor)
      window.removeEventListener('pointerup', releaseCursor)
      window.removeEventListener('blur', hideCursor)
      document.documentElement.removeEventListener('mouseleave', hideCursor)
    }
  }, [cursorX, cursorY])

  const className = [
    'cursor-follower',
    visible ? 'is-visible' : '',
    interactive ? 'is-interactive' : '',
    pressed ? 'is-pressed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <motion.div
      aria-hidden="true"
      className={className}
      style={{ x: smoothX, y: smoothY }}
    >
      <span className="cursor-follower__ring" />
      <span className="cursor-follower__dot" />
    </motion.div>
  )
}
