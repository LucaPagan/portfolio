import { clampVerticalStarProgress } from '../data/verticalStarJourney'

export function scrollToVerticalJourneyProgress(targetProgress: number) {
  const track = document.querySelector<HTMLElement>('.vertical-star-scroll-track')

  if (!track) {
    return
  }

  const rect = track.getBoundingClientRect()
  const start = window.scrollY + rect.top
  const end = start + track.offsetHeight - window.innerHeight
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  window.scrollTo({
    top: start + (end - start) * clampVerticalStarProgress(targetProgress),
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  })
}
