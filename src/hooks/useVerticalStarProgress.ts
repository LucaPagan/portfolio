import { useEffect, useRef, useState } from 'react'
import { getVerticalStarActiveIndex, snapVerticalStarProgress } from '../data/verticalStarJourney'

export function useVerticalStarProgress(chapterCount: number, reducedMotion: boolean) {
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const frameRef = useRef<number | null>(null)
  const activeIndexRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!trackRef.current) {
      return undefined
    }

    let cancelled = false
    let cleanup: (() => void) | undefined

    const updateProgress = (nextProgress: number) => {
      const clampedProgress = Math.min(Math.max(nextProgress, 0), 1)
      progressRef.current = clampedProgress

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }

      frameRef.current = window.requestAnimationFrame(() => {
        const nextIndex = getVerticalStarActiveIndex(clampedProgress, chapterCount)

        setProgress(clampedProgress)

        if (nextIndex !== activeIndexRef.current) {
          activeIndexRef.current = nextIndex
          setActiveIndex(nextIndex)
        }
      })
    }

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapModule, scrollTriggerModule]) => {
        if (cancelled || !trackRef.current) {
          return
        }

        const { gsap } = gsapModule
        const { ScrollTrigger } = scrollTriggerModule

        gsap.registerPlugin(ScrollTrigger)

        const trigger = ScrollTrigger.create({
          trigger: trackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reducedMotion ? false : 0.62,
          snap: reducedMotion
            ? undefined
            : {
                snapTo: (value) => snapVerticalStarProgress(value, chapterCount),
                duration: { min: 0.18, max: 0.44 },
                delay: 0.08,
                ease: 'power2.out',
                inertia: false,
              },
          onUpdate: (self) => updateProgress(self.progress),
        })

        updateProgress(trigger.progress)
        ScrollTrigger.refresh()

        cleanup = () => trigger.kill()
      },
    )

    return () => {
      cancelled = true

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }

      cleanup?.()
    }
  }, [chapterCount, reducedMotion])

  return { activeIndex, progress, progressRef, trackRef }
}
