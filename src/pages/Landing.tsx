/**
 * ============================================================================
 * LANDING PAGE - PUBLIC HOMEPAGE
 * ============================================================================
 *
 * Uses @dream-api/sdk for tiers and auth.
 * NO Clerk imports - SDK handles auth internally.
 *
 * ============================================================================
 */

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDreamAPI, dreamAPI } from '../hooks/useDreamAPI';

// ============================================================================
// AI: CUSTOMIZE THESE VALUES FOR YOUR BRAND
// ============================================================================
const BRANDING = {
  appName: 'YourApp',
  valueProp: 'Your Product Headline Goes Here',
  description: 'Describe what your product does in one compelling sentence.',
  primaryColor: '#0f172a',
  logoUrl: '',
  heroImageUrl: '',
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
  const { appName, valueProp, description, primaryColor, logoUrl, heroImageUrl } = BRANDING;

  // Load tiers from SDK
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
      // Use SDK auth URL with FULL origin for redirect
      window.location.href = dreamAPI.auth.getSignUpUrl({
        redirect: window.location.origin + '/dashboard',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity">
          {logoUrl && <img src={logoUrl} alt={`${appName} logo`} className="h-10 w-auto" />}
          <span className="text-slate-900 text-2xl font-bold">{appName}</span>
        </Link>
        <div className="flex gap-8 items-center">
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-slate-700 hover:text-slate-900 no-underline font-medium">Features</a>
            <a href="#pricing" className="text-slate-700 hover:text-slate-900 no-underline font-medium">Pricing</a>
          </div>
          <div className="flex gap-4 items-center">
            {!isReady ? (
              <span className="text-slate-400">Loading...</span>
            ) : isSignedIn ? (
              <Link
                to="/dashboard"
                className="px-6 py-2 text-white no-underline rounded-lg font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <a
                  href={dreamAPI.auth.getSignInUrl({ redirect: window.location.origin + '/dashboard' })}
                  className="px-6 py-2 text-slate-700 hover:text-slate-900 no-underline font-semibold"
                >
                  Sign In
                </a>
                <a
                  href={dreamAPI.auth.getSignUpUrl({ redirect: window.location.origin + '/dashboard' })}
                  className="px-6 py-2 text-white no-underline rounded-lg font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className={`grid ${heroImageUrl ? 'md:grid-cols-2' : 'grid-cols-1'} gap-12 items-center`}>
          <div className={heroImageUrl ? 'text-left' : 'text-center mx-auto max-w-5xl'}>
            <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
              {valueProp}
            </h1>
            <p className="text-2xl text-slate-600 mb-12 leading-relaxed">
              {description}
            </p>
            <div className="flex gap-4 items-center justify-center">
              {!isReady ? (
                <span className="text-slate-400">Loading...</span>
              ) : isSignedIn ? (
                <Link
                  to="/dashboard"
                  className="inline-block px-12 py-4 text-white no-underline rounded-lg font-bold text-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <a
                  href={dreamAPI.auth.getSignUpUrl({ redirect: window.location.origin + '/dashboard' })}
                  className="inline-block px-12 py-4 text-white no-underline rounded-lg font-bold text-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Start Free Trial
                </a>
              )}
            </div>
            <p className="mt-6 text-slate-500 text-sm">No credit card required</p>
          </div>

          {heroImageUrl && (
            <div className="relative">
              <img src={heroImageUrl} alt="Product hero" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      {tiers.length > 0 && (
        <div id="features" className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-slate-600">Powerful features to help you succeed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers
              .flatMap(tier => tier.features || [])
              .filter((feature, index, self) => feature && self.indexOf(feature) === index)
              .slice(0, 6)
              .map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white text-2xl font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature}</h3>
                  <p className="text-slate-600">Get access to {feature.toLowerCase()} and more.</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Pricing Section */}
      <div id="pricing" className="max-w-7xl mx-auto px-8 py-24 bg-slate-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-slate-600">Choose the plan that fits your needs</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading pricing...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <div key={tier.name} className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.displayName || tier.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900">${tier.price}</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <p className="text-slate-600 mb-6 text-lg font-medium">
                  {tier.limit === -1 ? 'Unlimited requests' : `${tier.limit.toLocaleString()} requests/month`}
                </p>

                <button
                  onClick={() => handleGetStarted(tier.name)}
                  className={`w-full py-3 rounded-lg font-semibold transition-opacity ${
                    tier.name === plan
                      ? 'bg-slate-200 text-slate-600 cursor-default'
                      : tier.price === 0
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                      : 'text-white hover:opacity-90'
                  }`}
                  style={tier.name !== plan && tier.price > 0 ? { backgroundColor: primaryColor } : undefined}
                  disabled={tier.name === plan}
                >
                  {tier.name === plan ? 'Current Plan' : tier.price === 0 ? 'Start Free' : 'Get Started'}
                </button>

                {tier.features && tier.features.length > 0 && (
                  <ul className="mt-8 space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-slate-600">
                        <span className="mr-2">✓</span>
                        <span>{feature}</span>
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
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-8 text-center text-slate-600 text-sm">
          <p>© 2025 {appName}. Powered by dream-api.</p>
        </div>
      </footer>
    </div>
  );
}
