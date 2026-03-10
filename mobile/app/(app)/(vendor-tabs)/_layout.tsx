import React, { useEffect, useState } from "react";
import { Redirect, router, Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";

const VendorTabsLayout = () => {
  const { session, vendorData, setVendorData } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      const userId = session?.user.id;

      try {
        if (!userId) throw new Error("User id is required.");

        const { data, error } = await supabase
          .from("vendors")
          .select("id, description, vendor_status")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) throw new Error(error.message);

        if (!data) throw new Error("User doesnt have vendor data");

        setVendorData(data);
      } catch (error) {
        console.error(error);
        setVendorData(null);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  if (loading)
    return (
      <SafeAreaView className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="black" />
      </SafeAreaView>
    );

  if (!vendorData) return null;

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
