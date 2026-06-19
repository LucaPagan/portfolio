import { Code2 } from 'lucide-react'
import { navItems } from '../data/portfolio'

export function Navigation() {
  return (
    <header className="site-nav" aria-label="Primary navigation">
      <a className="brand-mark" href="#top" aria-label="Luca Pagano home">
        <Code2 aria-hidden="true" size={18} />
        <span>LP</span>
      </a>

      <nav className="nav-links">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
