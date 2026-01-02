/**
 * LANDING PAGE - Public homepage with pricing
 */

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDreamAPI, dreamAPI } from '../hooks/useDreamAPI';

// ============================================================================
// BRANDING - Customize these values for your app
// ============================================================================
const BRANDING = {
  appName: 'YourApp',
  tagline: 'Your headline goes here',
  description: 'Describe what your product does in one sentence.',
  primaryColor: '#18181b',  // zinc-900
  accentColor: '#3f3f46',   // zinc-700
};

// ============================================================================
// TIERS - Configure your pricing tiers
// ============================================================================
const TIER_CONFIG = {
  free: { name: 'Free', limit: '100 requests/month' },
  pro: { name: 'Pro', limit: 'Unlimited requests' },
};

interface Tier {
  name: string;
  displayName?: string;
  price: number;
  limit: number;
  priceId: string;
  features?: string[];
}

export default function Landing() {
  const { isReady, isSignedIn, user } = useDreamAPI();
  const navigate = useNavigate();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);

  const plan = user?.plan || 'free';
  const { appName, tagline, description, primaryColor } = BRANDING;

  useEffect(() => {
    async function loadTiers() {
      try {
        const response = await dreamAPI.products.listTiers();
        setTiers(response.tiers || []);
      } catch (error) {
        console.error('Failed to load tiers:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTiers();
  }, []);

  const handleGetStarted = (tierName: string) => {
    if (isSignedIn) {
      if (tierName === 'free' || tierName === plan) {
        navigate('/dashboard');
      } else {
        navigate('/choose-plan');
      }
    } else {
      window.location.href = dreamAPI.auth.getSignUpUrl({
        redirect: window.location.origin + '/dashboard',
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-medium text-zinc-100 hover:text-white transition-colors">
            {appName}
          </Link>
          <div className="flex items-center gap-6">
            <a href="#pricing" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              Pricing
            </a>
            {!isReady ? (
              <span className="text-zinc-600 text-sm">Loading...</span>
            ) : isSignedIn ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-medium rounded transition-colors bg-zinc-100 text-zinc-900 hover:bg-white"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <a
                  href={dreamAPI.auth.getSignInUrl({ redirect: window.location.origin + '/dashboard' })}
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Sign In
                </a>
                <a
                  href={dreamAPI.auth.getSignUpUrl({ redirect: window.location.origin + '/dashboard' })}
                  className="px-4 py-2 text-sm font-medium rounded transition-colors bg-zinc-100 text-zinc-900 hover:bg-white"
                >
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-light text-zinc-100 mb-6 tracking-tight">
          {tagline}
        </h1>
        <p className="text-lg text-zinc-500 mb-10 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex justify-center gap-4">
          {!isReady ? (
            <span className="text-zinc-600">Loading...</span>
          ) : isSignedIn ? (
            <Link
              to="/dashboard"
              className="px-8 py-3 rounded font-medium transition-colors bg-zinc-100 text-zinc-900 hover:bg-white"
            >
              Go to Dashboard
            </Link>
          ) : (
            <a
              href={dreamAPI.auth.getSignUpUrl({ redirect: window.location.origin + '/dashboard' })}
              className="px-8 py-3 rounded font-medium transition-colors bg-zinc-100 text-zinc-900 hover:bg-white"
            >
              Start Free
            </a>
          )}
        </div>
        <p className="mt-4 text-zinc-600 text-sm">No credit card required</p>
      </div>

      {/* Pricing */}
      <div id="pricing" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-light text-zinc-100 mb-3">Pricing</h2>
          <p className="text-zinc-500">Simple, transparent pricing</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
              >
                <h3 className="text-lg font-medium text-zinc-100 mb-2">
                  {tier.displayName || tier.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-light text-zinc-200">${tier.price}</span>
                  <span className="text-zinc-500 text-sm">/month</span>
                </div>
                <p className="text-zinc-500 text-sm mb-6">
                  {tier.limit === -1 ? 'Unlimited requests' : `${tier.limit.toLocaleString()} requests/month`}
                </p>

                <button
                  onClick={() => handleGetStarted(tier.name)}
                  className={`w-full py-2.5 rounded text-sm font-medium transition-colors ${
                    tier.name === plan
                      ? 'bg-zinc-800 text-zinc-500 cursor-default'
                      : tier.price === 0
                      ? 'border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
                      : 'bg-zinc-100 text-zinc-900 hover:bg-white'
                  }`}
                  disabled={tier.name === plan}
                >
                  {tier.name === plan ? 'Current Plan' : tier.price === 0 ? 'Start Free' : 'Get Started'}
                </button>

                {tier.features && tier.features.length > 0 && (
                  <ul className="mt-6 space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-zinc-500 text-sm">
                        <span className="w-1 h-1 bg-zinc-600 rounded-full mt-2 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} {appName}
          </p>
        </div>
      </footer>
    </div>
  );
}
