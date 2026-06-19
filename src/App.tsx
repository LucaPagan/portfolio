import { About } from './components/About'
import { Contact } from './components/Contact'
import { CursorFollower } from './components/CursorFollower'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Navigation } from './components/Navigation'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Timeline } from './components/Timeline'
import { useGsapReveal } from './hooks/useGsapReveal'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import './styles/site.css'

function App() {
  useGsapReveal()
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div className="site-shell">
      <CursorFollower reducedMotion={reducedMotion} />
      <Navigation />
      <main>
        <Hero reducedMotion={reducedMotion} />
        <About />
        <Skills />
        <Projects reducedMotion={reducedMotion} />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
