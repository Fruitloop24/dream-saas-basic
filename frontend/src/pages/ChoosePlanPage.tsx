/**
 * ============================================================================
 * CHOOSE PLAN PAGE - PRICING SELECTION (Protected Route)
 * ============================================================================
 *
 * Uses @dream-api/sdk for tiers and checkout.
 * NO Clerk imports - SDK handles auth internally.
 *
 * ============================================================================
 */

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDreamAPI, dreamAPI } from '../hooks/useDreamAPI';

// ============================================================================
// AI: CUSTOMIZE THESE VALUES FOR YOUR BRAND
// ============================================================================
const BRANDING = {
  primaryColor: '#0f172a',
};

interface Tier {
  name: string;
  displayName?: string;
  price: number;
  limit: number;
  priceId: string;
  features?: string[];
}

export default function ChoosePlanPage() {
  const { api, isReady, user } = useDreamAPI();
  const navigate = useNavigate();

  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const { primaryColor } = BRANDING;
  const currentPlan = user?.plan || 'free';

  // Load tiers from SDK
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

  // Handle plan selection
  const handleSelectPlan = async (tier: Tier) => {
    if (tier.name === 'free' || tier.price === 0) {
      navigate('/dashboard');
      return;
    }

    if (!isReady) {
      setError('Please wait, loading...');
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
      setError(err.message || 'Something went wrong. Please try again.');
      setUpgrading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading pricing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 no-underline">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Choose Your Plan</h1>
          <p className="text-xl text-slate-600">Upgrade or change your subscription</p>
          {currentPlan && (
            <p className="mt-2 text-sm text-slate-500">
              Current plan: <span className="font-semibold">{currentPlan.toUpperCase()}</span>
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => {
            const isCurrentPlan = tier.name === currentPlan;
            const isUpgrading = upgrading === tier.name;
            const isPopular = index === 1; // Middle tier is popular

            return (
              <div
                key={tier.name}
                className={`relative bg-white p-8 rounded-2xl border-2 transition-all ${
                  isCurrentPlan
                    ? 'border-slate-900 shadow-lg'
                    : isPopular
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {/* Popular badge */}
                {isPopular && !isCurrentPlan && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-white text-xs font-bold rounded"
                    style={{ backgroundColor: primaryColor }}
                  >
                    MOST POPULAR
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrentPlan && (
                  <div
                    className="mb-4 inline-block px-3 py-1 text-white text-xs font-bold rounded"
                    style={{ backgroundColor: primaryColor }}
                  >
                    CURRENT PLAN
                  </div>
                )}

                {/* Tier Name */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {tier.displayName || tier.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900">${tier.price}</span>
                  <span className="text-slate-600">/month</span>
                </div>

                {/* Limit */}
                <p className="text-slate-600 mb-6 text-lg">
                  {tier.limit === -1 ? 'Unlimited requests' : `${tier.limit.toLocaleString()} requests/month`}
                </p>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(tier)}
                  disabled={isCurrentPlan || isUpgrading}
                  className={`w-full py-3 rounded-lg font-semibold transition-opacity ${
                    isCurrentPlan
                      ? 'bg-slate-200 text-slate-600 cursor-not-allowed'
                      : isUpgrading
                      ? 'bg-slate-300 text-slate-600 cursor-wait'
                      : tier.price === 0
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                      : 'text-white hover:opacity-90'
                  }`}
                  style={!isCurrentPlan && !isUpgrading && tier.price > 0 ? { backgroundColor: primaryColor } : undefined}
                >
                  {isCurrentPlan
                    ? 'Current Plan'
                    : isUpgrading
                    ? 'Processing...'
                    : tier.price === 0
                    ? 'Select Free'
                    : 'Upgrade'}
                </button>

                {/* Features */}
                {tier.features && tier.features.length > 0 && (
                  <ul className="mt-8 space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-slate-600 text-sm">
                        <span className="mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            All plans include access to core features • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
