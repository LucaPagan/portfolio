import type { MouseEvent, ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

type MagneticButtonProps = {
  children: ReactNode
  className: string
  href: string
  reducedMotion: boolean
  target?: string
  rel?: string
}

export function MagneticButton({
  children,
  className,
  href,
  reducedMotion,
  target,
  rel,
}: MagneticButtonProps) {
  const xValue = useMotionValue(0)
  const yValue = useMotionValue(0)
  const glowXValue = useMotionValue(50)
  const glowYValue = useMotionValue(50)
  const x = useSpring(xValue, { stiffness: 260, damping: 20, mass: 0.42 })
  const y = useSpring(yValue, { stiffness: 260, damping: 20, mass: 0.42 })
  const glowX = useSpring(glowXValue, { stiffness: 180, damping: 24, mass: 0.5 })
  const glowY = useSpring(glowYValue, { stiffness: 180, damping: 24, mass: 0.5 })

  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = event.clientX - rect.left
    const pointerY = event.clientY - rect.top
    const distanceX = pointerX - rect.width / 2
    const distanceY = pointerY - rect.height / 2

    xValue.set(distanceX * 0.2)
    yValue.set(distanceY * 0.28)
    glowXValue.set((pointerX / rect.width) * 100)
    glowYValue.set((pointerY / rect.height) * 100)
  }

  const resetMagnet = () => {
    xValue.set(0)
    yValue.set(0)
    glowXValue.set(50)
    glowYValue.set(50)
  }

  return (
    <motion.a
      className={`${className} magnetic-button`}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMagnet}
      style={{
        x,
        y,
        '--magnetic-x': glowX,
        '--magnetic-y': glowY,
      }}
    >
      <span className="magnetic-button__glow" aria-hidden="true" />
      <span className="magnetic-button__content">{children}</span>
    </motion.a>
  )
}
