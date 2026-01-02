# dream-saas-basic

SaaS starter template powered by Dream API. Auth, billing, and usage tracking included.

## IMPORTANT - How This Works

**The SDK is published on npm.** When you run `npm install`, you get `@dream-api/sdk` from the npm registry. Nothing is local. The developer just needs their publishable key from the dream-api dashboard.

**Pricing tiers are configured in the dashboard.** The template pulls them via API. Don't hardcode prices.

**The publishable key (pk_xxx) is safe for frontend.** It's like Stripe's publishable key - designed to be in browser code.

## Quick Start

```bash
npm install          # Gets @dream-api/sdk from npm
npm run dev
```

Set `VITE_DREAM_PUBLISHABLE_KEY` in `.env.local` with your key from dream-api dashboard.

## Setup Command

Run `/setup` for guided configuration:
1. Get your publishable key
2. Install dependencies
3. Configure branding
4. Done - auth, billing, usage all wired up

## File Structure

```
src/
├── config.ts              # EDIT THIS - all branding in one place
├── App.tsx                # Router
├── components/
│   ├── Nav.tsx            # Shared nav with profile dropdown
│   └── Icons.tsx          # Feature icons
├── hooks/
│   └── useDreamAPI.tsx    # SDK integration (DON'T MODIFY)
└── pages/
    ├── Landing.tsx        # Homepage (uses config.ts)
    ├── Dashboard.tsx      # User dashboard
    └── ChoosePlanPage.tsx # Plan selection
```

## What To Customize

### src/config.ts (MAIN FILE)
All branding is here:
- `appName` - Your app name
- `accentColor` - emerald, sky, violet, rose, amber, zinc
- `logo` - Path to logo in public/ folder
- `hero` - Headline, subheadline, image
- `socialProof` - Company logos
- `howItWorks` - 3 steps with icons
- `features` - Feature grid with icons
- `faq` - Questions and answers
- `footer` - Links

### Dashboard.tsx
- Replace the "Demo Action" card with your actual product
- Call `api.usage.track()` when users consume a resource

## What NOT To Modify

1. **`src/hooks/useDreamAPI.tsx`** - Auth is handled, don't touch
2. **Auth flow** - Don't build custom sign-up/sign-in forms
3. **Pricing display** - Comes from API, don't hardcode

## SDK Reference

```typescript
const { api, isReady, isSignedIn, user, signOut } = useDreamAPI();

// User info
user?.email
user?.plan  // 'free', 'pro', etc.

// Usage tracking
await api.usage.track()     // Increment usage counter
await api.usage.check()     // Get current usage

// Billing
await api.billing.createCheckout({ tier: 'pro' })
await api.billing.openPortal({ returnUrl: '/dashboard' })

// Auth URLs
dreamAPI.auth.getSignUpUrl({ redirect: '/dashboard' })
dreamAPI.auth.getSignInUrl({ redirect: '/dashboard' })
dreamAPI.auth.getCustomerPortalUrl()  // Account settings

// Public (no auth)
await dreamAPI.products.listTiers()
```

## Deployment

```bash
npm run build
```

Deploy `dist/` anywhere:
- **Cloudflare Pages**: `npx wrangler pages deploy dist`
- **Vercel/Netlify**: Connect repo, set VITE_DREAM_PUBLISHABLE_KEY env var

## Don't Do These Things

- Don't hardcode prices (they come from API)
- Don't put secret key in frontend (only PK)
- Don't modify useDreamAPI.tsx
- Don't build custom auth UI
- Don't add "delete account" buttons (use getCustomerPortalUrl())
