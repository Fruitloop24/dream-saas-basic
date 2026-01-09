<p align="center">
  <img src="https://raw.githubusercontent.com/Fruitloop24/dream-saas-basic/main/public/dream-logo.svg" alt="Dream API" width="120" />
</p>

<h1 align="center">Dream SaaS Template</h1>

<p align="center">
  <strong>Stop building auth. Stop configuring Stripe. Start shipping.</strong>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#the-ai-way">AI Setup</a> •
  <a href="#why-dream-api">Why Dream API</a> •
  <a href="#make-it-yours">Make It Yours</a>
</p>

---

## Why Dream API?

Every SaaS needs the same boring stuff: authentication, billing, usage limits, subscription management. You've built it before. It takes weeks. It's not why users pay you.

**Dream API handles all of it.** One API key. That's it.

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   You build ──────────►  YOUR PRODUCT                   │
│                          The thing that matters         │
│                          The reason users pay           │
│                                                         │
│   We handle ──────────►  Auth · Billing · Usage         │
│                          Subscriptions · Webhooks       │
│                          User management · Analytics    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**This template is the bones. You build the fun stuff.**

---

## Quick Start

```bash
git clone https://github.com/Fruitloop24/dream-saas-basic.git my-saas
cd my-saas
npm install
cp .env.example .env.local
```

Add your publishable key to `.env.local`:
```
VITE_DREAM_PUBLISHABLE_KEY=pk_test_xxx
```

```bash
npm run dev
```

**Open http://localhost:5173** - Your SaaS is live. Click around. Sign up works. Billing works. Everything works.

---

## The AI Way

This is where it gets fun. Open the project in **Claude Code**, **Cursor**, or **Windsurf** and run:

```
/setup
```

The AI becomes your co-founder:
- 🎨 **Branding** - Tell it your app name, it writes your headlines
- ✍️ **Copy** - Describe your product, it writes compelling copy
- 🎯 **Features** - List what you do, it picks icons and layouts
- 🌙 **Theme** - Light mode? Dark mode? Gradients? Just ask

**"I'm building an AI that writes legal contracts"** → Done. Branded. Ready to ship.

---

## Make It Yours

### The Config File

Everything lives in `src/config.ts`. Change it, see it instantly:

```typescript
export const config = {
  appName: 'ContractAI',
  tagline: 'Legal contracts in seconds',
  theme: 'dark',
  accentColor: 'violet',  // emerald, sky, violet, rose, amber, zinc

  hero: {
    headline: 'Stop paying lawyers $500/hour',
    subheadline: 'AI-powered contracts reviewed in seconds, not weeks',
  },

  features: [
    { icon: 'lightning', title: 'Instant Generation', description: '...' },
    { icon: 'shield', title: 'Legally Binding', description: '...' },
    { icon: 'clock', title: 'Save 10+ Hours', description: '...' },
  ],
}
```

### Your Product Goes Here

Find `src/pages/Dashboard.tsx`. There's a big comment: **YOUR PRODUCT GOES HERE**.

That's where your magic happens. The template handles everything around it.

---

## Make It Installable

Want users to install your SaaS like a native app? Run:

```
/pwa
```

Boom:
- 📱 **Install from browser** - "Add to Home Screen" prompt
- ⚡ **Works offline** - Cached assets, instant loads
- 🚫 **Skip the app stores** - No 30% Apple/Google tax
- 📲 **QR codes** - Print on business cards, embed on your site

---

## What's in Your Dashboard

Your [Dream API dashboard](https://dreamapi.dev) controls the business logic:

| You Set | App Updates |
|---------|-------------|
| Tier prices ($9, $29, $99) | Pricing page shows new prices |
| Usage limits (100, 1000, unlimited) | Limits enforced automatically |
| Feature flags per tier | Features gate automatically |

**Change prices at 2am → Your app updates instantly.** No deploy needed.

---

## The Stack

```
React + Vite          Fast dev, fast builds
Tailwind CSS          Style anything
Dream API SDK         Auth, billing, usage - done
Clerk (under hood)    Battle-tested auth
Stripe (under hood)   Battle-tested payments
```

You don't configure Clerk. You don't touch Stripe. You just build.

---

## Deploy in 60 Seconds

```bash
npm run build
```

**Cloudflare Pages** (recommended):
```bash
npx wrangler pages deploy dist
```

**Vercel/Netlify**: Connect repo, add `VITE_DREAM_PUBLISHABLE_KEY` env var. Done.

---

## Self-Host the Backend

Want to run your own Dream API instance?

Check out **[plug-saas](https://github.com/Fruitloop24/plug-saas)** - the open source backend. Deploy your own auth + billing infrastructure on Cloudflare Workers.

---

## We Want to Hear From You

This is how we think SaaS should be built:
- **AI-first** - Let the machine do the boring stuff
- **Config over code** - Change a string, not a component
- **Infrastructure handled** - You build product, we handle plumbing

**What's missing? What sucks? What would make this perfect?**

Open an issue. Tweet at us. We're building this for you.

---

<p align="center">
  <strong>MIT License</strong> - Do whatever you want. Build something cool.
</p>

<p align="center">
  <sub>Built with ☕ by developers who got tired of rebuilding auth for the 47th time.</sub>
</p>
