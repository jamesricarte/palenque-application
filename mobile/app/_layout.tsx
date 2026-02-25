import "../global.css";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider } from "@/src/providers/AuthProvider";

import { prettyLog } from "@/src/utils/pretyyLog";

global.prettyLog = prettyLog;

const RootLayout = () => {
  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <StatusBar />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
