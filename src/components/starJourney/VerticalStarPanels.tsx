import { useEffect, useState } from 'react'
import { ArrowUpRight, GitBranch } from 'lucide-react'
import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import type { VerticalStarChapter } from '../../data/verticalStarJourney'
import { getVerticalWaypointStrength, verticalStarAccentColors } from '../../data/verticalStarJourney'

type VerticalStarPanelsProps = {
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

  return chapter.position[0] > 0 ? 'left' : 'right'
}

function ProjectPanel({ chapter }: { chapter: VerticalStarChapter }) {
  if (!chapter.project) {
    return null
  }

  const { project } = chapter

  return (
    <>
      <div className="vertical-star-panel__topline">
        <span>{project.eyebrow}</span>
        <strong>{project.year}</strong>
      </div>
      <h2>{project.title}</h2>
      <p className="vertical-star-panel__body">{project.problem}</p>
      <div className="vertical-star-panel__grid">
        <div>
          <span>Impact</span>
          <p>{project.impact}</p>
        </div>
      </div>
      <div className="vertical-star-chip-list">
        {project.stack.slice(0, 6).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="vertical-star-signal-list">
        {project.signals.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>
      {project.repository ? (
        <a className="vertical-star-link" href={project.repository} target="_blank" rel="noreferrer">
          <GitBranch aria-hidden="true" size={16} />
          {project.repoName ?? 'Repository'}
          <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      ) : null}
    </>
  )
}

function SkillsPanel({ chapter }: { chapter: VerticalStarChapter }) {
  return (
    <>
      <p className="vertical-star-kicker">{chapter.eyebrow}</p>
      <h2>{chapter.title}</h2>
      <p className="vertical-star-panel__body">{chapter.description}</p>
      <div className="vertical-star-skills">
        {chapter.skills?.map((group) => (
          <article className="vertical-star-skill-card" key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            <div className="vertical-star-chip-list">
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
      <p className="vertical-star-kicker">{chapter.eyebrow}</p>
      <h2>{chapter.title}</h2>
      <p className="vertical-star-panel__body">{chapter.description}</p>
      <div className="vertical-star-timeline">
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
      <p className="vertical-star-kicker">{chapter.eyebrow}</p>
      <h2>{chapter.title}</h2>
      <p className="vertical-star-panel__body">{chapter.description}</p>
      <div className="vertical-star-contact-list">
        {chapter.contactItems?.map((item) => (
          <a href={item.href} key={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            {item.href.startsWith('http') ? <ArrowUpRight aria-hidden="true" size={15} /> : null}
          </a>
        ))}
      </div>
    </>
  )
}

function DefaultPanel({ chapter }: { chapter: VerticalStarChapter }) {
  return (
    <>
      <p className="vertical-star-kicker">{chapter.eyebrow}</p>
      {chapter.type === 'intro' ? <h1>{chapter.title}</h1> : <h2>{chapter.title}</h2>}
      {chapter.paragraphs ? (
        <div className="vertical-star-panel__body-group">
          {chapter.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <p className="vertical-star-panel__body">{chapter.description}</p>
      )}
      {chapter.metrics ? (
        <div className="vertical-star-metrics">
          {chapter.metrics.map((metric) => (
            <span key={metric.label}>
              <strong>{metric.value}</strong>
              {metric.label}
            </span>
          ))}
        </div>
      ) : null}
    </>
  )
}

function renderPanel(chapter: VerticalStarChapter) {
  if (chapter.type === 'project') {
    return <ProjectPanel chapter={chapter} />
  }

  if (chapter.type === 'skills') {
    return <SkillsPanel chapter={chapter} />
  }

  if (chapter.type === 'timeline') {
    return <TimelinePanel chapter={chapter} />
  }

  if (chapter.type === 'contact') {
    return <ContactPanel chapter={chapter} />
  }

  return <DefaultPanel chapter={chapter} />
}

function getPanelOpacity(presence: number) {
  if (presence <= 0.08) {
    return 0
  }

  const normalizedPresence = Math.min(Math.max((presence - 0.08) / 0.48, 0), 1)

  return Math.pow(normalizedPresence, 0.6)
}

export function VerticalStarPanels({
  activeIndex,
  chapters,
  progress,
  reducedMotion,
}: VerticalStarPanelsProps) {
  const viewportWidth = useViewportWidth()
  const chapter = chapters[activeIndex] ?? chapters[0]
  const presence = getVerticalWaypointStrength(progress, activeIndex, chapters.length)
  const placement = getPanelPlacement(chapter, viewportWidth)
  const panelInitialY = placement === 'bottom' ? 0 : 16
  const panelOpacity = reducedMotion ? 1 : getPanelOpacity(presence)
  const style = {
    '--panel-accent': verticalStarAccentColors[chapter.accent],
    opacity: panelOpacity,
    pointerEvents: reducedMotion || panelOpacity > 0.28 ? 'auto' : 'none',
  } as CSSProperties

  return (
    <div
      aria-hidden={!reducedMotion && panelOpacity < 0.16}
      aria-live="polite"
      className={`vertical-star-panels is-${placement} is-${chapter.type}`}
      style={style}
    >
      <motion.article
        aria-labelledby={`vertical-star-panel-title-${chapter.id}`}
        className={`vertical-star-panel vertical-star-panel-${chapter.type}`}
        id={`panel-${chapter.id}`}
        key={chapter.id}
        initial={reducedMotion ? false : { opacity: 0, y: panelInitialY, scale: 0.988, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: reducedMotion ? 0 : 0.26, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="vertical-star-panel__index">
          <span>{String(activeIndex + 1).padStart(2, '0')}</span>
          <small>{Math.round(progress * 100)}%</small>
        </div>
        <span className="vertical-star-panel__flare" aria-hidden="true" />
        <div id={`vertical-star-panel-title-${chapter.id}`}>{renderPanel(chapter)}</div>
      </motion.article>
    </div>
  )
}
