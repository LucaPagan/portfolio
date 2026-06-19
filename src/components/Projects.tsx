import { projects } from '../data/portfolio'
import { ProjectCard } from './ProjectCard'
import { SectionHeader } from './SectionHeader'

type ProjectsProps = {
  reducedMotion: boolean
}

export function Projects({ reducedMotion }: ProjectsProps) {
  return (
    <section id="projects" className="section projects-section">
      <SectionHeader
        eyebrow="Projects"
        title="Case studies ricavati dai repository GitHub."
        description="Una selezione curata dei progetti piu rappresentativi: mobile native, AI, sistemi, backend e tooling operativo."
      />

      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={index}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  )
}
