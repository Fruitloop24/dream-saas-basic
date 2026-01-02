# dream-saas-basic

Minimal SaaS starter with auth, billing, and usage tracking via `@dream-api/sdk`.

## Commands

```bash
npm install    # Install dependencies
npm run dev    # Start dev server
npm run build  # Build for production
```

## Quick Setup

```bash
# 1. Clone and install
git clone https://github.com/Fruitloop24/dream-saas-basic.git
cd dream-saas-basic
npm install

# 2. Set your publishable key
cp .env.example .env.local
# Edit: VITE_DREAM_PUBLISHABLE_KEY=pk_test_xxx

# 3. Run
npm run dev
```

## What's Included

- Landing page with pricing
- User auth (Clerk integration)
- Protected dashboard
- Usage tracking sidebar
- Plan selection + Stripe checkout
- Billing portal for paid users

## File Structure

```
dream-saas-basic/
├── src/
│   ├── App.tsx              # Router + protected routes
│   ├── main.tsx             # Entry point
│   ├── index.css            # Tailwind
│   ├── hooks/
│   │   └── useDreamAPI.tsx  # SDK wrapper (don't modify)
│   └── pages/
│       ├── Landing.tsx      # Public homepage
│       ├── Dashboard.tsx    # Main app (protected)
│       └── ChoosePlanPage.tsx
├── .claude/
│   └── commands/
│       └── setup.md         # AI setup command
├── CLAUDE.md                # This file
└── .env.example
```

## Customization

### Branding

Edit the `BRANDING` object in each page:

**src/pages/Landing.tsx:**
```typescript
const BRANDING = {
  appName: 'YourApp',
  tagline: 'Your headline goes here',
  description: 'What your product does.',
  primaryColor: '#18181b',
  accentColor: '#3f3f46',
};
```

**src/pages/Dashboard.tsx:**
```typescript
const BRANDING = {
  appName: 'YourApp',
  description: 'Your product description',
  primaryColor: '#18181b',
};
```

### Style Presets

**Minimal (default)**
```typescript
primaryColor: '#18181b', accentColor: '#3f3f46'
```

**Tech**
```typescript
primaryColor: '#0ea5e9', accentColor: '#06b6d4'  // Sky/Cyan
primaryColor: '#10b981', accentColor: '#22c55e'  // Emerald
```

**Bold**
```typescript
primaryColor: '#7c3aed', accentColor: '#a855f7'  // Violet
primaryColor: '#dc2626', accentColor: '#ea580c'  // Red/Orange
```

### Replace the Demo Feature

The Dashboard has a demo "Track Usage" button. Replace it with your product:

**Location:** `src/pages/Dashboard.tsx` (Main Content section)

Pattern:
1. User does something
2. Call your API/logic
3. Track usage: `await api.usage.track()`
4. Show results

## SDK Patterns

### Auth State
```typescript
const { isReady, isSignedIn, user } = useDreamAPI();
const plan = user?.plan || 'free';
```

### Track Usage
```typescript
const { api } = useDreamAPI();
await api.usage.track();
```

### Check Usage
```typescript
const usage = await api.usage.check();
// usage.usageCount, usage.limit, usage.remaining
```

### Create Checkout
```typescript
const { url } = await api.billing.createCheckout({
  tier: 'pro',
  successUrl: window.location.origin + '/dashboard?success=true',
  cancelUrl: window.location.origin + '/choose-plan',
});
window.location.href = url;
```

### List Tiers (Public)
```typescript
import { dreamAPI } from './hooks/useDreamAPI';
const { tiers } = await dreamAPI.products.listTiers();
```

## Adding Pages

1. Create `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`:

```tsx
<Route
  path="/new-feature"
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  }
/>
```

## Environment

```env
# .env.local
VITE_DREAM_PUBLISHABLE_KEY=pk_test_xxx
```

No secret key needed in frontend.

## Deployment

```bash
npm run build
# Deploy dist/ to Cloudflare Pages, Vercel, Netlify
```

Set `VITE_DREAM_PUBLISHABLE_KEY` in host environment.

## How It Works

### Auth Flow
1. User clicks "Sign Up" → Clerk hosted signup
2. Account created → redirected back logged in
3. SDK auto-initializes auth

### Billing Flow
1. User clicks "Upgrade" → choose plan page
2. Selects tier → Stripe Checkout
3. Payment complete → redirect with `?success=true`
4. Plan updated in user metadata

### Usage Flow
1. User does action → `api.usage.track()`
2. Count increments in D1
3. `api.usage.check()` returns current/limit/remaining
4. Limit hit → return error (enforce in your logic)

## Don't Modify

- `src/hooks/useDreamAPI.tsx` - SDK wrapper handles auth
- Auth flow logic - managed by SDK internally
