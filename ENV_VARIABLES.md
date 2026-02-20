# Environment Variables Reference

This document lists all environment variables required for the BowlingAlleys.io project.

## Root Directory

No root-level environment variables are required. All environment variables are package-specific.

## API Server (`packages/api/` or `server/`)

Create `server/.env` or `packages/api/.env`:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000

# Firebase Admin SDK Configuration
# Option 1: Use service account file path
GOOGLE_APPLICATION_CREDENTIALS=server/config/firebase-service-account.json
# OR
GOOGLE_APPLICATION_CREDENTIALS=packages/api/config/firebase-service-account.json

# Option 2: Use service account JSON as string (single line)
# FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

# Firebase Project ID (required)
FIREBASE_PROJECT_ID=bowling-alleys-io
# OR
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bowling-alleys-io

# Optional: Firebase Client Config (for sitemap generation)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Email (use production Resend vs dev)
USE_PRODUCTION_EMAIL=false
```

### Firebase Admin SDK Setup

**Method 1: Service Account File (Recommended)**
1. Download service account JSON from Firebase Console
2. Save to `server/config/firebase-service-account.json` (or `packages/api/config/`)
3. Set `GOOGLE_APPLICATION_CREDENTIALS` to the file path
4. Ensure file is in `.gitignore`

**Method 2: Environment Variable**
1. Convert service account JSON to single-line string
2. Set `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable
3. Note: This is less secure and harder to manage

## Frontend (`packages/frontend/` or `frontend/`)

Create `frontend/.env.local` or `packages/frontend/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Firebase Client SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bowling-alleys-io
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bowling-alleys-io.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bowling-alleys-io.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site URL (for SEO metadata)
NEXT_PUBLIC_SITE_URL=https://bowlingalleys.io
```

## Production Environment Variables

### API Server (Production)

```env
PORT=5000
FRONTEND_URL=https://bowlingalleys.io
GOOGLE_APPLICATION_CREDENTIALS=/path/to/firebase-service-account.json
FIREBASE_PROJECT_ID=bowling-alleys-io
NODE_ENV=production
```

### Frontend (Production)

```env
NEXT_PUBLIC_API_URL=https://api.bowlingalleys.io
# Or if API is on same domain:
# NEXT_PUBLIC_API_URL=https://bowlingalleys.io/api

NEXT_PUBLIC_FIREBASE_API_KEY=your-production-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bowling-alleys-io
NEXT_PUBLIC_FIREBASE_APP_ID=your-production-app-id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bowling-alleys-io.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bowling-alleys-io.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-production-sender-id
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://bowlingalleys.io
```

## Environment Variable Descriptions

### API Server Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Port number for the API server (default: 5000) |
| `FRONTEND_URL` | Yes | URL of the frontend application (for CORS) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Yes* | Path to Firebase service account JSON file |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Yes* | Firebase service account JSON as string (alternative to file) |
| `FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `USE_PRODUCTION_EMAIL` | No | Use production Resend for emails (`true` or `false`) |
| `NODE_ENV` | No | Node environment (`development` or `production`) |

*Either `GOOGLE_APPLICATION_CREDENTIALS` or `FIREBASE_SERVICE_ACCOUNT_KEY` is required.

### Frontend Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the API server |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase API key for client SDK |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics measurement ID |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL for SEO metadata (defaults to `https://bowlingalleys.io`) |

## Security Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Service account files** - Must be in `.gitignore` and never committed
3. **Production secrets** - Use secure secret management (e.g., Vercel env vars, AWS Secrets Manager)
4. **NEXT_PUBLIC_ prefix** - Variables with this prefix are exposed to the browser. Only use for non-sensitive values.

## Getting Firebase Credentials

### Firebase Client SDK Config
1. Go to Firebase Console → Project Settings
2. Scroll to "Your apps" section
3. Select your web app (or create one)
4. Copy the config values

### Firebase Service Account
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Save to `server/config/firebase-service-account.json` (or `packages/api/config/`)
5. Add to `.gitignore`

## Troubleshooting

### "Could not load the default credentials"
- Ensure `GOOGLE_APPLICATION_CREDENTIALS` points to a valid file path
- Or ensure `FIREBASE_SERVICE_ACCOUNT_KEY` is a valid JSON string
- Check file permissions on the service account file

### "Unable to detect a Project Id"
- Set `FIREBASE_PROJECT_ID` in your `.env` file
- Ensure the service account JSON contains the correct `project_id`

### CORS errors
- Ensure `FRONTEND_URL` in API server matches your frontend URL
- Check that the API server is running and accessible

### API connection errors
- Verify `NEXT_PUBLIC_API_URL` matches the API server URL
- Check that the API server is running
- Verify CORS is configured correctly

