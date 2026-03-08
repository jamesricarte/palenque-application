import React from "react";
import { Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

const VendorTabsLayout = () => {
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
        name="products/index"
        options={{
          title: "My Products",
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? "basket" : "basket-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="store/index"
        options={{
          title: "My Store",
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? "storefront" : "storefront-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default VendorTabsLayout;
