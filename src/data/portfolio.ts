export type Project = {
  slug: string
  title: string
  eyebrow: string
  year: string
  repository?: string
  repoName?: string
  problem: string
  solution: string
  impact: string
  stack: string[]
  signals: string[]
  accent: 'aqua' | 'lime' | 'amber' | 'coral' | 'violet'
}

export type SkillGroup = {
  title: string
  description: string
  items: string[]
  highlights?: {
    label: string
    description: string
  }[]
}

export type TimelineItem = {
  period: string
  title: string
  description: string
}

export type ContactItem = {
  label: string
  value: string
  href: string
}

export const identity = {
  title: 'Luca Pagano',
  eyebrow: 'Identity',
  description: 'Developer at heart. Builder of better questions.',
}

export const aboutProfile = {
  title: 'Builder of better questions.',
  eyebrow: 'About / Profile',
  paragraphs: [
    "I'm Luca, a Computer Science student at Federico II and a Student at the Apple Developer Academy.",
    'I started coding because I found it almost magical: a few lines on a screen, and you can solve real problems for real people. That feeling of impact is still what drives everything I do.',
    'But the more projects I built, the more I noticed something: as a developer, I felt limited. Not by skill, but by scope. I realized I give my best when I have freedom, freedom to question the "why," shape the direction, and make decisions, not just execute them. That\'s when my creativity and my rational, problem-solving side really come together.',
    "I'm also a connector by nature. I care about keeping a team aligned, motivated, and moving in the same direction, and I think that's where I can create the most impact.",
    "So I'm not moving away from development. I'm moving toward the role where my impact has no ceiling.",
  ],
}

export const contactItems: ContactItem[] = [
  {
    label: 'Email',
    value: 'lucapagano04@gmail.com',
    href: 'mailto:lucapagano04@gmail.com',
  },
  {
    label: 'Phone',
    value: '+39 351 16 31 787',
    href: 'tel:+393511631787',
  },
  {
    label: 'LinkedIn',
    value: 'www.linkedin.com/in/luca-pagano-33b70430b',
    href: 'https://www.linkedin.com/in/luca-pagano-33b70430b',
  },
  {
    label: 'GitHub',
    value: 'GitHub',
    href: 'https://github.com/LucaPagan',
  },
]

export const heroFocus = {
  eyebrow: 'How I work',
  title: 'I turn technical curiosity into product direction.',
  items: [
    {
      label: 'Product thinking',
      description: 'I start from the why, then shape priorities, flows and trade-offs.',
    },
    {
      label: 'Native craft',
      description: 'I build mobile products, data flows and systems with enough depth to feel real.',
    },
    {
      label: 'Team alignment',
      description: 'I care about keeping people focused, motivated and moving with ownership.',
    },
  ],
}

export const profileHighlights = [
  {
    value: 'WHY',
    label: 'product direction',
  },
  {
    value: 'CODE',
    label: 'native craft',
  },
  {
    value: 'TEAM',
    label: 'alignment and ownership',
  },
]

export const projects: Project[] = [
  {
    slug: 'wwf-astroni-immersive-journey',
    title: 'WWF Astroni - Immersive Journey',
    eyebrow: 'offline-first nature platform',
    year: '2026',
    problem:
      'Merge visitor experience and operational management for the WWF Astroni Oasis, keeping routes, POIs, events, media, and gamification reliable even with an unstable network connection.',
    solution:
      'A platform composed of an offline-first SwiftUI visitor app and an iPadOS management console: local SwiftData, Supabase, downloadable content, offline QR codes, media storage, and controlled sync.',
    impact:
      'A unified ecosystem: visitors enjoy an immersive and resilient journey, while management can prepare content, packages, and updates without losing operational control.',
    stack: ['SwiftUI', 'iPadOS', 'SwiftData', 'Supabase', 'Offline sync'],
    signals: ['Visitor app + admin console', 'QR offline', 'Media packages'],
    accent: 'aqua',
  },
  {
    slug: 'bicep-curl-counter',
    title: 'BicepCurlCounter',
    eyebrow: 'watchOS + Create ML',
    year: '2025',
    repository: 'https://github.com/LucaPagan/Americano-Challenge-2-',
    repoName: 'Americano-Challenge-2-',
    problem:
      'Recognize bicep curl repetitions from Apple Watch accelerometer and gyroscope, starting from raw data collected in real-world conditions.',
    solution:
      'End-to-end pipeline: 50Hz watchOS data logger, CSV export to iPhone, Create ML training, and a final app with a 100-sample sliding window, anti-jitter filter, and state machine.',
    impact:
      'End-to-end on-device ML prototype for fitness: realtime inference, haptic feedback, configurable goals from iPhone, and set history via WatchConnectivity.',
    stack: ['watchOS', 'CoreMotion', 'Core ML', 'Create ML', 'WatchConnectivity'],
    signals: ['50Hz sampling', '100-sample window', 'Anti-jitter filter'],
    accent: 'amber',
  },
  {
    slug: 'tris',
    title: 'TRIS',
    eyebrow: 'laboratorio sistemi operativi',
    year: '2026',
    repository: 'https://github.com/LucaPagan/Tic-Tac-Toe-LSO',
    repoName: 'Tic-Tac-Toe-LSO',
    problem:
      'Build a multiplayer Tic-Tac-Toe game with concurrency, lobbies, join requests, and isolated matches between clients for the Operating Systems Laboratory exam.',
    solution:
      'Client-server architecture with TCP sockets: multithreaded POSIX C server, network opcodes, session state machine, dark theme JavaFX client, and a scalable demo with Docker Compose.',
    impact:
      'Complete university project: state synchronization, unique session IDs, rematches, lobby broadcasting, and repeatable startup with Docker to test multiple clients.',
    stack: ['C', 'POSIX threads', 'TCP sockets', 'JavaFX', 'Docker Compose'],
    signals: ['Network opcodes', 'Session states', 'Docker scaling'],
    accent: 'coral',
  },
  {
    slug: 'quito',
    title: 'Quito',
    eyebrow: 'SpriteKit social impact game',
    year: '2026',
    repository: 'https://github.com/LucaPagan/GameSCH6',
    repoName: 'GameSCH6',
    problem:
      'Transform the theme of the negative effects of smoking into an iOS game that makes the player perceive consequences and progression interactively.',
    solution:
      'SpriteKit game with deterministic chunk generation, checkpoints, calculated lanes, stamina/lung health, and a HabitTracker with daily rollover.',
    impact:
      'Beyond the technical side, the game uses mechanics and feedback to raise awareness: the gameplay makes the negative effects of smoking visible rather than just telling a story about them.',
    stack: ['SpriteKit', 'GameplayKit', 'Swift', 'UserDefaults', 'Procedural generation'],
    signals: ['Fixed seed', 'Chunk streaming', 'Health feedback loop'],
    accent: 'violet',
  },
  {
    slug: 'unina-estates',
    title: 'Unina Estates',
    eyebrow: 'university software engineering',
    year: '2026',
    repository: 'https://github.com/LucaPagan/UninaEstatesApplication',
    repoName: 'UninaEstatesApplication / BackEnd',
    problem:
      'University Software Engineering project: create a real estate app and document research, analysis, requirements, and design decisions.',
    solution:
      'Android Kotlin client with Jetpack Compose, maps, Retrofit, Coil, and notifications; Kotlin/Spring Boot backend with JPA, Security, Redis cache, and PostgreSQL.',
    impact:
      'The value goes beyond the app: the project covers the software engineering process, from solution choices to the full-stack construction of the product.',
    stack: ['Kotlin', 'Jetpack Compose', 'Spring Boot', 'PostgreSQL', 'Firebase'],
    signals: ['Requirements work', 'Decision making', 'REST + mobile'],
    accent: 'aqua',
  },
  {
    slug: 'maieutic',
    title: 'Maieutic',
    eyebrow: 'AI dependency recovery app',
    year: '2026',
    repository: 'https://github.com/LucaPagan/Maieutic',
    repoName: 'Maieutic',
    problem:
      'Imagine an app that helps rehabilitate users from AI addiction, guiding them with paths, metrics, and progressive awareness.',
    solution:
      'Declarative SwiftUI router with loading, onboarding, calibration, auth, nickname, and main area; SwiftData for users, metrics, threads, and messages.',
    impact:
      'Product-oriented prototype focused on behavioral change: progressive flows, local metrics, and animated UI to make the recovery journey visible.',
    stack: ['SwiftUI', 'SwiftData', 'Authentication', 'Product flows', 'Animated UI'],
    signals: ['Recovery flow', 'Calibration', 'Local metrics'],
    accent: 'lime',
  },
]

export const skillGroups: SkillGroup[] = [
  {
    title: 'Product & Soft Skills',
    description: 'The human and product layer I bring alongside technical execution.',
    items: [
      'Problem solving',
      'Communication',
      'Team collaboration',
      'Ownership',
      'Autonomous learning',
      'Curiosity',
      'Adaptability',
    ],
    highlights: [
      {
        label: 'Problem solving',
        description: 'I look for the right problem before the right solution.',
      },
      {
        label: 'Communication',
        description: 'Translating between technical and non-technical people, naturally.',
      },
      {
        label: 'Team collaboration',
        description: 'I believe the best products come from the best-aligned teams.',
      },
      {
        label: 'Ownership',
        description: 'I take responsibility for outcomes, not just tasks.',
      },
      {
        label: 'Autonomous learning',
        description: 'Comfortable moving fast into unfamiliar territory.',
      },
      {
        label: 'Curiosity',
        description: 'I ask "why" more than I ask "how".',
      },
      {
        label: 'Adaptability',
        description: 'Used to switching context between code, design, and people.',
      },
    ],
  },
  {
    title: 'Native Product',
    description: 'Mobile experiences with a finished product feel.',
    items: ['SwiftUI', 'SwiftData', 'SpriteKit', 'watchOS', 'Jetpack Compose', 'Material 3'],
  },
  {
    title: 'Signals & AI',
    description: 'Sensors, local models, and robust realtime logic.',
    items: ['CoreMotion', 'Create ML', 'Core ML', 'Sliding windows', 'State machines', 'Haptics'],
  },
  {
    title: 'Cloud & Data',
    description: 'Sync, storage, and persistence designed for real-world contexts.',
    items: ['Supabase', 'PostgreSQL', 'Redis', 'Spring Boot', 'Firebase', 'Offline cache'],
  },
  {
    title: 'Systems',
    description: 'Technical foundations: concurrency, networking, and repeatable deployments.',
    items: ['C', 'POSIX threads', 'TCP sockets', 'Docker Compose', 'JavaFX', 'Testing'],
  },
  {
    title: 'Frontend Craft',
    description: 'Modern, fast interfaces and mindful animations.',
    items: ['React', 'TypeScript', 'Vite', 'Motion', 'GSAP', 'Three.js'],
  },
]

export const timeline: TimelineItem[] = [
  {
    period: 'Nov 2025',
    title: 'AI on-device and watchOS',
    description:
      'From data logging on Apple Watch to a Create ML model integrated into a realtime rep-counting app.',
  },
  {
    period: 'Feb 2026',
    title: 'Mobile + backend product stack',
    description:
      'Real estate mobile app with Android Compose and a Kotlin/Spring backend, including maps, APIs, and cloud services.',
  },
  {
    period: 'Mar - Apr 2026',
    title: 'Game systems and concurrent systems',
    description:
      'From a SpriteKit game with procedural generation to a multithreaded C server with a JavaFX client and Docker.',
  },
  {
    period: 'Jun 2026',
    title: 'Offline-first ecosystems',
    description:
      'WWF Astroni platform with a visitor journey, iPad management console, sync, storage, downloadable content, and gamification.',
  },
]

export const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Contact', href: '#contact' },
]
