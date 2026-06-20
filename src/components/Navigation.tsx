import { Code2 } from 'lucide-react'
import { verticalStarNavItems } from '../data/verticalStarJourney'
import { scrollToVerticalJourneyProgress } from '../utils/verticalStarScroll'

export function Navigation() {
  return (
    <header className="site-nav" aria-label="Primary navigation">
      <a
        className="brand-mark"
        href="#identity"
        aria-label="Luca Pagano home"
        onClick={(event) => {
          event.preventDefault()
          scrollToVerticalJourneyProgress(0)
        }}
      >
        <Code2 aria-hidden="true" size={18} />
        <span>LP</span>
      </a>

      <nav className="nav-links">
        {verticalStarNavItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(event) => {
              event.preventDefault()
              scrollToVerticalJourneyProgress(item.progressTarget)
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
