import { lazy, Suspense } from 'react'
import { ArrowDown, GitBranch, Sparkle } from 'lucide-react'
import { motion } from 'motion/react'
import { profileHighlights } from '../data/portfolio'
import { MagneticButton } from './MagneticButton'

const HeroScene = lazy(() =>
  import('./HeroScene').then((module) => ({ default: module.HeroScene })),
)

type HeroProps = {
  reducedMotion: boolean
}

export function Hero({ reducedMotion }: HeroProps) {
  const name = 'Luca Pagano'
  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.95, ease: [0.16, 1, 0.3, 1] as const }
  const staggerDelay = reducedMotion ? 0 : 0.028

  return (
    <section id="top" className="hero-section">
      <div className="hero-backdrop" aria-hidden="true" />
      <motion.div
        className="hero-intro-wash"
        aria-hidden="true"
        initial={reducedMotion ? false : { scaleX: 0, opacity: 1 }}
        animate={reducedMotion ? { opacity: 0 } : { scaleX: 1, opacity: 0 }}
        transition={{ duration: 1.25, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="hero-letterbox hero-letterbox-top"
        aria-hidden="true"
        initial={reducedMotion ? false : { y: 0 }}
        animate={reducedMotion ? { y: '-100%' } : { y: '-100%' }}
        transition={{ duration: reducedMotion ? 0 : 1.1, delay: reducedMotion ? 0 : 0.15, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="hero-letterbox hero-letterbox-bottom"
        aria-hidden="true"
        initial={reducedMotion ? false : { y: 0 }}
        animate={reducedMotion ? { y: '100%' } : { y: '100%' }}
        transition={{ duration: reducedMotion ? 0 : 1.1, delay: reducedMotion ? 0 : 0.15, ease: [0.76, 0, 0.24, 1] }}
      />
      <div className="hero-scanlines" aria-hidden="true" />
      <div className="hero-light-beam" aria-hidden="true" />
      <Suspense fallback={<div className="hero-scene hero-scene-fallback" aria-hidden="true" />}>
        <HeroScene reducedMotion={reducedMotion} />
      </Suspense>

      <motion.div
        className="hero-content"
        initial={reducedMotion ? false : 'hidden'}
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              delayChildren: 0.48,
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <motion.div
          className="hero-kicker"
          variants={{
            hidden: { opacity: 0, y: 18, filter: 'blur(12px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)', transition },
          }}
        >
          <Sparkle aria-hidden="true" size={15} />
          Mobile systems / AI signals / product craft
        </motion.div>

        <motion.h1
          className="hero-title"
          aria-label={name}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: staggerDelay,
              },
            },
          }}
        >
          {name.split('').map((character, index) => (
            <motion.span
              aria-hidden="true"
              className="hero-title-character"
              key={`${character}-${index}`}
              variants={{
                hidden: {
                  opacity: 0,
                  y: reducedMotion ? 0 : 56,
                  rotateX: reducedMotion ? 0 : -72,
                  filter: 'blur(14px)',
                },
                show: {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  filter: 'blur(0px)',
                  transition,
                },
              }}
            >
              {character === ' ' ? '\u00A0' : character}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="hero-payoff"
          variants={{
            hidden: { opacity: 0, y: 26, filter: 'blur(12px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)', transition },
          }}
        >
          Creo esperienze native e sistemi interattivi dove UI, dati locali, sensori e backend
          lavorano insieme senza farsi notare.
        </motion.p>

        <motion.div
          className="hero-actions"
          variants={{
            hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)', transition },
          }}
        >
          <MagneticButton
            className="button button-primary"
            href="#projects"
            reducedMotion={reducedMotion}
          >
            <ArrowDown aria-hidden="true" size={18} />
            Vedi progetti
          </MagneticButton>
          <MagneticButton
            className="button button-ghost"
            href="https://github.com/LucaPagan"
            target="_blank"
            rel="noreferrer"
            reducedMotion={reducedMotion}
          >
            <GitBranch aria-hidden="true" size={18} />
            GitHub
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-metrics"
        aria-label="Portfolio highlights"
        initial={reducedMotion ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition, delay: reducedMotion ? 0 : 1.2 }}
      >
        {profileHighlights.map((item) => (
          <motion.div
            key={item.label}
            className="metric-chip"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: reducedMotion ? 0 : 1.22 }}
          >
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
