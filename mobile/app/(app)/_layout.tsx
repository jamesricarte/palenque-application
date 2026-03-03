import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";

const AppLayout = () => {
  const { session } = useAuth();

  // Redirect to login if not logged in
  if (!session) return <Redirect href="/(auth)/login" />;

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AppLayout;
