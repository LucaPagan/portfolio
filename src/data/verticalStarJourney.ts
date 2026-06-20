import {
  aboutProfile,
  contactItems,
  identity,
  profileHighlights,
  projects,
  skillGroups,
  timeline,
} from './portfolio'
import type { ContactItem, Project, SkillGroup, TimelineItem } from './portfolio'

export type VerticalStarChapterType =
  | 'intro'
  | 'about'
  | 'skills'
  | 'project'
  | 'timeline'
  | 'contact'

export type VerticalStarPosition = [number, number, number]

export type VerticalStarChapter = {
  id: string
  type: VerticalStarChapterType
  title: string
  eyebrow: string
  description: string
  accent: Project['accent']
  position: VerticalStarPosition
  navLabel: string
  progressTarget: number
  project?: Project
  skills?: SkillGroup[]
  timelineItems?: TimelineItem[]
  contactItems?: ContactItem[]
  paragraphs?: string[]
  metrics?: typeof profileHighlights
  ctaLabel?: string
  ctaHref?: string
}

export const verticalStarAccentColors: Record<Project['accent'], string> = {
  aqua: '#67e8f9',
  lime: '#b7ff6a',
  amber: '#ffb84d',
  coral: '#ff6558',
  violet: '#b27fff',
}

const verticalWaypointPositions: VerticalStarPosition[] = [
  [-0.5, 0, 0.08],
  [0.38, -1.34, -0.16],
  [-1.14, -2.98, 0.14],
  [-0.66, -4.72, -0.1],
  [1.22, -6.08, 0.16],
  [1.5, -7.62, -0.18],
  [-0.12, -9.22, 0.12],
  [-1.46, -10.72, -0.1],
  [0.94, -12.42, 0.14],
  [-0.62, -14.08, -0.16],
  [0.18, -15.74, 0.08],
]

const projectPositions = verticalWaypointPositions.slice(3, 9)

type ChapterBase = Omit<VerticalStarChapter, 'progressTarget'>

const projectChapters: ChapterBase[] = projects.map((project, index) => ({
  id: project.slug,
  type: 'project',
  title: project.title,
  eyebrow: project.eyebrow,
  description: project.problem,
  accent: project.accent,
  position: projectPositions[index] ?? [0, 0, 0],
  navLabel: project.title,
  project,
  ctaLabel: project.repository ? project.repoName ?? 'Repository' : undefined,
  ctaHref: project.repository,
}))

const baseVerticalStarChapters: ChapterBase[] = [
  {
    id: 'identity',
    type: 'intro',
    title: identity.title,
    eyebrow: identity.eyebrow,
    description: identity.description,
    accent: 'aqua',
    position: verticalWaypointPositions[0],
    navLabel: 'Identity',
    metrics: profileHighlights,
  },
  {
    id: 'about',
    type: 'about',
    title: aboutProfile.title,
    eyebrow: aboutProfile.eyebrow,
    description: aboutProfile.paragraphs[0],
    accent: 'lime',
    position: verticalWaypointPositions[1],
    navLabel: 'About',
    paragraphs: aboutProfile.paragraphs,
  },
  {
    id: 'skills',
    type: 'skills',
    title: 'Product thinking, technical craft.',
    eyebrow: 'Skills / Stack',
    description:
      'A technical stack shaped by product ownership, communication, curiosity and the habit of asking better questions.',
    accent: 'amber',
    position: verticalWaypointPositions[2],
    navLabel: 'Skills',
    skills: skillGroups,
  },
  ...projectChapters,
  {
    id: 'timeline',
    type: 'timeline',
    title: 'A trajectory of systems becoming products.',
    eyebrow: 'Timeline',
    description:
      'From raw sensor data on Apple Watch to the WWF Astroni platform, the path keeps moving toward more integrated products.',
    accent: 'violet',
    position: verticalWaypointPositions[9],
    navLabel: 'Timeline',
    timelineItems: timeline,
  },
  {
    id: 'contact',
    type: 'contact',
    title: "Let's talk.",
    eyebrow: 'Contact',
    description: 'Email, phone, LinkedIn and GitHub are the fastest ways to reach me.',
    accent: 'aqua',
    position: verticalWaypointPositions[10],
    navLabel: 'Contact',
    contactItems,
    ctaLabel: 'GitHub',
    ctaHref: 'https://github.com/LucaPagan',
  },
]

export const verticalStarChapters: VerticalStarChapter[] = baseVerticalStarChapters.map(
  (chapter, index, chapters) => ({
    ...chapter,
    progressTarget: index / Math.max(chapters.length - 1, 1),
  }),
)

export const verticalStarNavItems = [
  { label: 'About', targetId: 'about' },
  { label: 'Skills', targetId: 'skills' },
  { label: 'Projects', targetId: projects[0]?.slug ?? 'identity' },
  { label: 'Timeline', targetId: 'timeline' },
  { label: 'Contact', targetId: 'contact' },
].map((item) => {
  const chapter = verticalStarChapters.find((candidate) => candidate.id === item.targetId)

  return {
    ...item,
    href: `#${item.targetId}`,
    progressTarget: chapter?.progressTarget ?? 0,
  }
})

export const VERTICAL_STAR_ARRIVAL_RADIUS = 0.56

export function clampVerticalStarProgress(progress: number) {
  return Math.min(Math.max(progress, 0), 1)
}

export function getVerticalStarActiveIndex(progress: number, chapterCount: number) {
  const lastIndex = Math.max(chapterCount - 1, 0)

  if (lastIndex === 0) {
    return 0
  }

  return Math.min(lastIndex, Math.max(0, Math.round(clampVerticalStarProgress(progress) * lastIndex)))
}

export function getVerticalWaypointStrength(progress: number, waypointIndex: number, chapterCount: number) {
  const lastIndex = Math.max(chapterCount - 1, 1)
  const distance = Math.abs(clampVerticalStarProgress(progress) * lastIndex - waypointIndex)

  return Math.min(Math.max(1 - distance / VERTICAL_STAR_ARRIVAL_RADIUS, 0), 1)
}

export function easeVerticalStarProgress(progress: number, chapterCount: number) {
  const clampedProgress = clampVerticalStarProgress(progress)
  const lastIndex = Math.max(chapterCount - 1, 1)
  const scaledProgress = clampedProgress * lastIndex
  const segmentIndex = Math.min(Math.floor(scaledProgress), lastIndex - 1)
  const localProgress = scaledProgress - segmentIndex
  const easedLocal = localProgress * localProgress * (3 - 2 * localProgress)

  return (segmentIndex + easedLocal) / lastIndex
}

export function snapVerticalStarProgress(progress: number, chapterCount: number) {
  const lastIndex = Math.max(chapterCount - 1, 1)

  return Math.round(clampVerticalStarProgress(progress) * lastIndex) / lastIndex
}
