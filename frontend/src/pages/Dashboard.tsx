/**
 * ============================================================================
 * DASHBOARD - MAIN APPLICATION PAGE
 * ============================================================================
 *
 * Uses @dream-api/sdk for usage tracking and billing.
 * NO Clerk imports - SDK handles auth internally.
 *
 * ============================================================================
 */

import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useDreamAPI } from '../hooks/useDreamAPI';

// ============================================================================
// AI: CUSTOMIZE THESE VALUES FOR YOUR BRAND
// ============================================================================
const BRANDING = {
  appName: 'YourApp',
  description: 'Your product description goes here',
  primaryColor: '#0f172a',
};

interface UsageData {
  usageCount: number;
  limit: number | string;
  remaining: number | string;
  plan: string;
}

export default function Dashboard() {
  const { api, isReady, user, signOut, refreshUser } = useDreamAPI();
  const navigate = useNavigate();

  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();

  const { appName, description, primaryColor } = BRANDING;
  const plan = user?.plan || 'free';

  // Fetch usage from SDK
  const fetchUsage = useCallback(async () => {
    if (!isReady) return;
    try {
      const data = await api.usage.check();
      setUsage({
        usageCount: data.usageCount || 0,
        limit: data.limit || 'unlimited',
        remaining: data.remaining || 'unlimited',
        plan: data.plan || 'free',
      });
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    }
  }, [api, isReady]);

  // Track usage (demo button)
  const makeRequest = async () => {
    if (!isReady) {
      setMessage('Please wait, loading...');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const result = await api.usage.track();
      if (result.success) {
        setMessage('✓ Request tracked successfully!');
        await fetchUsage();
      }
    } catch (error: any) {
      setMessage(`✗ ${error.message || 'Request failed'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePlan = () => navigate('/choose-plan');

  // Open Stripe billing portal via SDK
  const handleManageBilling = async () => {
    if (!isReady) return;
    try {
      const result = await api.billing.openPortal({ returnUrl: window.location.href });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Billing portal error:', error);
      alert('Failed to open billing portal');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Handle success redirect and initial load
  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      setMessage('🎉 Upgrade successful! Refreshing...');
      // Refresh user data to get updated plan
      const refresh = async () => {
        await refreshUser();
        await fetchUsage();
        // Clear the success param from URL
        window.history.replaceState({}, '', '/dashboard');
        setMessage('');
      };
      setTimeout(refresh, 1500);
    } else if (isReady) {
      fetchUsage();
    }
  }, [isReady, searchParams, fetchUsage, refreshUser]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <Link to="/" className="no-underline text-slate-900 text-2xl font-bold hover:text-slate-700">
          {appName}
        </Link>
        <div className="flex gap-4 items-center">
          <button
            onClick={handleChangePlan}
            className="px-6 py-2 text-white border-none rounded-lg cursor-pointer font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            {plan === 'free' ? 'Upgrade' : 'Change Plan'}
          </button>
          {plan !== 'free' && (
            <button
              onClick={handleManageBilling}
              className="px-6 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg cursor-pointer font-semibold text-sm transition-colors"
            >
              Manage Billing
            </button>
          )}
          <div className="flex items-center gap-3">
            <span className="text-slate-600 text-sm">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl mb-2 text-slate-900 font-bold">Welcome back</h1>
          <p className="text-slate-600 text-lg">{description}</p>
        </div>

        {/* Main Grid: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8 mb-8">
          {/* Usage Sidebar */}
          {usage && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 h-fit">
              <h2 className="text-xs mb-4 text-slate-500 font-semibold uppercase tracking-wider">Usage</h2>
              <div className="mb-4">
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {usage.usageCount}
                  {usage.limit !== 'unlimited' && <span className="text-lg text-slate-400"> / {usage.limit}</span>}
                </div>
                <p className="text-slate-600 text-sm">requests this month</p>
              </div>
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                <p className="m-0 text-slate-700 text-sm font-medium">
                  {usage.limit === 'unlimited' ? 'Unlimited' : `${usage.remaining} remaining`}
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div
                  className="inline-block px-3 py-1 rounded text-xs font-bold tracking-wider text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {plan.toUpperCase()}
                </div>
              </div>
            </div>
          )}

          {/* Action Area - YOUR PRODUCT */}
          <div className="bg-white p-8 rounded-xl border border-gray-200">
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 mb-6">
              <p className="text-slate-800 text-sm font-semibold mb-1">Replace this with YOUR product</p>
              <p className="text-slate-600 text-xs">Button below shows pattern: call API, track usage, show results</p>
            </div>

            <h2 className="text-2xl mb-3 text-slate-900 font-bold">Your Feature</h2>
            <p className="text-slate-600 mb-6">Describe what your product does. Usage tracking is handled by the SDK.</p>

            <button
              onClick={makeRequest}
              disabled={loading || !isReady}
              className={`px-8 py-3 text-sm text-white border-none rounded-lg font-semibold transition-opacity ${
                loading || !isReady ? 'bg-slate-300 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'
              }`}
              style={!loading && isReady ? { backgroundColor: primaryColor } : undefined}
            >
              {loading ? 'Processing...' : !isReady ? 'Loading...' : 'Try Demo (Track Usage)'}
            </button>

            {message && (
              <div className="mt-6 px-4 py-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-sm">
                {message}
              </div>
            )}

            <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-slate-500 text-sm text-center">Your product output goes here</p>
            </div>
          </div>
        </div>

        {/* Upgrade CTA (free only) */}
        {plan === 'free' && (
          <div className="p-12 rounded-2xl text-white text-center" style={{ backgroundColor: primaryColor }}>
            <h3 className="text-3xl mb-3 font-bold">Upgrade to Pro</h3>
            <p className="text-lg mb-8 opacity-90">Get unlimited access and more features</p>
            <button
              onClick={handleChangePlan}
              className="px-12 py-3 bg-white border-none rounded-lg cursor-pointer font-bold text-base transition-opacity hover:opacity-90"
              style={{ color: primaryColor }}
            >
              View Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
