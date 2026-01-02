/**
 * ============================================================================
 * APP CONFIGURATION - Edit this file to customize your SaaS
 * ============================================================================
 *
 * This is the ONLY file you need to edit for branding.
 * All pages import from here.
 */

export const CONFIG = {
  // -------------------------------------------------------------------------
  // BRAND
  // -------------------------------------------------------------------------
  appName: 'YourApp',
  tagline: 'Your tagline here',

  // Logo: place file in public/ folder, or set to null for text-only
  logo: null as string | null, // e.g., '/logo.png'

  // Primary accent color (Tailwind class or hex)
  // Options: 'emerald', 'sky', 'violet', 'rose', 'amber', 'zinc'
  accentColor: 'emerald',

  // -------------------------------------------------------------------------
  // HERO SECTION
  // -------------------------------------------------------------------------
  hero: {
    headline: 'Your headline goes here',
    subheadline: 'Describe what your product does in one or two sentences.',
    cta: 'Start Free',
    ctaSubtext: 'No credit card required',
    // Hero image: place in public/, or null for no image
    image: null as string | null, // e.g., '/hero-mockup.png'
  },

  // -------------------------------------------------------------------------
  // SOCIAL PROOF
  // -------------------------------------------------------------------------
  socialProof: {
    enabled: false,
    headline: 'Trusted by teams at',
    // Add logo images to public/logos/ folder
    logos: [] as Array<{ name: string; src: string }>,
    // Example:
    // logos: [
    //   { name: 'Acme', src: '/logos/acme.svg' },
    //   { name: 'Globex', src: '/logos/globex.svg' },
    // ],
  },

  // -------------------------------------------------------------------------
  // HOW IT WORKS (3 steps)
  // -------------------------------------------------------------------------
  howItWorks: {
    headline: 'How It Works',
    subheadline: 'Get started in minutes',
    steps: [
      {
        number: '1',
        title: 'Sign Up',
        description: 'Create your free account in seconds.',
        icon: 'user', // user, settings, rocket, check, chart, shield
      },
      {
        number: '2',
        title: 'Configure',
        description: 'Set up your preferences and connect your tools.',
        icon: 'settings',
      },
      {
        number: '3',
        title: 'Launch',
        description: 'Start using the platform and see results.',
        icon: 'rocket',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // FEATURES
  // -------------------------------------------------------------------------
  features: {
    headline: 'Everything You Need',
    subheadline: 'Powerful features to help you succeed',
    items: [
      {
        title: 'Feature One',
        description: 'Brief description of what this feature does.',
        icon: 'check',
      },
      {
        title: 'Feature Two',
        description: 'Brief description of what this feature does.',
        icon: 'chart',
      },
      {
        title: 'Feature Three',
        description: 'Brief description of what this feature does.',
        icon: 'shield',
      },
      {
        title: 'Feature Four',
        description: 'Brief description of what this feature does.',
        icon: 'settings',
      },
      {
        title: 'Feature Five',
        description: 'Brief description of what this feature does.',
        icon: 'rocket',
      },
      {
        title: 'Feature Six',
        description: 'Brief description of what this feature does.',
        icon: 'user',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // PRICING SECTION (tiers come from API)
  // -------------------------------------------------------------------------
  pricing: {
    headline: 'Simple Pricing',
    subheadline: 'Start free, upgrade when you need more',
  },

  // -------------------------------------------------------------------------
  // FAQ
  // -------------------------------------------------------------------------
  faq: {
    headline: 'Questions & Answers',
    items: [
      {
        question: 'How does the free plan work?',
        answer: 'The free plan gives you access to core features with usage limits. No credit card required.',
      },
      {
        question: 'Can I upgrade or downgrade anytime?',
        answer: 'Yes, you can change your plan at any time. Changes take effect on your next billing cycle.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards through Stripe.',
      },
      {
        question: 'How do I cancel my subscription?',
        answer: 'You can cancel anytime from your billing settings. Access continues until your billing period ends.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // FINAL CTA
  // -------------------------------------------------------------------------
  finalCta: {
    headline: 'Ready to get started?',
    subheadline: 'Join thousands of users already on the platform.',
    cta: 'Start Free Today',
  },

  // -------------------------------------------------------------------------
  // FOOTER
  // -------------------------------------------------------------------------
  footer: {
    links: [] as Array<{ label: string; href: string }>,
    // Example:
    // links: [
    //   { label: 'Privacy', href: '/privacy' },
    //   { label: 'Terms', href: '/terms' },
    // ],
  },
};

// ============================================================================
// COLOR UTILITIES - Don't modify below
// ============================================================================

const ACCENT_COLORS = {
  emerald: {
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-400',
    text: 'text-emerald-500',
    textHover: 'hover:text-emerald-400',
    border: 'border-emerald-500',
    hex: '#10b981',
  },
  sky: {
    bg: 'bg-sky-500',
    bgHover: 'hover:bg-sky-400',
    text: 'text-sky-500',
    textHover: 'hover:text-sky-400',
    border: 'border-sky-500',
    hex: '#0ea5e9',
  },
  violet: {
    bg: 'bg-violet-500',
    bgHover: 'hover:bg-violet-400',
    text: 'text-violet-500',
    textHover: 'hover:text-violet-400',
    border: 'border-violet-500',
    hex: '#8b5cf6',
  },
  rose: {
    bg: 'bg-rose-500',
    bgHover: 'hover:bg-rose-400',
    text: 'text-rose-500',
    textHover: 'hover:text-rose-400',
    border: 'border-rose-500',
    hex: '#f43f5e',
  },
  amber: {
    bg: 'bg-amber-500',
    bgHover: 'hover:bg-amber-400',
    text: 'text-amber-500',
    textHover: 'hover:text-amber-400',
    border: 'border-amber-500',
    hex: '#f59e0b',
  },
  zinc: {
    bg: 'bg-zinc-100',
    bgHover: 'hover:bg-white',
    text: 'text-zinc-100',
    textHover: 'hover:text-white',
    border: 'border-zinc-100',
    hex: '#f4f4f5',
  },
};

export function getAccentClasses() {
  return ACCENT_COLORS[CONFIG.accentColor as keyof typeof ACCENT_COLORS] || ACCENT_COLORS.emerald;
}

export function getAccentHex() {
  return getAccentClasses().hex;
}
