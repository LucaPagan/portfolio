import { useEffect, useRef, useState } from 'react'

export function useSkeletonOrbitProgress(chapterCount: number, reducedMotion: boolean) {
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
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

      // For Skeleton Orbit, we want raw 0-1 progress mapped linearly to chapters
      const visualProgress = clampedProgress
      const lastIndex = Math.max(chapterCount - 1, 0)
      const nextIndex = lastIndex === 0 ? 0 : Math.min(lastIndex, Math.max(0, Math.round(visualProgress * lastIndex)))

      setProgress((currentProgress) =>
        Math.abs(currentProgress - clampedProgress) > 0.001 ? clampedProgress : currentProgress,
      )

      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex
        setActiveIndex(nextIndex)
      }
    }

    const updateFromNativeScroll = () => {
      const trackElement = trackRef.current

      if (!trackElement) {
        return
      }

      const start = trackElement.offsetTop
      const end = start + trackElement.offsetHeight - window.innerHeight
      const nextProgress = end <= start ? 0 : (window.scrollY - start) / (end - start)

      updateProgress(nextProgress)
    }

    window.addEventListener('scroll', updateFromNativeScroll, { passive: true })
    window.addEventListener('resize', updateFromNativeScroll)

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
                snapTo: (value) => {
                  const lastIndex = Math.max(chapterCount - 1, 1)
                  return Math.round(value * lastIndex) / lastIndex
                },
                duration: { min: 0.18, max: 0.44 },
                delay: 0.08,
                ease: 'power2.out',
                inertia: false,
              },
          onUpdate: (self) => updateProgress(self.progress),
        })

        updateFromNativeScroll()
        ScrollTrigger.refresh()

        cleanup = () => trigger.kill()
      },
    )

    return () => {
      cancelled = true

      window.removeEventListener('scroll', updateFromNativeScroll)
      window.removeEventListener('resize', updateFromNativeScroll)
      cleanup?.()
    }
  }, [chapterCount, reducedMotion])

  return { activeIndex, progress, progressRef, trackRef }
}
