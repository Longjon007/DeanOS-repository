# DeanOS Deployment Guide

## Overview

This guide covers the build and deployment processes for the DeanOS (Hyperion AI) system components.

## System Components

### 1. Web Application (Next.js)
- **Location:** `/web`
- **Technology:** Next.js 14, React 18, TypeScript
- **Dependencies:** Supabase, Prisma, TailwindCSS

### 2. Mobile Application (Expo/React Native)
- **Location:** `/app`
- **Technology:** Expo 50, React Native 0.73
- **Dependencies:** Supabase, AsyncStorage

## Automated Workflows

### Code Review Workflow
**File:** `.github/workflows/code-review.yml`

Automatically reviews pull requests for:
- Console.log statements
- TODO comments
- Debugger statements
- Hardcoded credentials

**Triggers:**
- Pull requests to main/master branches
- On PR open, synchronize, or reopen

### Build Web Application
**File:** `.github/workflows/build-web.yml`

Builds the Next.js web application.

**Triggers:**
- Push to main/master (when web/ files change)
- Pull requests to main/master (when web/ files change)
- Manual dispatch

**Process:**
1. Setup Node.js 20
2. Install dependencies
3. Run linter
4. Build production bundle
5. Upload build artifacts

**Artifacts:** Build artifacts retained for 7 days

### Build Mobile Application
**File:** `.github/workflows/build-mobile.yml`

Validates the Expo/React Native mobile application.

**Triggers:**
- Push to main/master (when app/ files change)
- Pull requests to main/master (when app/ files change)
- Manual dispatch

**Process:**
1. Setup Node.js 20
2. Install dependencies
3. Validate Expo configuration
4. Check dependencies

**Note:** Full iOS/Android builds require [Expo Application Services (EAS)](https://expo.dev/eas).

### Deploy Web Application
**File:** `.github/workflows/deploy-web.yml`

Prepares and deploys the web application.

**Triggers:**
- Manual dispatch (with environment selection)
- Push to main branch (when web/ files change)

**Environments:**
- Production
- Staging

## Local Development

### Web Application

```bash
cd web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Mobile Application

```bash
cd app

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run in web browser
npx expo start --web
```

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd web
vercel --prod
```

3. For automated deployments:
   - Add secrets to GitHub repository:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`
   - Uncomment Vercel section in `.github/workflows/deploy-web.yml`

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
cd web
npm run build
netlify deploy --prod --dir=.next
```

3. For automated deployments:
   - Add secrets to GitHub repository:
     - `NETLIFY_AUTH_TOKEN`
     - `NETLIFY_SITE_ID`
   - Uncomment Netlify section in `.github/workflows/deploy-web.yml`

### Option 3: Custom Server (VPS/Cloud)

1. Setup server with Node.js 20+
2. Clone repository
3. Install dependencies and build:
```bash
cd web
npm install
npm run build
```

4. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start npm --name "hyperion-web" -- start
pm2 save
pm2 startup
```

5. For automated deployments:
   - Add SSH secrets to GitHub repository:
     - `HOST`
     - `USERNAME`
     - `SSH_KEY`
   - Uncomment custom deployment section in `.github/workflows/deploy-web.yml`

### Option 4: Docker

Create a `Dockerfile` in the web directory:

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t hyperion-web .
docker run -p 3000:3000 hyperion-web
```

## Mobile Application Deployment

### Expo Application Services (EAS)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure EAS:
```bash
cd app
eas build:configure
```

4. Build for iOS:
```bash
eas build --platform ios
```

5. Build for Android:
```bash
eas build --platform android
```

6. Submit to stores:
```bash
eas submit --platform ios
eas submit --platform android
```

### Traditional React Native Builds

For builds without Expo:
- See [React Native Documentation](https://reactnative.dev/docs/signed-apk-android) for Android
- See [React Native Documentation](https://reactnative.dev/docs/publishing-to-app-store-ios) for iOS

## Environment Variables

### Web Application
Required environment variables (copy from `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `DATABASE_URL` - Prisma database connection string

### Mobile Application
Required environment variables (copy from `.env.example`):
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Security Considerations

1. **Never commit secrets** - Use environment variables
2. **CodeQL scanning** - Automated security scanning is enabled
3. **Code reviews** - All PRs are automatically reviewed
4. **Health checks** - System health monitored daily
5. **Dependency updates** - Keep dependencies up to date

## Monitoring

- **GitHub Actions** - Check workflow runs in Actions tab
- **Health Checks** - Automated daily at 9:00 UTC
- **CodeQL Analysis** - Weekly security scans

## Troubleshooting

### Build Failures

**Web Application:**
```bash
cd web
rm -rf node_modules .next
npm install
npm run build
```

**Mobile Application:**
```bash
cd app
rm -rf node_modules
npm install
npx expo start --clear
```

### Deployment Issues

1. Check GitHub Actions logs
2. Verify environment variables are set
3. Ensure secrets are configured correctly
4. Check deployment platform status

### Common Errors

**Error: Cannot find module**
- Solution: Delete `node_modules` and reinstall

**Error: Port already in use**
- Solution: Kill process using the port or use a different port

**Error: Build failed**
- Solution: Check logs for specific error messages

## Support

For issues or questions:
1. Check GitHub Issues
2. Review workflow logs in Actions tab
3. Consult platform-specific documentation

## Next Steps

1. ✅ Configure deployment target
2. ✅ Add required secrets to GitHub repository
3. ✅ Test deployment workflow
4. ✅ Setup monitoring and alerts
5. ✅ Document any custom configurations
