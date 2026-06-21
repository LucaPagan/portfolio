import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
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
  const smoothX = useSpring(cursorX, { stiffness: 520, damping: 42, mass: 0.24 })
  const smoothY = useSpring(cursorY, { stiffness: 520, damping: 42, mass: 0.24 })
  const [visible, setVisible] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const [onProject, setOnProject] = useState(false)
  const [cursorAccent, setCursorAccent] = useState('244, 241, 233')
  const [pressed, setPressed] = useState(false)
  const accentRef = useRef(cursorAccent)
  const interactiveRef = useRef(interactive)
  const onProjectRef = useRef(onProject)
  const visibleRef = useRef(visible)
  const positionRef = useRef({ x: -120, y: -120 })
  const frameRef = useRef<number | null>(null)

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

    const updateCursorPosition = () => {
      frameRef.current = null
      cursorX.set(positionRef.current.x - 18)
      cursorY.set(positionRef.current.y - 18)
    }

    const scheduleCursorPosition = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateCursorPosition)
      }
    }

    const moveCursor = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const magneticTarget = target?.closest('a, button, .darkroom-project') as HTMLElement | null
      const projectTarget = target?.closest('.darkroom-project') as HTMLElement | null
      let nextX = event.clientX
      let nextY = event.clientY

      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect()
        nextX += (rect.left + rect.width / 2 - event.clientX) * 0.12
        nextY += (rect.top + rect.height / 2 - event.clientY) * 0.12
      }

      if (projectTarget) {
        const accent = getComputedStyle(projectTarget).getPropertyValue('--project-accent-rgb').trim() || '244, 241, 233'
        if (accentRef.current !== accent) {
          accentRef.current = accent
          setCursorAccent(accent)
        }
      } else if (accentRef.current !== '244, 241, 233') {
        accentRef.current = '244, 241, 233'
        setCursorAccent('244, 241, 233')
      }

      positionRef.current = { x: nextX, y: nextY }
      scheduleCursorPosition()

      const nextInteractive = isInteractiveTarget(event.target)
      const nextOnProject = Boolean(projectTarget)

      if (interactiveRef.current !== nextInteractive) {
        interactiveRef.current = nextInteractive
        setInteractive(nextInteractive)
      }

      if (onProjectRef.current !== nextOnProject) {
        onProjectRef.current = nextOnProject
        setOnProject(nextOnProject)
      }

      if (!visibleRef.current) {
        visibleRef.current = true
        setVisible(true)
      }
    }
    const pressCursor = () => setPressed(true)
    const releaseCursor = () => setPressed(false)
    const hideCursor = () => {
      visibleRef.current = false
      interactiveRef.current = false
      onProjectRef.current = false
      setVisible(false)
      setInteractive(false)
      setOnProject(false)
      setPressed(false)
    }

    window.addEventListener('pointermove', moveCursor)
    window.addEventListener('pointerdown', pressCursor)
    window.addEventListener('pointerup', releaseCursor)
    window.addEventListener('blur', hideCursor)
    document.documentElement.addEventListener('mouseleave', hideCursor)

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }

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
    onProject ? 'is-on-project' : '',
    pressed ? 'is-pressed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const style = {
    x: smoothX,
    y: smoothY,
    '--cursor-accent': cursorAccent,
  } as unknown as CSSProperties

  return (
    <motion.div
      aria-hidden="true"
      className={className}
      style={style}
    >
      <span className="cursor-follower__trail" />
      <span className="cursor-follower__ring" />
      <span className="cursor-follower__dot" />
    </motion.div>
  )
}
