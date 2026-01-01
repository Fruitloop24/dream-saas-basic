/**
 * ============================================================================
 * APP ROUTER - MAIN APPLICATION ROUTES
 * ============================================================================
 *
 * Uses @dream-api/sdk for everything - NO Clerk imports needed.
 * SDK handles auth internally via shared Clerk app.
 *
 * ============================================================================
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { DreamAPIProvider, useDreamAPI } from './hooks/useDreamAPI'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import ChoosePlanPage from './pages/ChoosePlanPage'

// Protected route wrapper using SDK auth
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isReady, isSignedIn } = useDreamAPI();

  // Show loading while SDK initializes
  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  // Redirect to landing if not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public: Landing page */}
      <Route path="/" element={<Landing />} />

      {/* Protected: Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected: Choose Plan */}
      <Route
        path="/choose-plan"
        element={
          <ProtectedRoute>
            <ChoosePlanPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <DreamAPIProvider>
      <AppRoutes />
    </DreamAPIProvider>
  );
}

export default App
