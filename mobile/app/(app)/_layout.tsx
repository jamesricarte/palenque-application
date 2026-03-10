import React, { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";

const AppLayout = () => {
  const { session, user, fetchUserData } = useAuth();

  useEffect(() => {
    if (session && !user) fetchUserData(session);
  }, [session, user]);

  // Redirect to login if not logged in
  if (!session) return <Redirect href="/(auth)/login" />;

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AppLayout;
