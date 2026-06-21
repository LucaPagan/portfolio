import { useEffect, useRef, useState } from 'react'
import { navItems } from '../data/portfolio'

export function Navigation() {
  const primaryItems = navItems.filter((item) => item.label !== 'Contact')
  const [activeHref, setActiveHref] = useState('#identity')
  const [hasScrolled, setHasScrolled] = useState(false)
  const activeHrefRef = useRef(activeHref)
  const hasScrolledRef = useRef(hasScrolled)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace('#', '')).filter(Boolean)

    const updateNavigationState = () => {
      frameRef.current = null
      const nextScrolled = window.scrollY > 24

      if (hasScrolledRef.current !== nextScrolled) {
        hasScrolledRef.current = nextScrolled
        setHasScrolled(nextScrolled)
      }

      const readLine = window.scrollY + window.innerHeight * 0.38
      const nextSection = sectionIds.reduce((current, id) => {
        const section = document.getElementById(id)

        if (!section) {
          return current
        }

        return section.offsetTop <= readLine ? `#${id}` : current
      }, '#identity')

      if (activeHrefRef.current !== nextSection) {
        activeHrefRef.current = nextSection
        setActiveHref(nextSection)
      }
    }

    const requestNavigationUpdate = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateNavigationState)
      }
    }

    updateNavigationState()
    window.addEventListener('scroll', requestNavigationUpdate, { passive: true })
    window.addEventListener('resize', requestNavigationUpdate)

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }

      window.removeEventListener('scroll', requestNavigationUpdate)
      window.removeEventListener('resize', requestNavigationUpdate)
    }
  }, [])

  return (
    <header className={`site-nav${hasScrolled ? ' is-scrolled' : ''}`} aria-label="Primary navigation">
      <a
        className={`brand-mark${activeHref === '#identity' ? ' is-active' : ''}`}
        href="#identity"
        aria-label="Luca Pagano home"
        aria-current={activeHref === '#identity' ? 'location' : undefined}
      >
        Luca Pagano
      </a>

      <nav className="nav-links">
        {primaryItems.map((item) => (
          <a
            aria-current={activeHref === item.href ? 'location' : undefined}
            className={activeHref === item.href ? 'is-active' : undefined}
            key={item.href}
            href={item.href}
          >
            {item.label}
          </a>
        ))}
        <a
          aria-current={activeHref === '#contact' ? 'location' : undefined}
          className={`nav-contact${activeHref === '#contact' ? ' is-active' : ''}`}
          href="#contact"
        >
          Contact
        </a>
      </nav>
    </header>
  )
}
