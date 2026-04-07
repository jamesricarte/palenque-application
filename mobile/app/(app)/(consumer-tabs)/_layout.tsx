import React from "react";
import { Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/hooks/useAuth";

const ConsumerTabsLayout = () => {
  const { session, isLoading } = useAuth();
  const isLoggedIn = !!session;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#FFFFFF",
        tabBarStyle: {
          backgroundColor: "#f16b44",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 11,
          paddingBottom: 10,
          height: 94,
          display: !isLoading && !isLoggedIn ? "none" : "flex",
        },
        tabBarLabelStyle: {
          fontSize: 13,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders/index"
        options={{
          title: "My Orders",
          href: isLoggedIn ? undefined : null,
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? "cube" : "cube-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications/index"
        options={{
          title: "Notifications",
          href: isLoggedIn ? undefined : null,
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Account",
          href: isLoggedIn ? undefined : null,
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default ConsumerTabsLayout;
