import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useProfile } from "@/src/features/app/consumer-tabs/profile/useProfile";

import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const {
    userName,
    onPressCart,
    onPressViewProfile,
    onPressMyAddress,
    onPressBecomeVendor,
    onPressLogout,
  } = useProfile();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-14 pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-6">
          {/* Top Bar */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-semibold">My Account</Text>

            <Pressable
              onPress={onPressCart}
              className="items-center justify-center w-10 h-10"
              hitSlop={10}
            >
              <Ionicons name="bag-outline" size={26} color="#1f2933" />
            </Pressable>
          </View>

          {/* Profile Card */}
          <Pressable
            onPress={onPressViewProfile}
            className="mt-6 bg-white border rounded-md border-white-600"
          >
            <View className="flex-row items-center justify-between py-4 pl-4 pr-2">
              <View>
                <Text className="text-lg font-semibold">{userName}</Text>
                <Text className="mt-1 text-base text-white-700">
                  View profile
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={24} color="#b5b5b5" />
            </View>
          </Pressable>

          {/* Quick Actions */}
          <View className="mt-4 overflow-hidden bg-white border rounded-md border-white-600">
            <View className="px-4 py-3 border-b border-white-600">
              <Text className="text-base font-semibold">Quick Actions</Text>
            </View>

            {/* My Address */}
            <Pressable onPress={onPressMyAddress} className="py-4 pl-4 pr-2">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="items-center justify-center w-10 h-10 rounded-full bg-[#fef0ec]">
                    <Ionicons
                      name="location-outline"
                      size={24}
                      color="#f16b44"
                    />
                  </View>

                  <View>
                    <Text className="text-base font-semibold">My Address</Text>
                    <Text className="mt-1 text-base text-white-700">
                      Show saved address
                    </Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={24} color="#b5b5b5" />
              </View>
            </Pressable>

            <View className="h-[1px] bg-white-600" />

            {/* Become a Vendor */}
            <Pressable onPress={onPressBecomeVendor} className="py-4 pl-4 pr-2">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="items-center justify-center w-10 h-10 rounded-full bg-[#fef0ec]">
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={24}
                      color="#f16b44"
                    />
                  </View>

                  <View>
                    <Text className="text-base font-semibold">
                      Became a Vendor
                    </Text>
                    <Text className="mt-1 text-base text-white-700">
                      Apply as partnered vendor
                    </Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={24} color="#b5b5b5" />
              </View>
            </Pressable>
          </View>

          {/* Logout Button */}
          <Pressable
            onPress={onPressLogout}
            className="items-center justify-center py-4 mt-6 border rounded-md border-primary-500"
          >
            <Text className="text-base font-semibold text-primary-500">
              Logout
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
