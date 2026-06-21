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
      'Unire esperienza visitatore e gestione operativa per l’Oasi WWF Astroni, mantenendo percorsi, POI, eventi, media e gamification affidabili anche con rete instabile.',
    solution:
      'Piattaforma composta da app visitor SwiftUI offline-first e console iPadOS gestionale: SwiftData locale, Supabase, contenuti scaricabili, QR offline, storage media e sync controllato.',
    impact:
      'Un ecosistema unico: chi visita vive un journey immersivo e resiliente, mentre chi gestisce puo preparare contenuti, pacchetti e aggiornamenti senza perdere controllo operativo.',
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
      'Riconoscere ripetizioni di bicipite da accelerometro e giroscopio Apple Watch, partendo da dati grezzi raccolti in condizioni reali.',
    solution:
      'Pipeline completa: data logger watchOS a 50Hz, export CSV verso iPhone, training Create ML e app finale con sliding window da 100 campioni, filtro anti-jitter e state machine.',
    impact:
      'Prototipo end-to-end di ML on-device per fitness: inferenza realtime, feedback aptico, goal configurabile da iPhone e storico set via WatchConnectivity.',
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
      'Realizzare per l’esame di Laboratorio di Sistemi Operativi un Tris multiplayer con concorrenza, lobby, join request e partite isolate tra client.',
    solution:
      'Architettura client-server con socket TCP: server C multithread POSIX, opcode di rete, session state machine, client JavaFX dark theme e demo scalabile con Docker Compose.',
    impact:
      'Progetto d’esame completo: sincronizzazione stati, session ID univoci, rivincita, broadcast lobby e avvio ripetibile con Docker per testare piu client.',
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
      'Trasformare il tema degli effetti negativi del fumo in un gioco iOS capace di far percepire al giocatore conseguenze e progressione in modo interattivo.',
    solution:
      'SpriteKit game con generazione deterministica a chunk, checkpoint, lanes calcolate, stamina/salute polmonare e HabitTracker con rollover giornaliero.',
    impact:
      'Oltre al lato tecnico, il gioco usa meccaniche e feedback per sensibilizzare: il gameplay rende visibili gli effetti negativi del fumo invece di limitarsi a raccontarli.',
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
      'Progetto universitario di Ingegneria del Software: creare un’app real estate e documentare anche ricerca, analisi, requisiti e decisioni progettuali.',
    solution:
      'Client Android Kotlin con Jetpack Compose, mappe, Retrofit, Coil e notifiche; backend Kotlin/Spring Boot con JPA, Security, Redis cache e PostgreSQL.',
    impact:
      'Il valore non e solo l’app: il progetto copre il percorso di ingegneria software, dalla scelta delle soluzioni alla costruzione full-stack del prodotto.',
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
      'Immaginare un’app che aiuti a riabilitarsi dalla dipendenza dalle AI, accompagnando l’utente con percorsi, metriche e consapevolezza progressiva.',
    solution:
      'Router SwiftUI dichiarativo con loading, onboarding, calibrazione, auth, nickname e main area; SwiftData per utenti, metriche, thread e messaggi.',
    impact:
      'Prototipo product-oriented centrato sul cambiamento comportamentale: flussi progressivi, metriche locali e UI animata per rendere visibile il percorso di recupero.',
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
      'Piattaforma WWF Astroni con visitor journey, gestionale iPad, sync, storage, contenuti scaricabili e gamification.',
  },
]

export const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Contact', href: '#contact' },
]
