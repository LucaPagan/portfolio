import { lazy, Suspense } from 'react'
import type { CSSProperties } from 'react'
import { verticalStarAccentColors, verticalStarChapters } from '../../data/verticalStarJourney'
import { useSkeletonOrbitProgress } from '../../hooks/useSkeletonOrbitProgress'
import { SkeletonOrbitProgress } from './SkeletonOrbitProgress'
import { SkeletonOrbitPanels } from './SkeletonOrbitPanels'

const SkeletonOrbitCanvas = lazy(() =>
  import('./SkeletonOrbitCanvas').then((module) => ({ default: module.SkeletonOrbitCanvas })),
)

type SkeletonOrbitJourneyProps = {
  reducedMotion: boolean
}

export function SkeletonOrbitJourney({ reducedMotion }: SkeletonOrbitJourneyProps) {
  const { activeIndex, progress, progressRef, trackRef } = useSkeletonOrbitProgress(
    verticalStarChapters.length,
    reducedMotion,
  )
  const activeChapter = verticalStarChapters[activeIndex] ?? verticalStarChapters[0]
  const style = {
    '--orbit-accent': verticalStarAccentColors[activeChapter.accent],
    '--orbit-progress': progress,
    '--orbit-chapter-count': verticalStarChapters.length,
  } as CSSProperties

  return (
    <section className="skeleton-orbit-journey" style={style}>
      <div className="skeleton-orbit-scroll-track" ref={trackRef}>
        {verticalStarChapters.map((chapter) => (
          <span
            aria-hidden="true"
            className="skeleton-orbit-scroll-anchor"
            id={chapter.id}
            key={chapter.id}
            style={{ top: `${Math.min(chapter.progressTarget * 100, 99.8)}%` }}
          />
        ))}

        <div className="skeleton-orbit-sticky-stage">
          <div className="skeleton-orbit-canvas-layer" aria-hidden="true">
            <Suspense fallback={<div className="skeleton-orbit-canvas-fallback" />}>
              <SkeletonOrbitCanvas
                activeIndex={activeIndex}
                progressRef={progressRef}
                reducedMotion={reducedMotion}
              />
            </Suspense>
          </div>
          <div className="skeleton-orbit-vignette" aria-hidden="true" />
          <SkeletonOrbitPanels
            activeIndex={activeIndex}
            chapters={verticalStarChapters}
            progress={progress}
            reducedMotion={reducedMotion}
          />
          <SkeletonOrbitProgress progress={progress} />
        </div>
      </div>
    </section>
  )
}
