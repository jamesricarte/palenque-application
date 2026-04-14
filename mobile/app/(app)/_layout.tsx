import React from "react";
import { Stack } from "expo-router";

const AppLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="search/index"
        options={{
          presentation: "card",
          animation: "fade_from_bottom",
          animationDuration: 300,
        }}
      />
    </Stack>
  );
};

export default AppLayout;
