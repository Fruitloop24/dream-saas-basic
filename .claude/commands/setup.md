# SaaS Template Setup

You are configuring a SaaS application using the dream-api SDK.

## Step 1: Gather Information

Ask the user these questions ONE AT A TIME:

1. **App Name**: "What's your app/product name?"
2. **Tagline**: "What's your main headline or value proposition?"
3. **Description**: "Give me a one-sentence description of what your app does."
4. **Brand Color**: "What's your primary brand color? (hex like #3b82f6, or say 'blue', 'green', etc.)"
5. **Publishable Key**: "What's your Dream API publishable key? (starts with pk_test_ or pk_live_)"

## Step 2: Configure

After gathering answers, update these files:

### src/pages/Landing.tsx
Update the BRANDING object at the top:
```typescript
const BRANDING = {
  appName: '[USER_APP_NAME]',
  valueProp: '[USER_TAGLINE]',
  description: '[USER_DESCRIPTION]',
  primaryColor: '[USER_COLOR]',
  logoUrl: '',
  heroImageUrl: '',
};
```

### src/pages/Dashboard.tsx
Update the BRANDING object:
```typescript
const BRANDING = {
  appName: '[USER_APP_NAME]',
  description: '[USER_DESCRIPTION]',
  primaryColor: '[USER_COLOR]',
};
```

### src/pages/ChoosePlanPage.tsx
Update the BRANDING object:
```typescript
const BRANDING = {
  primaryColor: '[USER_COLOR]',
};
```

### .env.local
Create this file with:
```
VITE_DREAM_PUBLISHABLE_KEY=[USER_PK]
```

## Step 3: Confirm

After making changes, tell the user:
1. Run `npm install` if they haven't
2. Run `npm run dev` to start
3. Visit http://localhost:5173

Ask if they want you to:
- Add a logo
- Add more pages (features, about, etc.)
- Customize the dashboard feature area
- Change card sizes or layout
