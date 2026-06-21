import type { PointerEvent } from 'react'
import { ArrowDown, ArrowUpRight, GitBranch } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import {
  aboutProfile,
  contactItems,
  heroFocus,
  identity,
  projects,
  skillGroups,
  timeline,
} from '../../data/portfolio'
import { useDesktopMotion } from '../../hooks/useDesktopMotion'

const revealViewport = {
  once: true,
  margin: '-80px 0px -14% 0px',
} as const

const revealContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.03,
    },
  },
}

const revealItem = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.12,
    },
  },
}

const heroNameLine = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.78,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

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
  const shouldReduceMotion = useReducedMotion()
  const desktopMotion = useDesktopMotion(Boolean(shouldReduceMotion))
  const { scrollYProgress } = useScroll()
  const heroCopyY = useTransform(scrollYProgress, [0, 0.22], [0, -28])
  const heroNoteY = useTransform(scrollYProgress, [0, 0.22], [0, -16])
  const heroAmbientY = useTransform(scrollYProgress, [0, 0.32], [0, 34])
  const revealInitial = shouldReduceMotion ? false : 'hidden'
  const revealWhileInView = shouldReduceMotion ? undefined : 'visible'
  const heroInitial = shouldReduceMotion ? false : 'hidden'
  const heroAnimate = shouldReduceMotion ? undefined : 'visible'

  const handleProjectPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!desktopMotion) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = (event.clientX - rect.left) / rect.width
    const pointerY = (event.clientY - rect.top) / rect.height
    const tiltX = (0.5 - pointerY) * 2.2
    const tiltY = (pointerX - 0.5) * 2.8

    event.currentTarget.style.setProperty('--pointer-x', `${Math.round(pointerX * 100)}%`)
    event.currentTarget.style.setProperty('--pointer-y', `${Math.round(pointerY * 100)}%`)
    event.currentTarget.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`)
    event.currentTarget.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`)
  }

  const handleProjectPointerLeave = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.removeProperty('--tilt-x')
    event.currentTarget.style.removeProperty('--tilt-y')
    event.currentTarget.style.removeProperty('--pointer-x')
    event.currentTarget.style.removeProperty('--pointer-y')
  }

  return (
    <div className="darkroom-portfolio">
      <div className="darkroom-ambient" aria-hidden="true">
        <span className="darkroom-noise" />
        <motion.span
          className="darkroom-orbit darkroom-orbit--one"
          style={desktopMotion ? { y: heroAmbientY } : undefined}
        />
        <span className="darkroom-orbit darkroom-orbit--two" />
      </div>

      <motion.section
        animate={heroAnimate}
        className="darkroom-section darkroom-hero"
        id="identity"
        initial={heroInitial}
        variants={heroContainer}
      >
        <motion.div
          className="darkroom-hero__copy"
          style={desktopMotion ? { y: heroCopyY } : undefined}
          variants={revealItem}
        >
          <p className="darkroom-kicker">{identity.eyebrow}</p>
          <motion.h1 className="darkroom-hero__title" variants={heroContainer}>
            <motion.span variants={heroNameLine}>Luca</motion.span>
            <motion.span variants={heroNameLine}>Pagano</motion.span>
          </motion.h1>
        </motion.div>

        <motion.div
          className="darkroom-hero__note"
          style={desktopMotion ? { y: heroNoteY } : undefined}
          variants={revealContainer}
        >
          <motion.p className="darkroom-hero__lead" variants={revealItem}>
            {identity.description}
          </motion.p>
          <motion.div className="darkroom-hero-focus" aria-label="Working focus" variants={revealContainer}>
            <motion.p className="darkroom-kicker" variants={revealItem}>
              {heroFocus.eyebrow}
            </motion.p>
            <motion.p className="darkroom-hero-focus__title" variants={revealItem}>
              {heroFocus.title}
            </motion.p>
            <motion.div className="darkroom-hero-focus__list" variants={revealContainer}>
              {heroFocus.items.map((item, index) => (
                <motion.article className="darkroom-hero-focus__item" key={item.label} variants={revealItem}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.description}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.a className="darkroom-scroll-cue" href="#about" variants={revealItem}>
          <span>Enter portfolio</span>
          <ArrowDown aria-hidden="true" size={15} />
        </motion.a>
        <span className="darkroom-hero-mark darkroom-hero-mark--one" aria-hidden="true">
          40.85N / 14.27E
        </span>
        <span className="darkroom-hero-mark darkroom-hero-mark--two" aria-hidden="true">
          WHY / CODE / TEAM
        </span>
      </motion.section>

      <motion.section
        className="darkroom-section darkroom-manifesto"
        id="about"
        initial={revealInitial}
        variants={revealContainer}
        viewport={revealViewport}
        whileInView={revealWhileInView}
      >
        <motion.div className="darkroom-section__intro" variants={revealItem}>
          <p className="darkroom-kicker">{aboutProfile.eyebrow}</p>
          <p>{aboutProfile.paragraphs[0]}</p>
        </motion.div>
        <motion.h2 variants={revealItem}>{aboutProfile.title}</motion.h2>
        <motion.div className="darkroom-copy-columns" variants={revealContainer}>
          {aboutProfile.paragraphs.slice(1).map((paragraph) => (
            <motion.p key={paragraph} variants={revealItem}>
              {paragraph}
            </motion.p>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="darkroom-section darkroom-skills"
        id="skills"
        initial={revealInitial}
        variants={revealContainer}
        viewport={revealViewport}
        whileInView={revealWhileInView}
      >
        <motion.div className="darkroom-section__intro" variants={revealItem}>
          <p className="darkroom-kicker">Skills / Stack</p>
          <p>
            A technical stack shaped by product ownership, communication, curiosity and the habit of asking
            better questions.
          </p>
        </motion.div>
        <motion.h2 variants={revealItem}>
          Product thinking,
          <br />
          technical craft.
        </motion.h2>
        <motion.div className="darkroom-skill-list" variants={revealContainer}>
          {skillGroups.map((group) => (
            <motion.article className="darkroom-skill-row" key={group.title} variants={revealItem}>
              <div>
                <span>{group.title}</span>
                <p>{group.description}</p>
              </div>
              <InlineList items={group.items} />
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="darkroom-section darkroom-work"
        id="projects"
        initial={revealInitial}
        variants={revealContainer}
        viewport={revealViewport}
        whileInView={revealWhileInView}
      >
        <motion.div className="darkroom-section__intro" variants={revealItem}>
          <p className="darkroom-kicker">Projects / Work</p>
          <p>Six case studies, from offline-first platforms to watchOS ML and networked systems.</p>
        </motion.div>
        <motion.h2 variants={revealItem}>Selected work, built with product intent.</motion.h2>
        <motion.div className="darkroom-project-list" variants={revealContainer}>
          {projects.map((project, index) => (
            <motion.div className="darkroom-project-reveal" key={project.slug} variants={revealItem}>
              <article
                className="darkroom-project"
                data-accent={project.accent}
                id={project.slug}
                onPointerLeave={handleProjectPointerLeave}
                onPointerMove={handleProjectPointerMove}
              >
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
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="darkroom-section darkroom-timeline"
        id="timeline"
        initial={revealInitial}
        variants={revealContainer}
        viewport={revealViewport}
        whileInView={revealWhileInView}
      >
        <motion.div className="darkroom-section__intro" variants={revealItem}>
          <p className="darkroom-kicker">Timeline</p>
          <p>
            From raw sensor data on Apple Watch to the WWF Astroni platform, the path keeps moving toward
            more integrated products.
          </p>
        </motion.div>
        <motion.h2 variants={revealItem}>A trajectory of systems becoming products.</motion.h2>
        <motion.div className="darkroom-timeline-list" variants={revealContainer}>
          {timeline.map((item) => (
            <motion.article className="darkroom-timeline-row" key={`${item.period}-${item.title}`} variants={revealItem}>
              <span>{item.period}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="darkroom-section darkroom-contact"
        id="contact"
        initial={revealInitial}
        variants={revealContainer}
        viewport={revealViewport}
        whileInView={revealWhileInView}
      >
        <motion.p className="darkroom-kicker" variants={revealItem}>
          Contact
        </motion.p>
        <motion.h2 variants={revealItem}>Let&apos;s talk.</motion.h2>
        <motion.p variants={revealItem}>Email, phone, LinkedIn and GitHub are the fastest ways to reach me.</motion.p>
        <motion.div className="darkroom-contact-list" variants={revealContainer}>
          {contactItems.map((item) => (
            <motion.a
              href={item.href}
              key={item.href}
              rel="noreferrer"
              target={item.href.startsWith('http') ? '_blank' : undefined}
              variants={revealItem}
            >
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              {item.href.startsWith('http') ? <ArrowUpRight aria-hidden="true" size={18} /> : null}
            </motion.a>
          ))}
        </motion.div>
      </motion.section>
    </div>
  )
}
