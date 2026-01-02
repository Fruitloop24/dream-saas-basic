/**
 * LANDING PAGE - Public homepage
 *
 * All customization is in the CONTENT object below.
 * Edit CONTENT to brand your app - no other changes needed.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDreamAPI, dreamAPI } from '../hooks/useDreamAPI';
import type { Tier } from '@dream-api/sdk';

// ============================================================================
// CONTENT - Edit this section to customize your landing page
// ============================================================================

const CONTENT = {
  // Brand
  appName: 'YourApp',

  // Hero Section
  hero: {
    headline: 'Your headline goes here',
    subheadline: 'Describe what your product does in one or two sentences. Focus on the benefit to the user.',
    cta: 'Start Free',
    ctaSubtext: 'No credit card required',
  },

  // Social Proof - Add your customer logos or remove section if empty
  socialProof: {
    headline: 'Trusted by teams everywhere',
    logos: [] as Array<{ name: string; src: string }>,
    // Example: logos: [{ name: 'Company', src: '/assets/logo1.svg' }],
  },

  // How It Works - 3 steps
  howItWorks: {
    headline: 'How It Works',
    subheadline: 'Get started in minutes',
    steps: [
      {
        number: '1',
        title: 'Sign Up',
        description: 'Create your free account in seconds.',
      },
      {
        number: '2',
        title: 'Configure',
        description: 'Set up your preferences and connect your tools.',
      },
      {
        number: '3',
        title: 'Launch',
        description: 'Start using the platform and see results.',
      },
    ],
  },

  // Features - Key benefits
  features: {
    headline: 'Everything You Need',
    subheadline: 'Powerful features to help you succeed',
    items: [
      {
        title: 'Feature One',
        description: 'Brief description of what this feature does and why it matters.',
      },
      {
        title: 'Feature Two',
        description: 'Brief description of what this feature does and why it matters.',
      },
      {
        title: 'Feature Three',
        description: 'Brief description of what this feature does and why it matters.',
      },
      {
        title: 'Feature Four',
        description: 'Brief description of what this feature does and why it matters.',
      },
      {
        title: 'Feature Five',
        description: 'Brief description of what this feature does and why it matters.',
      },
      {
        title: 'Feature Six',
        description: 'Brief description of what this feature does and why it matters.',
      },
    ],
  },

  // Pricing - Pulled from API, just customize the section text
  pricing: {
    headline: 'Simple Pricing',
    subheadline: 'Start free, upgrade when you need more',
  },

  // FAQ - Common questions
  faq: {
    headline: 'Questions & Answers',
    items: [
      {
        question: 'How does the free plan work?',
        answer: 'The free plan gives you access to core features with usage limits. No credit card required to start.',
      },
      {
        question: 'Can I upgrade or downgrade anytime?',
        answer: 'Yes, you can change your plan at any time. Changes take effect on your next billing cycle.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards through our secure payment processor, Stripe.',
      },
      {
        question: 'How do I cancel my subscription?',
        answer: 'You can cancel anytime from your billing settings. Your access continues until the end of your billing period.',
      },
    ],
  },

  // Final CTA
  finalCta: {
    headline: 'Ready to get started?',
    subheadline: 'Join thousands of users already using our platform.',
    cta: 'Start Free Today',
  },

  // Footer
  footer: {
    links: [] as Array<{ label: string; href: string }>,
    // Example: links: [{ label: 'Privacy', href: '/privacy' }],
  },
};

// ============================================================================
// COMPONENT - No changes needed below
// ============================================================================

export default function Landing() {
  const { isReady, isSignedIn, user } = useDreamAPI();
  const navigate = useNavigate();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plan = user?.plan || 'free';

  useEffect(() => {
    dreamAPI.products.listTiers()
      .then(res => setTiers(res.tiers || []))
      .catch(console.error)
      .finally(() => setLoadingTiers(false));
  }, []);

  const getSignUpUrl = () => dreamAPI.auth.getSignUpUrl({
    redirect: window.location.origin + '/dashboard'
  });

  const getSignInUrl = () => dreamAPI.auth.getSignInUrl({
    redirect: window.location.origin + '/dashboard'
  });

  const handleGetStarted = (tierName?: string) => {
    if (isSignedIn) {
      if (!tierName || tierName === 'free' || tierName === plan) {
        navigate('/dashboard');
      } else {
        navigate('/choose-plan');
      }
    } else {
      window.location.href = getSignUpUrl();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navigation */}
      <nav className="border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-medium hover:text-white transition-colors">
            {CONTENT.appName}
          </Link>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors hidden sm:block">
              Features
            </a>
            <a href="#pricing" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors hidden sm:block">
              Pricing
            </a>
            <a href="#faq" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors hidden sm:block">
              FAQ
            </a>
            {!isReady ? (
              <span className="text-zinc-600 text-sm">...</span>
            ) : isSignedIn ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-medium rounded bg-zinc-100 text-zinc-900 hover:bg-white transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <a
                  href={getSignInUrl()}
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Sign In
                </a>
                <a
                  href={getSignUpUrl()}
                  className="px-4 py-2 text-sm font-medium rounded bg-zinc-100 text-zinc-900 hover:bg-white transition-colors"
                >
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">
            {CONTENT.hero.headline}
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            {CONTENT.hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isSignedIn ? (
              <Link
                to="/dashboard"
                className="px-8 py-3 rounded font-medium bg-zinc-100 text-zinc-900 hover:bg-white transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <a
                href={getSignUpUrl()}
                className="px-8 py-3 rounded font-medium bg-zinc-100 text-zinc-900 hover:bg-white transition-colors"
              >
                {CONTENT.hero.cta}
              </a>
            )}
          </div>
          {CONTENT.hero.ctaSubtext && (
            <p className="mt-4 text-zinc-600 text-sm">{CONTENT.hero.ctaSubtext}</p>
          )}
        </div>
      </section>

      {/* Social Proof */}
      {CONTENT.socialProof.logos.length > 0 && (
        <section className="py-16 px-6 border-y border-zinc-900">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-zinc-500 text-sm mb-8">{CONTENT.socialProof.headline}</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50">
              {CONTENT.socialProof.logos.map((logo, i) => (
                <img key={i} src={logo.src} alt={logo.name} className="h-8 md:h-10" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light mb-3">{CONTENT.howItWorks.headline}</h2>
            <p className="text-zinc-500">{CONTENT.howItWorks.subheadline}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {CONTENT.howItWorks.steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
                  <span className="text-zinc-400 font-medium">{step.number}</span>
                </div>
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-zinc-500 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light mb-3">{CONTENT.features.headline}</h2>
            <p className="text-zinc-500">{CONTENT.features.subheadline}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONTENT.features.items.map((feature, i) => (
              <div key={i} className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800">
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-zinc-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light mb-3">{CONTENT.pricing.headline}</h2>
            <p className="text-zinc-500">{CONTENT.pricing.subheadline}</p>
          </div>

          {loadingTiers ? (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {tiers.map((tier, i) => {
                const isPopular = tier.popular || i === 1;
                const isCurrent = tier.name === plan && isSignedIn;

                return (
                  <div
                    key={tier.name}
                    className={`relative p-6 rounded-lg transition-colors ${
                      isPopular
                        ? 'bg-zinc-900 border-2 border-zinc-700'
                        : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded bg-zinc-100 text-zinc-900">
                        POPULAR
                      </div>
                    )}

                    <h3 className="text-lg font-medium mb-2">
                      {tier.displayName || tier.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-light">${tier.price}</span>
                      <span className="text-zinc-500">/mo</span>
                    </div>
                    <p className="text-zinc-500 text-sm mb-6">
                      {tier.limit === -1 ? 'Unlimited requests' : `${tier.limit.toLocaleString()} requests/mo`}
                    </p>

                    <button
                      onClick={() => handleGetStarted(tier.name)}
                      disabled={isCurrent}
                      className={`w-full py-2.5 rounded text-sm font-medium transition-colors ${
                        isCurrent
                          ? 'bg-zinc-800 text-zinc-500 cursor-default'
                          : isPopular
                          ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
                          : 'border border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-white'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : tier.price === 0 ? 'Start Free' : 'Get Started'}
                    </button>

                    {tier.features && tier.features.length > 0 && (
                      <ul className="mt-6 space-y-2">
                        {tier.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-2 text-zinc-400 text-sm">
                            <svg className="w-4 h-4 mt-0.5 text-zinc-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light mb-3">{CONTENT.faq.headline}</h2>
          </div>
          <div className="space-y-4">
            {CONTENT.faq.items.map((item, i) => (
              <div key={i} className="border border-zinc-800 rounded-lg">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-zinc-900/50 transition-colors"
                >
                  <span className="font-medium">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-zinc-400 text-sm">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light mb-3">{CONTENT.finalCta.headline}</h2>
          <p className="text-zinc-500 mb-8">{CONTENT.finalCta.subheadline}</p>
          {isSignedIn ? (
            <Link
              to="/dashboard"
              className="inline-block px-8 py-3 rounded font-medium bg-zinc-100 text-zinc-900 hover:bg-white transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <a
              href={getSignUpUrl()}
              className="inline-block px-8 py-3 rounded font-medium bg-zinc-100 text-zinc-900 hover:bg-white transition-colors"
            >
              {CONTENT.finalCta.cta}
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} {CONTENT.appName}
          </p>
          {CONTENT.footer.links.length > 0 && (
            <div className="flex gap-6">
              {CONTENT.footer.links.map((link, i) => (
                <a key={i} href={link.href} className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
