export type Project = {
  title: string
  eyebrow: string
  year: string
  repository: string
  description: string
  impact: string
  tech: string[]
  signals: string[]
  accent: 'aqua' | 'lime' | 'amber' | 'coral' | 'violet'
}

export type SkillGroup = {
  title: string
  description: string
  items: string[]
}

export type TimelineItem = {
  period: string
  title: string
  description: string
}

export const profileHighlights = [
  {
    value: '9',
    label: 'repo analizzati',
  },
  {
    value: '6',
    label: 'stack principali',
  },
  {
    value: 'AI',
    label: 'on-device e sensori',
  },
]

export const projects: Project[] = [
  {
    title: 'WWF Visitor App',
    eyebrow: 'iOS offline-first ecosystem',
    year: '2026',
    repository: 'https://github.com/LucaPagan/WWF_Frontend',
    description:
      'App SwiftUI per percorsi, POI, eventi e contenuti scaricabili, progettata per funzionare bene anche senza rete.',
    impact:
      'SwiftData locale, sync pull-only da Supabase, QR offline, gamification, profili anonimi e pacchetti contenuto.',
    tech: ['SwiftUI', 'SwiftData', 'Supabase', 'QR offline', 'Gamification'],
    signals: ['Offline-first', 'Local models', 'Content packages'],
    accent: 'aqua',
  },
  {
    title: 'WWF Manager iPad',
    eyebrow: 'admin console nativa',
    year: '2026',
    repository: 'https://github.com/LucaPagan/GestionaleWWFIpad',
    description:
      'Gestionale iPad per creare, validare e sincronizzare contenuti, percorsi, eventi e campagne gamificate.',
    impact:
      'Sincronizzazione bidirezionale, outbox locale, classificazione media, storage remoto e sessione manager.',
    tech: ['iPadOS', 'SwiftData', 'Supabase Storage', 'NWPathMonitor', 'Sync workers'],
    signals: ['Admin UX', 'Background sync', 'Media tiers'],
    accent: 'lime',
  },
  {
    title: 'AI Rep Counter',
    eyebrow: 'watchOS + Create ML',
    year: '2025',
    repository: 'https://github.com/LucaPagan/Americano-Challenge-2-',
    description:
      'Contatore di curl su Apple Watch nato da un percorso completo: raccolta dati, training e inferenza in tempo reale.',
    impact:
      'Sensori a 50Hz, dataset CSV, finestra predittiva, filtro anti-jitter, Core ML e comunicazione Watch/iPhone.',
    tech: ['watchOS', 'CoreMotion', 'Core ML', 'Create ML', 'WatchConnectivity'],
    signals: ['50Hz sensors', 'Sliding window', 'Haptic feedback'],
    accent: 'amber',
  },
  {
    title: 'TRIS Multiplayer LSO',
    eyebrow: 'systems programming',
    year: '2026',
    repository: 'https://github.com/LucaPagan/Tic-Tac-Toe-LSO',
    description:
      'Session manager multiplayer per Tris con server C concorrente, client JavaFX e orchestrazione Docker.',
    impact:
      'Socket TCP, thread POSIX, partite esclusive, lobby, rivincita, broadcast degli stati e test lato server.',
    tech: ['C', 'POSIX threads', 'TCP sockets', 'JavaFX', 'Docker Compose'],
    signals: ['Concurrent server', 'Session state', 'Containerized demo'],
    accent: 'coral',
  },
  {
    title: 'GameSCH6',
    eyebrow: 'SpriteKit game systems',
    year: '2026',
    repository: 'https://github.com/LucaPagan/GameSCH6',
    description:
      'Gioco iOS SpriteKit con mondo procedurale deterministico e progressione collegata ad abitudini quotidiane.',
    impact:
      'Generazione a chunk, checkpoint, persistenza sessione, HUD salute/stamina e logica di progressione locale.',
    tech: ['SpriteKit', 'GameplayKit', 'Swift', 'UserDefaults', 'Procedural generation'],
    signals: ['Deterministic world', 'Habit loop', 'Saved sessions'],
    accent: 'violet',
  },
  {
    title: 'Unina Estates',
    eyebrow: 'Android + backend',
    year: '2026',
    repository: 'https://github.com/LucaPagan/UninaEstatesApplication',
    description:
      'Applicazione real estate Android con Compose, mappe, networking e backend Kotlin/Spring collegato al dominio.',
    impact:
      'Client mobile con Retrofit, Maps/Firebase e backend Spring Boot con JPA, Security, Redis e PostgreSQL.',
    tech: ['Kotlin', 'Jetpack Compose', 'Spring Boot', 'PostgreSQL', 'Firebase'],
    signals: ['Maps UX', 'REST APIs', 'Cloud-ready backend'],
    accent: 'aqua',
  },
  {
    title: 'Maieutic',
    eyebrow: 'SwiftUI product prototype',
    year: '2026',
    repository: 'https://github.com/LucaPagan/Maieutic',
    description:
      'Prototype iOS con onboarding, calibrazione, autenticazione, nickname e area principale guidata da metriche locali.',
    impact:
      'Routing dichiarativo, SwiftData, componenti animati e cura delle transizioni di stato dell’esperienza utente.',
    tech: ['SwiftUI', 'SwiftData', 'Authentication', 'Product flows', 'Animated UI'],
    signals: ['Onboarding', 'Calibration', 'Interaction metrics'],
    accent: 'amber',
  },
]

export const skillGroups: SkillGroup[] = [
  {
    title: 'Native Product',
    description: 'Esperienze mobile con sensazione di prodotto finito.',
    items: ['SwiftUI', 'SwiftData', 'SpriteKit', 'watchOS', 'Jetpack Compose', 'Material 3'],
  },
  {
    title: 'Signals & AI',
    description: 'Sensori, modelli locali e logiche realtime robuste.',
    items: ['CoreMotion', 'Create ML', 'Core ML', 'Sliding windows', 'State machines', 'Haptics'],
  },
  {
    title: 'Cloud & Data',
    description: 'Sync, storage e persistenza pensati per contesti reali.',
    items: ['Supabase', 'PostgreSQL', 'Redis', 'Spring Boot', 'Firebase', 'Offline cache'],
  },
  {
    title: 'Systems',
    description: 'Fondamenta tecniche: concorrenza, rete e deploy ripetibile.',
    items: ['C', 'POSIX threads', 'TCP sockets', 'Docker Compose', 'JavaFX', 'Testing'],
  },
  {
    title: 'Frontend Craft',
    description: 'Interfacce moderne, veloci e animazioni consapevoli.',
    items: ['React', 'TypeScript', 'Vite', 'Motion', 'GSAP', 'Three.js'],
  },
]

export const timeline: TimelineItem[] = [
  {
    period: 'Nov 2025',
    title: 'AI on-device e watchOS',
    description:
      'Dal data logging su Apple Watch al modello Create ML integrato in un’app di rep counting realtime.',
  },
  {
    period: 'Feb 2026',
    title: 'Mobile + backend product stack',
    description:
      'Real estate mobile con Android Compose e backend Kotlin/Spring, includendo mappe, API e servizi cloud.',
  },
  {
    period: 'Mar - Apr 2026',
    title: 'Game systems e sistemi concorrenti',
    description:
      'Da un gioco SpriteKit con generazione procedurale a un server C multithread con client JavaFX e Docker.',
  },
  {
    period: 'Jun 2026',
    title: 'Ecosistemi offline-first',
    description:
      'Doppia app WWF: visitor app e gestionale iPad con sync, storage, contenuti scaricabili e gamification.',
  },
]

export const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Contact', href: '#contact' },
]
