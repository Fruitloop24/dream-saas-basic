# /setup - SaaS Template Setup

You are setting up a Dream API SaaS template. Read the CLAUDE.md file first for full context.

**Key facts:**
- SDK is published on npm as `@dream-api/sdk` - just run `npm install`
- Publishable key (pk_xxx) is SAFE for frontend - like Stripe's publishable key
- Pricing tiers are configured in the dream-api dashboard - they load via API
- All branding goes in `src/config.ts` - one file for everything

---

## Step 1: API Key (DO THIS FIRST)

Ask: **"What's your Dream API publishable key? It starts with `pk_test_` or `pk_live_`."**

Explain: "This key is safe for frontend code - it's like Stripe's publishable key. You get it from your dream-api dashboard at [your-dashboard-url]. Your secret key (sk_) stays on your server only."

Once they provide the key:

1. Create `.env.local`:
```
VITE_DREAM_PUBLISHABLE_KEY=[their key]
```

2. Run these commands:
```bash
npm install
```

3. Tell them: "Dependencies installed. Your pricing tiers will load automatically from your dashboard - no configuration needed here."

---

## Step 2: Branding (Quick)

Ask: **"Tell me about your app - what's it called and what does it do? I'll set up the branding."**

From their answer, update `src/config.ts`:
- `appName` - Their app name
- `tagline` - Short tagline
- `hero.headline` - Benefit-focused headline
- `hero.subheadline` - What it does
- `howItWorks.steps` - 3 steps based on their product
- `features.items` - 3-6 features with icons

Available icons: `user`, `settings`, `rocket`, `check`, `chart`, `shield`, `lightning`, `globe`, `clock`, `code`

---

## Step 3: Style

Ask: **"Pick a color: emerald (green), sky (blue), violet (purple), rose (pink), amber (orange), or zinc (gray)?"**

Update `src/config.ts`:
```typescript
accentColor: '[their choice]',
```

---

## Step 4: Logo (Optional)

Ask: **"Got a logo? Drop it in the `public/` folder and tell me the filename. Or skip for text-only."**

If they have one, update `src/config.ts`:
```typescript
logo: '/[filename]',
```

---

## Step 5: Hero Image (Optional)

Ask: **"Want a hero image or screenshot? Drop it in `public/` and tell me the filename. Or skip for text-only hero."**

If they have one, update `src/config.ts`:
```typescript
hero: {
  // ... other fields
  image: '/[filename]',
},
```

---

## Done

Run:
```bash
npm run dev
```

Tell them:
- "Your app is running at http://localhost:5173"
- "Pricing tiers load from your dream-api dashboard"
- "Auth, billing, and usage tracking are all wired up"
- "Edit `src/config.ts` anytime to change branding"
- "Edit `src/pages/Dashboard.tsx` to add your actual product features"

---

## Reference

See CLAUDE.md for:
- SDK methods (`api.usage.track()`, `api.billing.createCheckout()`, etc.)
- File structure
- What not to modify
- Deployment instructions

---

## If Things Go Wrong

**"npm install failed"** - Check Node version (need 18+), try `rm -rf node_modules && npm install`

**"Tiers not loading"** - Check publishable key in `.env.local`, make sure it matches dashboard

**"Auth not working"** - The SDK handles this automatically. Don't build custom auth forms.
