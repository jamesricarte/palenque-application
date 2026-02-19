import { View, ActivityIndicator } from "react-native";
import React from "react";

import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading)
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="black" />
      </View>
    );

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return <Redirect href="/(app)/(consumer-tabs)/home" />;
};

export default Index;
