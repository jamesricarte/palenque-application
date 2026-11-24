import "react-native-url-polyfill";
import { createClient } from "@supabase/supabase-js";
import * as SecureStorage from "expo-secure-store";
import { Platform } from "react-native";

export const ExpoSecureStorageAdapter = {
  getItem: (key: string) => SecureStorage.getItemAsync(key),
  setItem: (key: string, value: string) =>
    SecureStorage.setItemAsync(key, value),
  removeItem: (key: string) => SecureStorage.deleteItemAsync(key),
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    auth: {
      storage: Platform.OS === "web" ? undefined : ExpoSecureStorageAdapter,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  },
);
