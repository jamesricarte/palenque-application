# Implemented Features

- Upgraded the managed React Native app in `mobile/` to Expo SDK 58, including the compatible React Native 0.88, React 19.3, Expo Router, and Expo native module versions.
- Adapted tab icon colors and OTP input refs/events to React Native 0.88's strict TypeScript API, and recorded the Node 22 runtime required by Expo SDK 58.
- Kept Supabase authentication in SecureStore on native devices while using Supabase's browser or server storage defaults for web rendering.
- Kept the native address picker map on iOS and Android, added coordinate entry for web, and removed an unnamed root stack screen that SDK 58 treated as an invalid route.
- Migrated the splash screen configuration to the `expo-splash-screen` config plugin required by the SDK 57 app configuration schema.
- Started the local Supabase stack required by the mobile development environment and aligned OTP requests with the mobile publishable key.
- Added `npm run storage:restore` to upload and verify the 20 real files committed under `supabase/storage-assets/` into local Supabase Storage. The repository uses the exact bucket and object paths from the seeded database, including `users/profile-images/`. The command supports `--dry-run` and accepts only a loopback Supabase URL.
