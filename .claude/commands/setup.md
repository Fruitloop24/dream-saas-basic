# SaaS Template Setup

Hey! I'm here to help you set up your SaaS app. We'll configure your branding, content, and get you ready to launch.

## How This Works

I'll ask you questions one at a time. Answer each one, and I'll update the code for you. At the end, you'll have a fully branded SaaS ready to deploy.

---

## Questions (Ask ONE at a time, wait for answer)

### 1. App Name
"What's the name of your app?"

### 2. Headline
"What's your main headline? This is the big text visitors see first. Focus on the benefit you provide."

Example: "Automate your workflow in minutes"

### 3. Subheadline
"Now a supporting line - describe what your app does in one sentence."

Example: "The simple tool that helps teams save 10 hours a week on repetitive tasks."

### 4. How It Works
"Describe your process in 3 simple steps. What does a user do?"

Example:
1. Sign up and connect your tools
2. Set up your automation rules
3. Watch it work while you focus on what matters

### 5. Features
"What are 3-6 key features of your product? Give me a title and one-line description for each."

Example:
- **Smart Automation** - Set rules once, let the system handle the rest
- **Team Dashboard** - See what everyone's working on in real-time
- **Integrations** - Connect with the tools you already use

### 6. FAQ
"What questions do your customers commonly ask? Give me 3-4 questions and answers."

(I'll keep some defaults if you're not sure yet)

### 7. Style
"What visual style fits your brand?"

- **Minimal** - Clean, professional, understated (zinc/gray tones)
- **Bold** - Strong colors, high contrast (reds, oranges, violets)
- **Tech** - Developer-focused, modern (blues, cyans, greens)
- **Friendly** - Approachable, warm (ambers, pinks)

Based on their choice, suggest colors:
- Minimal: Keep defaults (zinc)
- Bold: `#dc2626` red or `#7c3aed` violet
- Tech: `#0ea5e9` sky or `#10b981` emerald
- Friendly: `#f59e0b` amber or `#ec4899` pink

Ask: "I suggest [color]. Want this, or give me a hex code?"

### 8. Logo (Optional)
"Do you have a logo file? If yes, place it in `public/` and tell me the filename. If not, we'll use text."

### 9. Footer Links (Optional)
"Any footer links? (Privacy policy, terms, contact page, etc.)"

---

## After Gathering Info

Update the `CONTENT` object in `src/pages/Landing.tsx`:

```typescript
const CONTENT = {
  appName: '[their app name]',

  hero: {
    headline: '[their headline]',
    subheadline: '[their subheadline]',
    cta: 'Start Free',
    ctaSubtext: 'No credit card required',
  },

  howItWorks: {
    headline: 'How It Works',
    subheadline: 'Get started in minutes',
    steps: [
      { number: '1', title: '[step 1 title]', description: '[step 1 desc]' },
      { number: '2', title: '[step 2 title]', description: '[step 2 desc]' },
      { number: '3', title: '[step 3 title]', description: '[step 3 desc]' },
    ],
  },

  features: {
    headline: 'Everything You Need',
    subheadline: '[customize or keep]',
    items: [
      { title: '[feature 1]', description: '[desc]' },
      { title: '[feature 2]', description: '[desc]' },
      // ... more features
    ],
  },

  faq: {
    headline: 'Questions & Answers',
    items: [
      { question: '[q1]', answer: '[a1]' },
      { question: '[q2]', answer: '[a2]' },
      // ... more FAQ
    ],
  },

  finalCta: {
    headline: 'Ready to get started?',
    subheadline: '[customize based on their product]',
    cta: 'Start Free Today',
  },

  footer: {
    links: [
      // Add their links: { label: 'Privacy', href: '/privacy' }
    ] as Array<{ label: string; href: string }>,
  },
};
```

Also update `src/pages/Dashboard.tsx` and `src/pages/ChoosePlanPage.tsx`:
- Change `appName` in the BRANDING object to match

If they have a logo, update the nav in Landing.tsx:
```tsx
<Link to="/" className="flex items-center gap-2">
  <img src="/[their-logo.png]" alt="Logo" className="h-8" />
  <span className="text-xl font-medium">{CONTENT.appName}</span>
</Link>
```

---

## Final Steps

After making changes, tell them:

### Summary
"Your app is configured!"
- App: [name]
- Style: [style]
- Primary Color: [color]

### Run Locally
```bash
npm install
npm run dev
```

### Set Your API Key
"Create `.env.local` and add your publishable key from dream-api dashboard:"
```
VITE_DREAM_PUBLISHABLE_KEY=pk_test_xxx
```

### Create Your Tiers
"Log into your dream-api dashboard and create your pricing tiers. They'll automatically appear on your pricing page."

### Customize the Dashboard
"The Dashboard page (`src/pages/Dashboard.tsx`) has a demo 'Track Usage' button. Replace that section with your actual product feature."

---

## Deployment

Ask: "Ready to deploy? I can help you set up:"

### Option 1: Cloudflare Pages (Recommended)
```bash
npm run build
npx wrangler pages deploy dist --project-name=[app-name]
```
- Free SSL, global CDN, automatic deploys from GitHub

### Option 2: GitHub Pages
```bash
npm run build
# Push dist/ to gh-pages branch
```

### Option 3: Vercel / Netlify
```bash
npm run build
# Connect your repo, set VITE_DREAM_PUBLISHABLE_KEY in environment
```

---

## What NOT To Do

When customizing this template:

1. **Don't modify `src/hooks/useDreamAPI.tsx`** - This handles auth correctly
2. **Don't build custom sign-up forms** - Use `dreamAPI.auth.getSignUpUrl()`
3. **Don't build custom sign-in forms** - Use `dreamAPI.auth.getSignInUrl()`
4. **Don't add "delete account" buttons** - Users manage accounts via `dreamAPI.auth.getCustomerPortalUrl()`
5. **Don't put SK in frontend code** - Only PK goes in the browser

---

## Common Customizations

If they ask for:

**Adding a new page:**
1. Create `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Wrap in `<ProtectedRoute>` if it needs auth

**Adding product features:**
Replace the demo card in Dashboard.tsx with their actual UI. Call `api.usage.track()` when users do billable actions.

**Custom pricing display:**
The pricing section pulls from the API automatically. Customize the display in Landing.tsx but don't hardcode prices.

**Adding social proof logos:**
Update the `socialProof.logos` array in CONTENT with image paths.

---

## Need More Help?

- **SDK Reference:** See `docs/SDK-GUIDE.md` in the main dream-api repo
- **API Endpoints:** See `docs/API-REFERENCE.md`
- **Issues:** https://github.com/dream-api/sdk/issues
