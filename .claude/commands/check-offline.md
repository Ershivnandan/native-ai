Perform a comprehensive offline compliance audit of this codebase.

This is a fully offline-first app. NO external API calls, NO network requests, NO cloud dependencies are allowed.

## Search for and report ALL violations:

### 1. Network Calls
- `fetch()`, `axios`, `XMLHttpRequest`, `WebSocket`, any HTTP client usage
- `useFetch`, `useQuery`, `useSWR`, or similar data fetching hooks
- Any `new URL()` with external domains

### 2. External URLs
- Hardcoded URLs (`http://`, `https://`, `ws://`) that are not documentation links in comments
- CDN references for fonts, icons, or assets
- External image URLs

### 3. Cloud SDKs
- Firebase, AWS, Supabase, Appwrite imports
- Google Cloud, Azure, or any BaaS
- Authentication services (Auth0, Clerk, etc.)

### 4. API Keys & Secrets
- Environment variables suggesting external services (`OPENAI_KEY`, `API_KEY`, etc.)
- `.env` files with service credentials
- Hardcoded tokens or secrets

### 5. Analytics & Monitoring
- Mixpanel, Amplitude, Segment, PostHog
- Sentry, Bugsnag, Crashlytics (reporting requires network)
- Any telemetry or event tracking

### 6. Remote Config
- Remote configuration fetching
- Feature flag services (LaunchDarkly, etc.)
- OTA update services (CodePush)

### 7. Push Notifications
- Firebase Cloud Messaging, OneSignal, Expo Push
- Any server-dependent notification system

### 8. Package.json Audit
- Review ALL dependencies for packages that inherently require network access
- Flag any package whose core functionality depends on external servers

## Report Format

For each violation found:
```
[CRITICAL/WARNING] file/path.ts:lineNumber
  Code: `the offending line`
  Issue: What this does and why it breaks offline
  Fix: How to remove or replace it
```

- **CRITICAL**: Would break the app in airplane mode
- **WARNING**: Optional feature that uses network but isn't essential

## Acceptable Exceptions
- One-time model file download (initial setup only, not required for operation)
- Documentation URLs in comments
- Package registry URLs in lock files

If no violations found, confirm: "✓ App is fully offline-compliant. No external network dependencies detected."
