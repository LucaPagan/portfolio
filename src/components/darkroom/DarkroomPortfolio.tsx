import { ArrowUpRight, GitBranch } from 'lucide-react'
import {
  aboutProfile,
  contactItems,
  heroFocus,
  identity,
  projects,
  skillGroups,
  timeline,
} from '../../data/portfolio'

function InlineList({ items, variant = 'default' }: { items: string[]; variant?: 'default' | 'signal' }) {
  return (
    <ul className={`darkroom-inline-list darkroom-inline-list--${variant}`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function DarkroomPortfolio() {
  return (
    <div className="darkroom-portfolio">
      <section className="darkroom-section darkroom-hero" id="identity">
        <div className="darkroom-hero__copy">
          <p className="darkroom-kicker">{identity.eyebrow}</p>
          <h1>
            <span>Luca</span>
            <span>Pagano</span>
          </h1>
        </div>

        <div className="darkroom-hero__note">
          <p className="darkroom-hero__lead">{identity.description}</p>
          <div className="darkroom-hero-focus" aria-label="Working focus">
            <p className="darkroom-kicker">{heroFocus.eyebrow}</p>
            <p className="darkroom-hero-focus__title">{heroFocus.title}</p>
            <div className="darkroom-hero-focus__list">
              {heroFocus.items.map((item, index) => (
                <article className="darkroom-hero-focus__item" key={item.label}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="darkroom-section darkroom-manifesto" id="about">
        <div className="darkroom-section__intro">
          <p className="darkroom-kicker">{aboutProfile.eyebrow}</p>
          <p>{aboutProfile.paragraphs[0]}</p>
        </div>
        <h2>{aboutProfile.title}</h2>
        <div className="darkroom-copy-columns">
          {aboutProfile.paragraphs.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="darkroom-section darkroom-skills" id="skills">
        <div className="darkroom-section__intro">
          <p className="darkroom-kicker">Skills / Stack</p>
          <p>
            A technical stack shaped by product ownership, communication, curiosity and the habit of asking
            better questions.
          </p>
        </div>
        <h2>
          Product thinking,
          <br />
          technical craft.
        </h2>
        <div className="darkroom-skill-list">
          {skillGroups.map((group) => (
            <article className="darkroom-skill-row" key={group.title}>
              <div>
                <span>{group.title}</span>
                <p>{group.description}</p>
              </div>
              <InlineList items={group.items} />
            </article>
          ))}
        </div>
      </section>

      <section className="darkroom-section darkroom-work" id="projects">
        <div className="darkroom-section__intro">
          <p className="darkroom-kicker">Projects / Work</p>
          <p>Six case studies, from offline-first platforms to watchOS ML and networked systems.</p>
        </div>
        <h2>Selected work, built with product intent.</h2>
        <div className="darkroom-project-list">
          {projects.map((project, index) => (
            <article className="darkroom-project" data-accent={project.accent} id={project.slug} key={project.slug}>
              <div className="darkroom-project__number">{String(index + 1).padStart(2, '0')}</div>
              <div className="darkroom-project__headline">
                <p>
                  {project.eyebrow} / {project.year}
                </p>
                <h3>{project.title}</h3>
              </div>
              <div className="darkroom-project__body">
                <p>
                  <strong>Problem</strong>
                  {project.problem}
                </p>
                <p>
                  <strong>Solution</strong>
                  {project.solution}
                </p>
                <p>
                  <strong>Impact</strong>
                  {project.impact}
                </p>
                <div className="darkroom-project__meta">
                  <div className="darkroom-project__tag-group">
                    <span className="darkroom-project__tag-label">Stack</span>
                    <InlineList items={project.stack} />
                  </div>
                  <div className="darkroom-project__tag-group">
                    <span className="darkroom-project__tag-label">Signals</span>
                    <InlineList items={project.signals} variant="signal" />
                  </div>
                </div>
                {project.repository ? (
                  <a
                    aria-label={`Open ${project.title} on GitHub`}
                    className="darkroom-repo-button"
                    href={project.repository}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <GitBranch aria-hidden="true" size={18} />
                    <span>
                      <strong>View on GitHub</strong>
                      <small>{project.repoName ?? project.title}</small>
                    </span>
                    <ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="darkroom-section darkroom-timeline" id="timeline">
        <div className="darkroom-section__intro">
          <p className="darkroom-kicker">Timeline</p>
          <p>
            From raw sensor data on Apple Watch to the WWF Astroni platform, the path keeps moving toward
            more integrated products.
          </p>
        </div>
        <h2>A trajectory of systems becoming products.</h2>
        <div className="darkroom-timeline-list">
          {timeline.map((item) => (
            <article className="darkroom-timeline-row" key={`${item.period}-${item.title}`}>
              <span>{item.period}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="darkroom-section darkroom-contact" id="contact">
        <p className="darkroom-kicker">Contact</p>
        <h2>Let&apos;s talk.</h2>
        <p>Email, phone, LinkedIn and GitHub are the fastest ways to reach me.</p>
        <div className="darkroom-contact-list">
          {contactItems.map((item) => (
            <a href={item.href} key={item.href} rel="noreferrer" target={item.href.startsWith('http') ? '_blank' : undefined}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              {item.href.startsWith('http') ? <ArrowUpRight aria-hidden="true" size={18} /> : null}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
