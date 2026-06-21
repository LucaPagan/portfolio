import { CursorFollower } from './components/CursorFollower'
import { DarkroomPortfolio } from './components/darkroom/DarkroomPortfolio'
import { Navigation } from './components/Navigation'
import { useDesktopMotion } from './hooks/useDesktopMotion'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import './styles/darkroomPortfolio.css'
import './styles/site.css'

function App() {
  const reducedMotion = usePrefersReducedMotion()
  const desktopMotion = useDesktopMotion(reducedMotion)

  return (
    <div className="site-shell">
      {desktopMotion ? <CursorFollower /> : null}
      <Navigation />
      <main>
        <DarkroomPortfolio />
      </main>
    </div>
  )
}

export default App
