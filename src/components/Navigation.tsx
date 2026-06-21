import { useEffect, useState } from 'react'
import { navItems } from '../data/portfolio'

export function Navigation() {
  const primaryItems = navItems.filter((item) => item.label !== 'Contact')
  const [activeHref, setActiveHref] = useState('#identity')
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const updateScrolled = () => setHasScrolled(window.scrollY > 24)
    updateScrolled()
    window.addEventListener('scroll', updateScrolled, { passive: true })

    return () => window.removeEventListener('scroll', updateScrolled)
  }, [])

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace('#', '')).filter(Boolean)

    const updateActiveSection = () => {
      const readLine = window.scrollY + window.innerHeight * 0.38
      const nextSection = sectionIds.reduce((current, id) => {
        const section = document.getElementById(id)

        if (!section) {
          return current
        }

        return section.offsetTop <= readLine ? `#${id}` : current
      }, '#identity')

      setActiveHref(nextSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
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
