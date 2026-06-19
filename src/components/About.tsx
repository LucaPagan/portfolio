import { Cpu, Layers3, Radar } from 'lucide-react'
import { SectionHeader } from './SectionHeader'

const notes = [
  {
    icon: Cpu,
    title: 'Engineering fisico-digitale',
    copy: 'Sensori, modelli locali, haptics e app companion: mi interessa il punto in cui il software legge il mondo reale.',
  },
  {
    icon: Layers3,
    title: 'Prodotti con profondita',
    copy: 'Dati offline, sincronizzazione e ruoli operativi: le interfacce sono curate, ma poggiano su architetture concrete.',
  },
  {
    icon: Radar,
    title: 'UX ad alta intensita',
    copy: 'Game loop, microinterazioni, onboarding e strumenti admin: progetto flussi che danno feedback chiaro.',
  },
]

export function About() {
  return (
    <section id="about" className="section about-section">
      <SectionHeader
        eyebrow="Profilo"
        title="Creative engineer con fondamenta da systems thinker."
        description="Dai repository emerge una traiettoria molto pratica: impari una tecnologia costruendoci sopra un prodotto, poi la colleghi a dati, device, rete e comportamento utente."
      />

      <div className="about-grid">
        <div className="about-copy reveal">
          <p>
            Il tuo lavoro attraversa Apple ecosystem, Android, backend e sistemi concorrenti. La parte
            interessante e coerente e la capacita di costruire esperienze end-to-end: dal dato grezzo
            del sensore alla UI, dalla cache locale al sync remoto, dal prototipo alla demo
            containerizzata.
          </p>
          <p>
            Il portfolio quindi non ti presenta come “solo developer”, ma come una figura capace di
            dare forma a prodotti tecnici con una sensibilita forte per interazione, ritmo e affidabilita.
          </p>
        </div>

        <div className="about-notes">
          {notes.map((note) => {
            const Icon = note.icon
            return (
              <article className="note-card reveal" key={note.title}>
                <Icon aria-hidden="true" size={22} />
                <h3>{note.title}</h3>
                <p>{note.copy}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
