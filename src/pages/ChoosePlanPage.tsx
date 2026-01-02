/**
 * CHOOSE PLAN - Pricing selection (protected)
 *
 * Uses shared config from src/config.ts
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDreamAPI, dreamAPI } from '../hooks/useDreamAPI';
import { CONFIG, getAccentClasses } from '../config';
import Nav from '../components/Nav';
import type { Tier } from '@dream-api/sdk';

export default function ChoosePlanPage() {
  const { api, isReady, user } = useDreamAPI();
  const navigate = useNavigate();

  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const currentPlan = user?.plan || 'free';
  const accent = getAccentClasses();

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
      {/* Shared Nav with profile dropdown */}
      <Nav />

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-zinc-100 mb-3">Choose Your Plan</h1>
          <p className="text-zinc-500">Upgrade or change your subscription</p>
          {currentPlan && (
            <p className="mt-2 text-sm text-zinc-600">
              Current plan: <span className={accent.text}>{currentPlan.toUpperCase()}</span>
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
        <div className={`grid gap-6 ${tiers.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : tiers.length >= 3 ? 'md:grid-cols-3' : ''}`}>
          {tiers.map((tier, index) => {
            const isCurrentPlan = tier.name === currentPlan;
            const isUpgrading = upgrading === tier.name;
            const isPopular = tier.popular || index === Math.floor(tiers.length / 2);

            return (
              <div
                key={tier.name}
                className={`relative bg-zinc-900/50 rounded-xl p-6 transition-colors ${
                  isCurrentPlan
                    ? `border-2 ${accent.border}`
                    : isPopular
                    ? `border-2 ${accent.border} opacity-80`
                    : 'border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Popular badge */}
                {isPopular && !isCurrentPlan && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded ${accent.bg} text-white`}>
                    POPULAR
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrentPlan && (
                  <div className={`mb-4 inline-block px-2 py-1 text-xs font-medium rounded ${accent.bg} text-white`}>
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
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isCurrentPlan
                      ? 'bg-zinc-800 text-zinc-500 cursor-default'
                      : isUpgrading
                      ? 'bg-zinc-800 text-zinc-500 cursor-wait'
                      : tier.price === 0
                      ? 'border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
                      : `${accent.bg} text-white ${accent.bgHover}`
                  }`}
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
                        <svg className={`w-4 h-4 mt-0.5 ${accent.text} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
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
