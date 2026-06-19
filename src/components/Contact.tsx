import { ArrowUpRight, GitBranch, UserRound } from 'lucide-react'
import { SectionHeader } from './SectionHeader'

export function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <SectionHeader
        eyebrow="Contact"
        title="Costruiamo qualcosa che sembra semplice perche e fatto bene."
        description="Sono piu interessante quando il progetto ha un'interfaccia curata, ma anche logica applicativa, dati, device o sistemi da mettere in ordine."
      />

      <div className="contact-panel reveal">
        <div>
          <p className="contact-label">Open to</p>
          <h3>Mobile products, prototypes, AI-on-device experiments, tools and interactive systems.</h3>
        </div>

        <div className="contact-actions">
          <a className="button button-primary" href="https://github.com/LucaPagan" target="_blank" rel="noreferrer">
            <GitBranch aria-hidden="true" size={18} />
            GitHub
            <ArrowUpRight aria-hidden="true" size={17} />
          </a>
          <a className="button button-ghost" href="https://github.com/LucaPagan" target="_blank" rel="noreferrer">
            <UserRound aria-hidden="true" size={18} />
            Profilo
          </a>
        </div>
      </div>
    </section>
  )
}
