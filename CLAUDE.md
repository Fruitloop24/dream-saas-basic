# dream-saas-basic

SaaS starter template with auth, billing, and usage tracking via `@dream-api/sdk`.

## Commands

```bash
# Install
npm install

# Development
npm run dev

# Build
npm run build

# Deploy (output in dist/)
```

## Quick Setup

```bash
# 1. Clone and install
git clone https://github.com/Fruitloop24/dream-saas-basic.git
cd dream-saas-basic
npm install

# 2. Set your publishable key (get from dream-api dashboard)
cp .env.example .env.local
# Edit: VITE_DREAM_PUBLISHABLE_KEY=pk_test_xxx

# 3. Run
npm run dev
```

## What's Included

- Landing page with pricing
- User authentication (Clerk)
- Dashboard with usage tracking
- Plan selection & Stripe checkout
- Billing portal access

## Customization Guide

### 1. Branding (Start Here)

Edit the `BRANDING` object in each page:

**`src/pages/Landing.tsx`**:
```typescript
const BRANDING = {
  appName: 'YourApp',           // Company/product name
  valueProp: 'Your Headline',   // Hero section headline
  description: 'What you do',   // One-liner description
  primaryColor: '#0f172a',      // Brand color (hex)
  logoUrl: '',                  // Optional: logo image URL
  heroImageUrl: '',             // Optional: hero section image
};
```

**`src/pages/Dashboard.tsx`**:
```typescript
const BRANDING = {
  appName: 'YourApp',
  description: 'Your product description',
  primaryColor: '#0f172a',
};
```

**`src/pages/ChoosePlanPage.tsx`**:
```typescript
const BRANDING = {
  primaryColor: '#0f172a',
};
```

### 2. Replace the Demo Feature

The Dashboard has a demo "Track Usage" button. Replace it with your actual product:

**Location:** `src/pages/Dashboard.tsx` (ACTION AREA section)

```tsx
{/* Replace this section with your product UI */}
<div className="bg-white p-8 rounded-xl border border-gray-200">
  <h2>Your Feature</h2>
  <button onClick={makeRequest}>Do Something</button>
</div>
```

The pattern:
1. Call your API/feature
2. Track usage with `api.usage.track()`
3. Update UI with results

### 3. Add New Pages

1. Create file: `src/pages/NewPage.tsx`
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

## File Structure

```
dream-saas-basic/
├── CLAUDE.md              # This file (AI instructions)
├── src/
│   ├── App.tsx            # Router + protected routes
│   ├── hooks/
│   │   └── useDreamAPI.tsx    # SDK wrapper - DON'T MODIFY
│   ├── pages/
│   │   ├── Landing.tsx        # Public homepage + pricing
│   │   ├── Dashboard.tsx      # Main app (protected)
│   │   └── ChoosePlanPage.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── package.json
└── .gitignore
```

## SDK Patterns

### Check Auth State
```typescript
const { isReady, isSignedIn, user } = useDreamAPI();
if (!isReady) return <Loading />;
if (!isSignedIn) return <SignInPrompt />;
```

### Get User's Plan
```typescript
const { user } = useDreamAPI();
const plan = user?.plan || 'free';
```

### Track Usage
```typescript
const { api } = useDreamAPI();
const result = await api.usage.track();
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

## Auth Flow

1. User clicks "Sign Up" → Clerk hosted signup
2. User creates account (email/Google)
3. Redirected back, already logged in
4. SDK auto-initializes auth state

## Environment Variables

```env
# .env.local
VITE_DREAM_PUBLISHABLE_KEY=pk_test_xxx

# That's it! No secret key in frontend.
```

## Deployment

Works with Vercel, Netlify, Cloudflare Pages:

```bash
npm run build
# Deploy dist/
```

Set `VITE_DREAM_PUBLISHABLE_KEY` in your host's environment variables.

## Don't Modify

- `src/hooks/useDreamAPI.tsx` - SDK wrapper
- Auth flow logic - handled by SDK

## Adding More Pages

Common additions:
- `/features` - Feature showcase
- `/about` - About page
- `/pricing` - Dedicated pricing (currently on landing)
- `/docs` - Documentation

Just create the page component and add a route in App.tsx.
