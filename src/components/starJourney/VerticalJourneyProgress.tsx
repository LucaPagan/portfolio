import type { CSSProperties } from 'react'
import { verticalStarAccentColors, verticalStarChapters } from '../../data/verticalStarJourney'
import { scrollToVerticalJourneyProgress } from '../../utils/verticalStarScroll'

type VerticalJourneyProgressProps = {
  activeIndex: number
  progress: number
}

export function VerticalJourneyProgress({ activeIndex, progress }: VerticalJourneyProgressProps) {
  return (
    <nav className="vertical-journey-progress" aria-label="Vertical star journey chapters">
      <span className="vertical-journey-progress__bar" aria-hidden="true">
        <span style={{ transform: `scaleY(${progress})` }} />
      </span>
      <div className="vertical-journey-progress__dots">
        {verticalStarChapters.map((chapter, index) => (
          <button
            aria-current={activeIndex === index ? 'step' : undefined}
            aria-label={`Vai a ${chapter.navLabel}`}
            key={chapter.id}
            onClick={() => scrollToVerticalJourneyProgress(chapter.progressTarget)}
            style={{ '--dot-color': verticalStarAccentColors[chapter.accent] } as CSSProperties}
            type="button"
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
