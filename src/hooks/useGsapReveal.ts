import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function useGsapReveal() {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      gsap.set('.reveal', { autoAlpha: 1, y: 0, filter: 'blur(0px)' })
      return undefined
    }

    const context = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>('.reveal')

      revealItems.forEach((element, index) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 42, filter: 'blur(16px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            delay: (index % 3) * 0.04,
            scrollTrigger: {
              trigger: element,
              start: 'top 86%',
              once: true,
            },
          },
        )
      })
    })

    return () => context.revert()
  }, [prefersReducedMotion])
}
