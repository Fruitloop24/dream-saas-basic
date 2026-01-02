/**
 * CHOOSE PLAN - Pricing selection (protected)
 */

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDreamAPI, dreamAPI } from '../hooks/useDreamAPI';
import type { Tier } from '@dream-api/sdk';

// ============================================================================
// BRANDING
// ============================================================================
const BRANDING = {
  appName: 'YourApp',
  primaryColor: '#18181b',
};

export default function ChoosePlanPage() {
  const { api, isReady, user } = useDreamAPI();
  const navigate = useNavigate();

  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const currentPlan = user?.plan || 'free';
  const { appName, primaryColor } = BRANDING;

  useEffect(() => {
    async function loadTiers() {
      try {
        const response = await dreamAPI.products.listTiers();
        setTiers(response.tiers || []);
      } catch (err: any) {
        console.error('Failed to load tiers:', err);
        setError(err.message || 'Failed to load pricing');
      } finally {
        setLoading(false);
      }
    }
    loadTiers();
  }, []);

  const handleSelectPlan = async (tier: Tier) => {
    if (tier.name === 'free' || tier.price === 0) {
      navigate('/dashboard');
      return;
    }

    if (!isReady) {
      setError('Please wait...');
      return;
    }

    setUpgrading(tier.name);
    try {
      const result = await api.billing.createCheckout({
        tier: tier.name,
        priceId: tier.priceId,
        successUrl: window.location.origin + '/dashboard?success=true',
        cancelUrl: window.location.origin + '/choose-plan?canceled=true',
      });

      if (result.url) {
        window.location.href = result.url;
      } else {
        setError('Failed to create checkout session');
        setUpgrading(null);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong');
      setUpgrading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <nav className="border-b border-zinc-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
            {appName}
          </Link>
          <Link to="/dashboard" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            &larr; Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-zinc-100 mb-3">Choose Your Plan</h1>
          <p className="text-zinc-500">Upgrade or change your subscription</p>
          {currentPlan && (
            <p className="mt-2 text-sm text-zinc-600">
              Current plan: <span className="text-zinc-400">{currentPlan.toUpperCase()}</span>
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 max-w-md mx-auto bg-red-950/50 border border-red-900 rounded-lg p-4">
            <p className="text-red-400 text-center text-sm">{error}</p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, index) => {
            const isCurrentPlan = tier.name === currentPlan;
            const isUpgrading = upgrading === tier.name;
            const isPopular = index === 1;

            return (
              <div
                key={tier.name}
                className={`relative bg-zinc-900/50 rounded-lg p-6 transition-colors ${
                  isCurrentPlan
                    ? 'border-2 border-emerald-500/50'
                    : isPopular
                    ? 'border-2 border-emerald-500/30'
                    : 'border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Popular badge */}
                {isPopular && !isCurrentPlan && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    POPULAR
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrentPlan && (
                  <div
                    className="mb-4 inline-block px-2 py-1 text-xs font-medium rounded text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    CURRENT
                  </div>
                )}

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
                  onClick={() => handleSelectPlan(tier)}
                  disabled={isCurrentPlan || isUpgrading}
                  className={`w-full py-2.5 rounded text-sm font-medium transition-colors ${
                    isCurrentPlan
                      ? 'bg-zinc-800 text-zinc-500 cursor-default'
                      : isUpgrading
                      ? 'bg-zinc-800 text-zinc-500 cursor-wait'
                      : tier.price === 0
                      ? 'border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
                      : 'text-white hover:opacity-90'
                  }`}
                  style={
                    !isCurrentPlan && !isUpgrading && tier.price > 0
                      ? { backgroundColor: primaryColor }
                      : undefined
                  }
                >
                  {isCurrentPlan
                    ? 'Current Plan'
                    : isUpgrading
                    ? 'Processing...'
                    : tier.price === 0
                    ? 'Select Free'
                    : 'Upgrade'}
                </button>

                {tier.features && tier.features.length > 0 && (
                  <ul className="mt-6 space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-zinc-500 text-sm">
                        <span className="w-1 h-1 bg-zinc-600 rounded-full mt-2 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-zinc-600 text-sm">
            All plans include core features &middot; Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
