/**
 * DASHBOARD - Main application page (protected)
 */

import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useDreamAPI } from '../hooks/useDreamAPI';

// ============================================================================
// BRANDING - Customize these values for your app
// ============================================================================
const BRANDING = {
  appName: 'YourApp',
  description: 'Your product description goes here',
  primaryColor: '#18181b',
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

  const { appName, description } = BRANDING;
  const plan = user?.plan || 'free';

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

  const makeRequest = async () => {
    if (!isReady) {
      setMessage('Please wait...');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const result = await api.usage.track();
      if (result.success) {
        setMessage('Request tracked successfully');
        await fetchUsage();
      }
    } catch (error: any) {
      setMessage(error.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePlan = () => navigate('/choose-plan');

  const handleManageBilling = async () => {
    if (!isReady) return;
    try {
      const result = await api.billing.openPortal({ returnUrl: window.location.href });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Billing portal error:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      setMessage('Upgrade successful!');
      const refresh = async () => {
        await refreshUser();
        await fetchUsage();
        window.history.replaceState({}, '', '/dashboard');
        setTimeout(() => setMessage(''), 3000);
      };
      setTimeout(refresh, 1500);
    } else if (isReady) {
      fetchUsage();
    }
  }, [isReady, searchParams, fetchUsage, refreshUser]);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-medium text-zinc-100 hover:text-white transition-colors">
            {appName}
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={handleChangePlan}
              className="px-4 py-2 text-sm font-medium rounded transition-colors bg-zinc-100 text-zinc-900 hover:bg-white"
            >
              {plan === 'free' ? 'Upgrade' : 'Change Plan'}
            </button>
            {plan !== 'free' && (
              <button
                onClick={handleManageBilling}
                className="px-4 py-2 text-sm font-medium rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
              >
                Billing
              </button>
            )}
            <div className="flex items-center gap-3 ml-2">
              <span className="text-zinc-500 text-sm">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-light text-zinc-100 mb-2">Dashboard</h1>
          <p className="text-zinc-500">{description}</p>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-[260px,1fr] gap-6">
          {/* Usage Sidebar */}
          {usage && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 h-fit">
              <h2 className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-4">Usage</h2>
              <div className="mb-4">
                <div className="text-2xl font-light text-zinc-100 mb-1">
                  {usage.usageCount}
                  {usage.limit !== 'unlimited' && (
                    <span className="text-zinc-500 text-lg"> / {usage.limit}</span>
                  )}
                </div>
                <p className="text-zinc-500 text-sm">requests this month</p>
              </div>
              <div className="p-3 bg-zinc-800/50 rounded border border-zinc-800">
                <p className="text-zinc-400 text-sm">
                  {usage.limit === 'unlimited' ? 'Unlimited' : `${usage.remaining} remaining`}
                </p>
              </div>
              <div className="mt-5 pt-5 border-t border-zinc-800">
                <span className="inline-block px-2 py-1 bg-zinc-800 text-zinc-400 text-xs font-medium rounded">
                  {plan.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            {/* Info Box */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded p-4 mb-6">
              <p className="text-zinc-300 text-sm font-medium mb-1">Replace this with your product</p>
              <p className="text-zinc-500 text-xs">The button below shows the pattern: call API, track usage, show result</p>
            </div>

            <h2 className="text-xl font-medium text-zinc-100 mb-2">Your Feature</h2>
            <p className="text-zinc-500 text-sm mb-6">
              Describe what your product does. Usage tracking is handled by the SDK.
            </p>

            <button
              onClick={makeRequest}
              disabled={loading || !isReady}
              className={`px-6 py-2.5 text-sm font-medium rounded transition-colors ${
                loading || !isReady
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-zinc-100 text-zinc-900 hover:bg-white'
              }`}
            >
              {loading ? 'Processing...' : !isReady ? 'Loading...' : 'Try Demo (Track Usage)'}
            </button>

            {message && (
              <div className="mt-4 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded text-zinc-300 text-sm">
                {message}
              </div>
            )}

            {/* Output Area */}
            <div className="mt-6 p-8 bg-zinc-800/30 border border-zinc-800 rounded text-center">
              <p className="text-zinc-600 text-sm">Your product output goes here</p>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        {plan === 'free' && (
          <div className="mt-8 p-8 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
            <h3 className="text-xl font-medium text-zinc-100 mb-2">Upgrade to Pro</h3>
            <p className="text-zinc-500 mb-6">Get unlimited access and more features</p>
            <button
              onClick={handleChangePlan}
              className="px-8 py-2.5 bg-zinc-100 text-zinc-900 rounded font-medium hover:bg-white transition-colors"
            >
              View Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
