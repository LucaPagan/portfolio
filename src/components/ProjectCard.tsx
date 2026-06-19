import type { MouseEvent } from 'react'
import { ArrowUpRight, GitBranch } from 'lucide-react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import type { Project } from '../data/portfolio'

type ProjectCardProps = {
  project: Project
  index: number
  reducedMotion: boolean
}

export function ProjectCard({ project, index, reducedMotion }: ProjectCardProps) {
  const rotateXValue = useMotionValue(0)
  const rotateYValue = useMotionValue(0)
  const magneticXValue = useMotionValue(0)
  const magneticYValue = useMotionValue(0)
  const rotateX = useSpring(rotateXValue, { stiffness: 190, damping: 24, mass: 0.5 })
  const rotateY = useSpring(rotateYValue, { stiffness: 190, damping: 24, mass: 0.5 })
  const x = useSpring(magneticXValue, { stiffness: 170, damping: 22, mass: 0.45 })
  const y = useSpring(magneticYValue, { stiffness: 170, damping: 22, mass: 0.45 })

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (reducedMotion) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = (event.clientX - rect.left) / rect.width - 0.5
    const pointerY = (event.clientY - rect.top) / rect.height - 0.5

    rotateXValue.set(pointerY * -8)
    rotateYValue.set(pointerX * 10)
    magneticXValue.set(pointerX * 14)
    magneticYValue.set(pointerY * 12)
  }

  const resetMotion = () => {
    rotateXValue.set(0)
    rotateYValue.set(0)
    magneticXValue.set(0)
    magneticYValue.set(0)
  }

  return (
    <motion.article
      className={`project-card reveal accent-${project.accent}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMotion}
      style={{ rotateX, rotateY, x, y, transformStyle: 'preserve-3d' }}
    >
      <div className="project-index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="project-topline">
        <span>{project.eyebrow}</span>
        <strong>{project.year}</strong>
      </div>

      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <p className="project-impact">{project.impact}</p>

      <div className="project-signals" aria-label={`${project.title} highlights`}>
        {project.signals.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>

      <div className="project-tech">
        {project.tech.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>

      <a className="project-link" href={project.repository} target="_blank" rel="noreferrer">
        <GitBranch aria-hidden="true" size={17} />
        Repository
        <ArrowUpRight aria-hidden="true" size={16} />
      </a>
    </motion.article>
  )
}
