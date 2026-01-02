# dream-saas-basic

SaaS starter template powered by Dream API. Auth, billing, and usage tracking included.

## Quick Start

```bash
npm install
npm run dev
```

Set `VITE_DREAM_PUBLISHABLE_KEY` in `.env.local` with your key from dream-api dashboard.

## Setup Command

Run `/setup` for guided configuration. The AI will ask about your app name, features, style, and update all the files for you.

## File Structure

```
src/
├── App.tsx                 # Router, protected routes
├── main.tsx                # Entry point
├── index.css               # Tailwind
├── hooks/
│   └── useDreamAPI.tsx     # SDK integration (DON'T MODIFY)
└── pages/
    ├── Landing.tsx         # Homepage - CONTENT object for customization
    ├── Dashboard.tsx       # User dashboard - replace demo with your product
    └── ChoosePlanPage.tsx  # Plan selection
```

## What To Customize

### Landing.tsx
Edit the `CONTENT` object at the top:
- `appName` - Your app name
- `hero` - Headline, subheadline, CTA text
- `howItWorks` - 3 steps explaining your product
- `features` - Key features grid
- `faq` - Common questions
- `finalCta` - Bottom call-to-action
- `footer` - Links

### Dashboard.tsx
- Change `BRANDING.appName` to match
- Replace the "Demo Action" card with your actual product feature
- Call `api.usage.track()` when users consume a billable resource

### ChoosePlanPage.tsx
- Change `BRANDING.appName` to match
- Styling only - pricing comes from API

## What NOT To Modify

1. **`src/hooks/useDreamAPI.tsx`** - Handles auth correctly, don't touch
2. **Auth flow** - Don't build custom sign-up/sign-in forms

## SDK URLs (Use These)

```typescript
// Sign up (new users) - MUST use this to set metadata
dreamAPI.auth.getSignUpUrl({ redirect: '/dashboard' })

// Sign in (returning users)
dreamAPI.auth.getSignInUrl({ redirect: '/dashboard' })

// Account settings (profile, password)
dreamAPI.auth.getCustomerPortalUrl()

// Billing (payment methods, invoices)
api.billing.openPortal({ returnUrl: '/dashboard' })
```

## SDK Methods

```typescript
const { api, isReady, isSignedIn, user, signOut } = useDreamAPI();

// User info
user?.email
user?.plan  // 'free', 'pro', etc.

// Usage
await api.usage.track()     // Increment usage
await api.usage.check()     // Get current usage

// Billing
await api.billing.createCheckout({ tier: 'pro' })
await api.billing.openPortal({ returnUrl: '/dashboard' })

// Public (no auth needed)
await dreamAPI.products.listTiers()
```

## Deployment

```bash
npm run build
```

Deploy `dist/` to:
- **Cloudflare Pages**: `npx wrangler pages deploy dist`
- **Vercel/Netlify**: Connect repo, set env var
- **GitHub Pages**: Push dist to gh-pages branch

Set `VITE_DREAM_PUBLISHABLE_KEY` in your host's environment.

## Don't Do These Things

- Don't add "delete account" buttons (use `getCustomerPortalUrl()`)
- Don't hardcode prices (they come from API)
- Don't put secret key in frontend code
- Don't modify useDreamAPI.tsx
- Don't build custom auth UI
