import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";

const salesPeriods = ["Today", "This Week", "This Month"] as const;

const HomeScreen = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] =
    useState<(typeof salesPeriods)[number]>("Today");

  const firstName = useMemo(() => {
    return user?.first_name?.trim() || "Vendor";
  }, [user?.first_name]);

  const handleSelectSalesPeriod = () => {
    setSelectedPeriod((currentPeriod) => {
      const currentIndex = salesPeriods.indexOf(currentPeriod);
      const nextIndex = (currentIndex + 1) % salesPeriods.length;

      return salesPeriods[nextIndex];
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-3 pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-5">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => {}}>
              <Text className="text-[22px] font-semibold text-brandBlack-500">
                Palenque
                <Text className="text-primary-500">Mart</Text>
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(app)/orders/vendor-orders")}
              className="items-center justify-center w-10 h-10"
              hitSlop={10}
            >
              <Ionicons name="cube-outline" size={26} color="#1f2933" />
            </Pressable>
          </View>

          {/* Welcome Card */}
          <View className="flex-row items-center justify-between px-4 py-4 mt-6 bg-white border rounded-md border-white-600">
            <View className="flex-1 pr-4">
              <Text className="text-xl font-semibold text-black-500">
                Welcome Back, {firstName}!
              </Text>
              <Text className="mt-1 text-base text-white-700">
                Here&apos;s what&apos;s happening in your store today
              </Text>
            </View>

            <View className="items-center justify-center w-12 h-12 rounded-full bg-[#fef0ec]">
              <Ionicons name="storefront-outline" size={22} color="#f16b44" />
            </View>
          </View>

          {/* Active Orders */}
          <View className="mt-6">
            <Text className="text-xl font-semibold text-black-500">
              Active Orders
            </Text>

            <View className="items-center justify-center h-[104px] px-6 mt-3 bg-white border rounded-md border-white-600">
              <Text className="text-base text-center text-white-700">
                No current active orders.
              </Text>
            </View>
          </View>

          {/* Sales Activity */}
          <View className="mt-6">
            <Text className="text-xl font-semibold text-black-500">
              Sales Activity
            </Text>

            <Pressable
              onPress={handleSelectSalesPeriod}
              className="flex-row items-center justify-between px-4 py-4 mt-3 bg-white border rounded-md border-white-600"
            >
              <View className="flex-row items-center gap-3">
                <Ionicons name="calendar-outline" size={22} color="#1f2933" />
                <Text className="text-lg text-black-500">{selectedPeriod}</Text>
              </View>

              <Ionicons name="chevron-down" size={22} color="#1f2933" />
            </Pressable>

            <View className="px-4 py-4 mt-3 bg-white border rounded-md border-white-600">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg text-black-500">Total Sales</Text>
                <Text className="text-lg text-primary-500">P 0.00</Text>
              </View>

              <View className="flex-row justify-around mt-7">
                <View className="items-center">
                  <Text className="text-xl font-semibold text-black-500">
                    0
                  </Text>
                  <Text className="mt-1 text-base text-white-700">
                    Total Orders
                  </Text>
                </View>

                <View className="items-center">
                  <Text className="text-xl font-semibold text-black-500">
                    0
                  </Text>
                  <Text className="mt-1 text-base text-white-700">
                    Products Sold
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
