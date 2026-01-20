# Cloudflare Pages Deployment Instructions

## IMPORTANT STEPS TO COMPLETE IN CLOUDFLARE DASHBOARD:

### Step 1: Set Node.js Version
1. Go to your Cloudflare Pages project settings
2. Navigate to **Settings → Environment → Add Variable**
3. Add this environment variable:
   - **Name:** NODE_VERSION
   - **Value:** 24

### Step 2: Add Supabase Secrets
1. In your Cloudflare Pages project, go to **Settings → Environment → Secrets**
2. Add these three secrets with type "Secret":

| Name | Value |
|------|-------|
| NEXT_PUBLIC_SUPABASE_URL | https://bdbpkmvxnbyaykfxbnft.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | oEz8e5NLLLOGA6TNKVs2YD0JXnF98Zu7DrztmO7ndXprNiHtc6by1N6TKV04C7i2qJkVn16yWy+6Frl3InfmOg== |
| SUPABASE_SERVICE_ROLE_KEY | sb_secret_LYAxjT6rXJzj5ek-BCbgxg_-XIRHzTn |

### Step 3: Deploy with Wrangler (LOCAL TERMINAL)
After confirming settings above, run these commands from your project folder:

```bash
# Login to Cloudflare (opens browser)
wrangler login

# Deploy the .next build directory as a Worker
npx wrangler pages publish .next --project-name=manga-admin
```

### Step 4: Access Your Site
After successful deployment, your site will be available at:
```
https://manga-admin.ragnacrismon562.workers.dev
```

## Current Status
✅ Node.js v24 ready
✅ package.json has correct scripts
✅ pages/_app.js imports global CSS
✅ All pages exist
✅ styles/globals.css configured
✅ .env.local configured (local development)
✅ Next.js build successful (.next directory created)
