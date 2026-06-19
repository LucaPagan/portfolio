import { Activity, Blocks, DatabaseZap, Gamepad2, Smartphone } from 'lucide-react'
import { skillGroups } from '../data/portfolio'
import { SectionHeader } from './SectionHeader'

const icons = [Smartphone, Activity, DatabaseZap, Blocks, Gamepad2]

export function Skills() {
  return (
    <section id="skills" className="section skills-section">
      <SectionHeader
        eyebrow="Skills"
        title="Stack ampio, ma con un centro preciso: prodotti interattivi."
        description="Le competenze sono organizzate per sistemi reali, non per buzzword: native apps, segnali, cloud, concorrenza e frontend craft."
      />

      <div className="skills-grid">
        {skillGroups.map((group, index) => {
          const Icon = icons[index]

          return (
            <article className="skill-card reveal" key={group.title}>
              <div className="skill-icon">
                <Icon aria-hidden="true" size={22} />
              </div>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <div className="skill-tags">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
