import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { useProfileDetails } from "@/src/features/app/profile-details/useProfileDetails";

const ProfileDetailsScreen = () => {
  const {
    user,
    isLoading,
    fullName,
    initials,
    statusLabel,
    statusClassName,
    profileSections,
    isUpdatingProfileImage,
    handleBack,
    handleSelectProfileImage,
  } = useProfileDetails();

  if (isLoading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#F46B45" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-5 border-b border-white-600">
        <Pressable onPress={handleBack} className="mr-3" hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>

        <Text className="text-2xl font-semibold">My Profile</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="p-5 mb-5 overflow-hidden bg-white border rounded-md border-white-600">
          <View className="flex-row items-center">
            <View className="relative">
              {user?.profile_image_url ? (
                <Image
                  source={{ uri: user?.profile_image_url }}
                  className="w-16 h-16 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center justify-center w-16 h-16 rounded-full bg-brandBlack-50">
                  <Text className="text-2xl font-semibold text-black">
                    {initials}
                  </Text>
                </View>
              )}

              <Pressable
                onPress={handleSelectProfileImage}
                disabled={isUpdatingProfileImage}
                className="absolute items-center justify-center w-8 h-8 border-2 border-white rounded-full -right-1 -bottom-1 bg-primary-500"
                hitSlop={10}
              >
                {isUpdatingProfileImage ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Ionicons name="camera-outline" size={16} color="#ffffff" />
                )}
              </Pressable>
            </View>

            <View className="flex-1 ml-4">
              <Text className="text-2xl font-semibold text-black-500">
                {fullName}
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-4">
          {profileSections.map((section) => (
            <View
              key={section.title}
              className="overflow-hidden bg-white border rounded-md border-white-600"
            >
              <View className="px-4 py-3 border-b border-white-600">
                <Text className="text-base font-semibold">{section.title}</Text>
              </View>

              <View className="px-4 py-2">
                {section.items.map((item, index) => (
                  <View
                    key={item.label}
                    className={`${index !== section.items.length - 1 ? "border-b border-white-600" : ""} py-4`}
                  >
                    <View className="flex-row items-start gap-3">
                      <View className="items-center justify-center w-10 h-10 rounded-full bg-[#fef0ec]">
                        <Ionicons name={item.icon} size={20} color="#f16b44" />
                      </View>

                      <View className="flex-1">
                        <Text className="text-sm text-white-700">
                          {item.label}
                        </Text>
                        <Text className="mt-1 text-base font-semibold text-black-500">
                          {item.value}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDetailsScreen;
