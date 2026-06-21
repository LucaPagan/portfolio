import { useEffect, useState } from 'react'
import { ArrowUpRight, GitBranch } from 'lucide-react'
import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import type { VerticalStarChapter } from '../../data/verticalStarJourney'
import { verticalStarAccentColors, getVerticalWaypointStrength } from '../../data/verticalStarJourney'

type SkeletonOrbitPanelsProps = {
  activeIndex: number
  chapters: VerticalStarChapter[]
  progress: number
  reducedMotion: boolean
}

function useViewportWidth() {
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth,
  )

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return viewportWidth
}

function getPanelPlacement(chapter: VerticalStarChapter, viewportWidth: number) {
  if (viewportWidth < 860) {
    return 'bottom'
  }
  // Alternate left/right based on some logic, or use position data
  // We'll use index or position to alternate
  return chapter.position[0] > 0 ? 'left' : 'right'
}

function ProjectPanel({ chapter }: { chapter: VerticalStarChapter }) {
  if (!chapter.project) return null
  const { project } = chapter
  return (
    <>
      <div className="skeleton-orbit-panel__topline">
        <span>{project.eyebrow}</span>
        <strong>{project.year}</strong>
      </div>
      <h2>{project.title}</h2>
      <p className="skeleton-orbit-panel__body">{project.problem}</p>
      <div className="skeleton-orbit-panel__grid">
        <div>
          <span>Impact</span>
          <p>{project.impact}</p>
        </div>
      </div>
      <div className="skeleton-orbit-chip-list">
        {project.stack.slice(0, 6).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="skeleton-orbit-signal-list">
        {project.signals.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>
      {project.repository && (
        <a className="skeleton-orbit-link" href={project.repository} target="_blank" rel="noreferrer">
          <GitBranch aria-hidden="true" size={16} />
          {project.repoName ?? 'Repository'}
          <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      )}
    </>
  )
}

function SkillsPanel({ chapter }: { chapter: VerticalStarChapter }) {
  return (
    <>
      <p className="skeleton-orbit-kicker">{chapter.eyebrow}</p>
      <h2>{chapter.title}</h2>
      <p className="skeleton-orbit-panel__body">{chapter.description}</p>
      <div className="skeleton-orbit-skills">
        {chapter.skills?.map((group) => (
          <article className="skeleton-orbit-skill-card" key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            <div className="skeleton-orbit-chip-list">
              {group.items.slice(0, 7).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function TimelinePanel({ chapter }: { chapter: VerticalStarChapter }) {
  return (
    <>
      <p className="skeleton-orbit-kicker">{chapter.eyebrow}</p>
      <h2>{chapter.title}</h2>
      <p className="skeleton-orbit-panel__body">{chapter.description}</p>
      <div className="skeleton-orbit-timeline">
        {chapter.timelineItems?.map((item) => (
          <article key={`${item.period}-${item.title}`}>
            <span>{item.period}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </>
  )
}

function ContactPanel({ chapter }: { chapter: VerticalStarChapter }) {
  return (
    <>
      <p className="skeleton-orbit-kicker">{chapter.eyebrow}</p>
      <h2>{chapter.title}</h2>
      <p className="skeleton-orbit-panel__body">{chapter.description}</p>
      <div className="skeleton-orbit-contact-list">
        {chapter.contactItems?.map((item) => (
          <a href={item.href} key={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            {item.href.startsWith('http') && <ArrowUpRight aria-hidden="true" size={15} />}
          </a>
        ))}
      </div>
    </>
  )
}

function DefaultPanel({ chapter }: { chapter: VerticalStarChapter }) {
  return (
    <>
      <p className="skeleton-orbit-kicker">{chapter.eyebrow}</p>
      {chapter.type === 'intro' ? <h1>{chapter.title}</h1> : <h2>{chapter.title}</h2>}
      {chapter.paragraphs ? (
        <div className="skeleton-orbit-panel__body-group">
          {chapter.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <p className="skeleton-orbit-panel__body">{chapter.description}</p>
      )}
      {chapter.metrics && (
        <div className="skeleton-orbit-metrics">
          {chapter.metrics.map((metric) => (
            <span key={metric.label}>
              <strong>{metric.value}</strong>
              {metric.label}
            </span>
          ))}
        </div>
      )}
    </>
  )
}

function renderPanel(chapter: VerticalStarChapter) {
  switch (chapter.type) {
    case 'project':
      return <ProjectPanel chapter={chapter} />
    case 'skills':
      return <SkillsPanel chapter={chapter} />
    case 'timeline':
      return <TimelinePanel chapter={chapter} />
    case 'contact':
      return <ContactPanel chapter={chapter} />
    default:
      return <DefaultPanel chapter={chapter} />
  }
}

function getPanelOpacity(presence: number) {
  if (presence <= 0.08) return 0
  const normalizedPresence = Math.min(Math.max((presence - 0.08) / 0.48, 0), 1)
  return Math.pow(normalizedPresence, 0.6)
}

export function SkeletonOrbitPanels({
  activeIndex,
  chapters,
  progress,
  reducedMotion,
}: SkeletonOrbitPanelsProps) {
  const viewportWidth = useViewportWidth()
  const chapter = chapters[activeIndex] ?? chapters[0]
  const presence = getVerticalWaypointStrength(progress, activeIndex, chapters.length)
  const placement = getPanelPlacement(chapter, viewportWidth)
  const panelInitialX = placement === 'left' ? -20 : placement === 'right' ? 20 : 0
  const panelInitialY = placement === 'bottom' ? 20 : 0
  
  // Use presence for opacity if we want crossfades, or just solid 1 for active
  const panelOpacity = reducedMotion ? 1 : getPanelOpacity(presence)
  
  const style = {
    '--orbit-accent': verticalStarAccentColors[chapter.accent],
    opacity: panelOpacity,
    pointerEvents: reducedMotion || panelOpacity > 0.28 ? 'auto' : 'none',
  } as CSSProperties

  return (
    <div
      aria-hidden={!reducedMotion && panelOpacity < 0.16}
      aria-live="polite"
      className={`skeleton-orbit-panels is-${placement}`}
      style={style}
    >
      <motion.article
        aria-labelledby={`skeleton-orbit-panel-title-${chapter.id}`}
        className="skeleton-orbit-panel"
        id={`panel-${chapter.id}`}
        key={chapter.id}
        initial={reducedMotion ? false : { opacity: 0, x: panelInitialX, y: panelInitialY, filter: 'blur(10px)' }}
        animate={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="skeleton-orbit-panel__index">
          <span>{String(activeIndex + 1).padStart(2, '0')}</span>
          <small>{Math.round(progress * 100)}%</small>
        </div>
        <div id={`skeleton-orbit-panel-title-${chapter.id}`}>{renderPanel(chapter)}</div>
      </motion.article>
    </div>
  )
}
