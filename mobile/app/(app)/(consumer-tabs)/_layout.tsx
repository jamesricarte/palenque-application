import React from "react";
import { Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

const ConsumerTabsLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders/index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications/index"
        options={{
          title: "Notifications",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default ConsumerTabsLayout;
