# SaaS Setup

Configure this SaaS template through a guided conversation.

## Instructions

Ask these questions ONE AT A TIME and wait for each answer:

### 1. App Name
"What's your app name?"

### 2. Tagline
"What's your main headline? (What problem do you solve?)"

### 3. Description
"Describe what your app does in one sentence."

### 4. Style
"What style fits your brand?"
- **Minimal** - Clean, professional, understated
- **Bold** - Strong colors, high contrast
- **Tech** - Developer-focused, modern
- **Friendly** - Approachable, warm tones

### 5. Colors
Based on style, suggest:

**Minimal:**
- Primary: `#18181b`, Accent: `#3f3f46` (zinc)

**Bold:**
- Primary: `#dc2626`, Accent: `#ea580c` (red/orange)
- Primary: `#7c3aed`, Accent: `#a855f7` (violet)

**Tech:**
- Primary: `#0ea5e9`, Accent: `#06b6d4` (sky/cyan)
- Primary: `#10b981`, Accent: `#22c55e` (emerald)

**Friendly:**
- Primary: `#f59e0b`, Accent: `#fbbf24` (amber)
- Primary: `#ec4899`, Accent: `#f472b6` (pink)

Ask: "I suggest [colors]. Want these or provide your own?"

### 6. Pricing Tiers
"What pricing tiers do you want? For example:"
- Free: 100 requests/month, $0
- Pro: Unlimited, $9/month
- Enterprise: Unlimited + priority, $29/month

(Note: Tiers are created in the dream-api dashboard, not in code. Just gather the info for reference.)

### 7. Logo
"Do you have a logo? (If yes, place in src/assets/ and I'll wire it up)"

---

## After Gathering Info

Update these files:

### src/pages/Landing.tsx
```typescript
const BRANDING = {
  appName: '[name]',
  tagline: '[tagline]',
  description: '[description]',
  primaryColor: '[primary]',
  accentColor: '[accent]',
};
```

### src/pages/Dashboard.tsx
```typescript
const BRANDING = {
  appName: '[name]',
  description: '[description]',
  primaryColor: '[primary]',
};
```

### If they have a logo
Update Landing.tsx nav:
```tsx
<Link to="/" className="flex items-center gap-2">
  <img src="/assets/logo.png" alt="Logo" className="h-8" />
  <span>{appName}</span>
</Link>
```

---

## Final Steps

Tell them:

1. "Your app is configured!"
   - App: [name]
   - Style: [style]
   - Colors: [primary] / [accent]

2. "To run locally:"
   ```bash
   npm install
   npm run dev
   ```

3. "Set your publishable key in .env.local:"
   ```
   VITE_DREAM_PUBLISHABLE_KEY=pk_test_xxx
   ```

4. "Create your tiers in the dream-api dashboard. They'll appear on your pricing page automatically."

5. "The Dashboard has a demo 'Track Usage' button. Replace it with your actual product."

6. "To deploy: `npm run build` and upload `dist/` to any static host."

---

## Common Follow-ups

If they ask about:

**Adding pages:** Create in `src/pages/`, add route in `App.tsx`

**Custom features:** The Dashboard has a placeholder area - replace with their product UI

**Usage tracking:** Already wired - just call `api.usage.track()` when they use a feature

**Billing portal:** Already wired - "Billing" button appears for paid users
