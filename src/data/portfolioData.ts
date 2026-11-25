/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  SINGLE SOURCE OF TEXT CONTENT FOR THE PORTFOLIO             ║
 * ║  (images live in /public – see the notes at the bottom)      ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Content is taken from the three source portfolios (Netflix, Glass Shard, Sri Tech).
 * Fields that are not in those sources are left empty and hidden on the page.
 */

/* ───────────── 1. BASIC INFO ───────────── */
export const SITE = {
  name: 'VIBHEESHAN NK',
  pageTitle: 'VIBHEESHAN N K – Web & AI Developer',
  role: 'Web Developer · AI Developer',
  // Not in the source portfolios yet – add your email / WhatsApp number here.
  email: '',
  // digits only, with country code, no + or spaces (e.g. 919876543210)
  phone: '',
  whatsappMessage: 'Hi, I visited your portfolio and would like to get in touch.',
  available: true,
};

/* ───────────── 2. HERO (top of page) ───────────── */
export const HERO = {
  eyebrow: 'WEB DEVELOPER • AI DEVELOPER',
  headline: 'VIBHEESHAN N K',
  roles: ['WEB DEVELOPER', 'AI DEVELOPER'] as [string, string],
  tagline:
    'Full-stack and AI engineer building scalable multi-tenant platforms, intelligent systems and high-performance interfaces.',
  primaryButton: 'EXPLORE MY WORK',
  secondaryButton: 'Get In Touch',
  image: '/assets/hero-portrait.jpg',
  imageAlt: 'Vibheeshan N K',
  imagePosition: 'right center',
};

/* ───────────── 3. LOADING SCREEN ───────────── */
export const LOADER = {
  statement: 'ENGINEERING INTELLIGENT SYSTEMS FOR THE WEB',
  redWords: ['INTELLIGENT', 'SYSTEMS'],
};

/* ───────────── 4. ABOUT ───────────── */
export const ABOUT = {
  eyebrow: 'B.Tech · AI & Machine Learning · Aditya Engineering College',
  portrait: '/media/portrait.png', // transparent cut-out portrait
  portraitAlt: 'Portrait of Sushmita Dasari',
  portraitCaption: 'Web & AI Developer',
  paragraphs: [
    'I am Dasari Venkata Ratna Sri Sushmita, a B.Tech student in Artificial Intelligence and Machine Learning at Aditya Engineering College.',
    'My work bridges rigorous algorithmic problem-solving with full-stack software architecture, translating complex backend logic into seamless, high-performance interfaces. I am the founder of Sri Tech.',
  ],
  technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Docker', 'JavaScript'],
  focus: ['Full-Stack Architecture', 'AI & Machine Learning', 'Cloud & DevOps'],
};

/* ───────────── 5. SOCIAL LINKS (used by the navbar & footer) ─────────────
 * Add your real profile URLs here. Empty hrefs are hidden. */
export const SOCIALS = [
  { id: 'github', label: 'GitHub', href: '' },
  { id: 'linkedin', label: 'LinkedIn', href: '' },
  { id: 'leetcode', label: 'LeetCode', href: '' },
] as const;

/* ───────────── 6. TECHNICAL SKILLS (Glass skill cards) ───────────── */
export const SKILL_CARDS: { name: string; category: string; level: string }[] = [
  { name: 'Frontend Engineering', category: 'React · JavaScript · Tailwind CSS · HTML5 · CSS3', level: 'UI / INTERACTION' },
  { name: 'Backend & Databases', category: 'Node.js · Express · PostgreSQL · MongoDB', level: 'ARCHITECTURE' },
  { name: 'AI & Machine Learning', category: 'NLP · Generative AI · Computer Vision · LLMs', level: 'INTELLIGENCE' },
  { name: 'Cloud & DevOps', category: 'Docker · GitHub Actions · CI/CD · Render', level: 'INFRASTRUCTURE' },
  { name: 'Algorithmic Problem Solving', category: 'Data Structures · Algorithms · C++ · JavaScript', level: 'COMPETITIVE' },
  { name: 'Tools & Ecosystem', category: 'Git · Chrome APIs · Google Cloud · VS Code', level: 'PRODUCTIVITY' },
];

/* ───────────── 6b. TECH STACK STRIP (logos under the skills) ─────────────
 * Names with a built-in logo: React, JavaScript, Python, PostgreSQL, Three.js, GSAP, ...
 * Any other name still shows as a lettered badge. */
export const TECH_STACK: string[] = ['React', 'JavaScript', 'Python', 'PostgreSQL', 'Docker', 'Node.js', 'MongoDB', 'Three.js', 'GSAP'];

/* ───────────── 7. FEATURED WORK (3D video-reel gallery) ─────────────
 * Thumbnails: project-<n>-1.jpg, -2.jpg, -3.jpg in /public/assets/thumbnails/.
 * Add videoUrl / liveUrl / repoUrl when you have them. */
export interface Project {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  videoUrl?: string;
  embedUrl?: string;
  driveUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  kind?: 'video' | 'software';
  poster?: string;
  description?: string;
  tags?: string[];
}

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'multi-tenant-saas',
    kind: 'software',
    title: 'Multi-Tenant SaaS Platform',
    subtitle: 'Cloud & Distributed Systems',
    category: 'Cloud & Distributed Systems',
    poster: '/assets/thumbnails/project-1-1.jpg',
    description:
      'Containerized enterprise SaaS featuring strict database isolation and granular role-based access control.',
    tags: ['Docker', 'PostgreSQL', 'Node.js', 'Express'],
  },
  {
    id: 'payment-gateway',
    kind: 'software',
    title: 'Payment Gateway System',
    subtitle: 'Fintech Architecture',
    category: 'Fintech Architecture',
    poster: '/assets/thumbnails/project-2-1.jpg',
    description:
      'Simulates complex transaction state management, webhook verification, and multi-method processing.',
    tags: ['JavaScript', 'PostgreSQL', 'REST APIs', 'Docker'],
  },
  {
    id: 'ai-ml-engine',
    kind: 'software',
    title: 'AI & ML Diagnostic Engine',
    subtitle: 'Artificial Intelligence',
    category: 'Artificial Intelligence',
    poster: '/assets/thumbnails/project-3-1.jpg',
    description:
      'Intelligent data processing pipeline leveraging machine learning models and NLP workflows.',
    tags: ['Python', 'Machine Learning', 'NLP', 'AWS'],
  },
];

/* ───────────── 8. SERVICES (Glass service rows; no pricing in the sources) ───────────── */
export const SERVICES_PRICING = [
  { id: 'service-1', title: 'Full-Stack Architecture', priceLabel: '', price: '', featured: true },
  { id: 'service-2', title: 'AI & Machine Learning', priceLabel: '', price: '', featured: false },
  { id: 'service-3', title: 'Cloud & Deployment', priceLabel: '', price: '', featured: false },
  { id: 'service-4', title: 'Algorithmic Problem Solving', priceLabel: '', price: '', featured: false },
] as const;

/* ───────────── 9. HEADLINE NUMBERS (under hero) ───────────── */
export const CLIENT_STATS = [
  { id: 'stat-1', value: 8, suffix: '', label: 'Engineered Projects' },
  { id: 'stat-2', value: 2, suffix: '', label: 'Industry Certifications' },
  { id: 'stat-3', value: 1, suffix: '', label: 'Flipkart GRiD 7.0 Semi-Finalist' },
] as const;

/* Derived – do not edit */
export const WHATSAPP_URL = SITE.phone
  ? `https://wa.me/${SITE.phone}?text=${encodeURIComponent(SITE.whatsappMessage)}`
  : '';
