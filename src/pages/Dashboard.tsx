/**
 * DASHBOARD - Protected user dashboard
 *
 * Customize this page for your SaaS product.
 */

import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useDreamAPI } from '../hooks/useDreamAPI';

// ============================================================================
// BRANDING - Customize these values
// ============================================================================
const BRANDING = {
  appName: 'YourApp',
  description: 'Your product description here',
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

  const { appName, primaryColor } = BRANDING;
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

  // Demo: Track usage when button clicked
  const handleTrackUsage = async () => {
    if (!isReady) return;
    setLoading(true);
    setMessage('');

    try {
      const result = await api.usage.track();
      if (result.success) {
        setMessage('Usage tracked successfully!');
        await fetchUsage();
      } else {
        setMessage('Usage limit reached. Please upgrade.');
      }
    } catch (error: any) {
      if (error.message?.includes('limit')) {
        setMessage('Usage limit reached. Please upgrade.');
      } else {
        setMessage(error.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleChangePlan = () => navigate('/choose-plan');

  const handleManageBilling = async () => {
    if (!isReady) return;
    try {
      const result = await api.billing.openPortal({ returnUrl: window.location.href });
      if (result.url) window.location.href = result.url;
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
          <Link to="/" className="text-xl font-medium text-zinc-100 hover:text-zinc-300 transition-colors">
            {appName}
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={handleChangePlan}
              className="px-4 py-2 text-sm font-medium rounded transition-colors text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {plan === 'free' ? 'Upgrade' : 'Change Plan'}
            </button>
            {plan !== 'free' && (
              <button
                onClick={handleManageBilling}
                className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
              >
                Billing
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-zinc-100 mb-1">Dashboard</h1>
          <p className="text-zinc-500">Welcome back, {user?.email}</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${
            message.includes('limit') || message.includes('wrong')
              ? 'bg-red-950/50 border border-red-900 text-red-400'
              : 'bg-emerald-950/50 border border-emerald-900 text-emerald-400'
          }`}>
            {message}
          </div>
        )}

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Usage Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-4">Usage This Month</h2>
            {usage ? (
              <>
                <div className="text-3xl font-light text-zinc-100 mb-2">
                  {usage.usageCount}
                  {usage.limit !== 'unlimited' && (
                    <span className="text-zinc-500 text-lg"> / {usage.limit}</span>
                  )}
                </div>
                {usage.limit !== 'unlimited' && (
                  <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((usage.usageCount / Number(usage.limit)) * 100, 100)}%`,
                        backgroundColor: primaryColor
                      }}
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-sm">Plan:</span>
                  <span
                    className="px-2 py-0.5 text-xs font-medium rounded text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {plan.toUpperCase()}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-zinc-500">Loading...</div>
            )}
          </div>

          {/* Demo Action Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-4">Demo Action</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Replace this with your product's main action. Each click tracks usage.
            </p>
            <button
              onClick={handleTrackUsage}
              disabled={loading || !isReady}
              className={`w-full py-3 text-sm font-medium rounded transition-colors ${
                loading || !isReady
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'text-white hover:opacity-90'
              }`}
              style={!loading && isReady ? { backgroundColor: primaryColor } : undefined}
            >
              {loading ? 'Processing...' : 'Track Usage'}
            </button>
          </div>
        </div>

        {/* Upgrade CTA */}
        {plan === 'free' && (
          <div className="mt-8 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-zinc-100 mb-2">Upgrade to Pro</h3>
            <p className="text-zinc-500 text-sm mb-4">
              Remove limits and unlock all features
            </p>
            <button
              onClick={handleChangePlan}
              className="px-6 py-2.5 text-sm font-medium rounded text-white hover:opacity-90 transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              View Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
