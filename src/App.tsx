import { CursorFollower } from './components/CursorFollower'
import { Navigation } from './components/Navigation'
import { VerticalStarJourney } from './components/starJourney/VerticalStarJourney'
import { useDesktopMotion } from './hooks/useDesktopMotion'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import './styles/site.css'
import './styles/verticalStarJourney.css'

function App() {
  const reducedMotion = usePrefersReducedMotion()
  const desktopMotion = useDesktopMotion(reducedMotion)

  return (
    <div className="site-shell">
      {desktopMotion ? <CursorFollower /> : null}
      <Navigation />
      <main>
        <VerticalStarJourney reducedMotion={reducedMotion} />
      </main>
    </div>
  )
}

export default App
