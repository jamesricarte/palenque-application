import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";

const AppLayout = () => {
  const { session, fetchUserData } = useAuth();

  useEffect(() => {
    if (session) fetchUserData(session);
  }, [session]);

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AppLayout;
