import { timeline } from '../data/portfolio'
import { SectionHeader } from './SectionHeader'

export function Timeline() {
  return (
    <section id="timeline" className="section timeline-section">
      <SectionHeader
        eyebrow="Experience"
        title="Una traiettoria che si allarga senza perdere densita."
        description="La timeline racconta l'evoluzione tecnica: prima device e segnali, poi product stack, sistemi concorrenti e piattaforme offline-first."
      />

      <div className="timeline-list">
        {timeline.map((item) => (
          <article className="timeline-item reveal" key={item.period}>
            <span>{item.period}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
