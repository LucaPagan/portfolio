import { navItems } from '../data/portfolio'

export function Navigation() {
  const primaryItems = navItems.filter((item) => item.label !== 'Contact')

  return (
    <header className="site-nav" aria-label="Primary navigation">
      <a
        className="brand-mark"
        href="#identity"
        aria-label="Luca Pagano home"
      >
        Luca Pagano
      </a>

      <nav className="nav-links">
        {primaryItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        <a className="nav-contact" href="#contact">
          Contact
        </a>
      </nav>
    </header>
  )
}
