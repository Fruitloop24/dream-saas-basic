/**
 * DASHBOARD - Protected user dashboard
 *
 * Uses shared config from src/config.ts
 */

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDreamAPI } from '../hooks/useDreamAPI';
import { CONFIG, getAccentClasses, getAccentHex } from '../config';
import Nav from '../components/Nav';

interface UsageData {
  usageCount: number;
  limit: number | string;
  remaining: number | string;
  plan: string;
}

export default function Dashboard() {
  const { api, isReady, user, refreshUser } = useDreamAPI();
  const navigate = useNavigate();

  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();

  const accent = getAccentClasses();
  const accentHex = getAccentHex();
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
      {/* Shared Nav with profile dropdown */}
      <Nav />

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
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
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
                      className={`h-2 rounded-full transition-all ${accent.bg}`}
                      style={{
                        width: `${Math.min((usage.usageCount / Number(usage.limit)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-sm">Plan:</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${accent.bg} text-white`}>
                    {plan.toUpperCase()}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-zinc-500">Loading...</div>
            )}
          </div>

          {/* Demo Action Card - REPLACE THIS WITH YOUR PRODUCT */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-4">Demo Action</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Replace this with your product's main action. Each click tracks usage.
            </p>
            <button
              onClick={handleTrackUsage}
              disabled={loading || !isReady}
              className={`w-full py-3 text-sm font-medium rounded-lg transition-colors ${
                loading || !isReady
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : `${accent.bg} text-white ${accent.bgHover}`
              }`}
            >
              {loading ? 'Processing...' : 'Track Usage'}
            </button>
          </div>
        </div>

        {/* Upgrade CTA */}
        {plan === 'free' && (
          <div className="mt-8 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
            <h3 className="text-lg font-medium text-zinc-100 mb-2">Upgrade Your Plan</h3>
            <p className="text-zinc-500 text-sm mb-4">
              Remove limits and unlock all features
            </p>
            <button
              onClick={() => navigate('/choose-plan')}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg ${accent.bg} text-white ${accent.bgHover} transition-colors`}
            >
              View Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
