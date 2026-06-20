import { lazy, Suspense } from 'react'
import type { CSSProperties } from 'react'
import { verticalStarAccentColors, verticalStarChapters } from '../../data/verticalStarJourney'
import { useVerticalStarProgress } from '../../hooks/useVerticalStarProgress'
import { VerticalJourneyProgress } from './VerticalJourneyProgress'
import { VerticalStarPanels } from './VerticalStarPanels'

const VerticalStarCanvas = lazy(() =>
  import('./VerticalStarCanvas').then((module) => ({ default: module.VerticalStarCanvas })),
)

type VerticalStarJourneyProps = {
  reducedMotion: boolean
}

export function VerticalStarJourney({ reducedMotion }: VerticalStarJourneyProps) {
  const { activeIndex, progress, progressRef, trackRef } = useVerticalStarProgress(
    verticalStarChapters.length,
    reducedMotion,
  )
  const activeChapter = verticalStarChapters[activeIndex] ?? verticalStarChapters[0]
  const style = {
    '--vertical-star-accent': verticalStarAccentColors[activeChapter.accent],
    '--vertical-star-progress': progress,
    '--vertical-star-chapter-count': verticalStarChapters.length,
  } as CSSProperties

  return (
    <section className="vertical-star-journey" style={style}>
      <div className="vertical-star-scroll-track" ref={trackRef}>
        {verticalStarChapters.map((chapter) => (
          <span
            aria-hidden="true"
            className="vertical-star-scroll-anchor"
            id={chapter.id}
            key={chapter.id}
            style={{ top: `${Math.min(chapter.progressTarget * 100, 99.8)}%` }}
          />
        ))}

        <div className="vertical-star-sticky-stage">
          <div className="vertical-star-canvas-layer" aria-hidden="true">
            <Suspense fallback={<div className="vertical-star-canvas-fallback" />}>
              <VerticalStarCanvas
                activeIndex={activeIndex}
                chapters={verticalStarChapters}
                progressRef={progressRef}
                reducedMotion={reducedMotion}
              />
            </Suspense>
          </div>
          <div className="vertical-star-vignette" aria-hidden="true" />
          <VerticalStarPanels
            activeIndex={activeIndex}
            chapters={verticalStarChapters}
            progress={progress}
            reducedMotion={reducedMotion}
          />
          <VerticalJourneyProgress activeIndex={activeIndex} progress={progress} />
        </div>
      </div>
    </section>
  )
}
