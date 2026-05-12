import React from "react";
import { View, Text, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

type HomeLoadingSkeletonProps = {
  authLoading: boolean;
  isLoggedIn: boolean;
  handleOpenSearch: () => void;
};

const HomeLoadingSkeleton = ({
  authLoading,
  isLoggedIn,
  handleOpenSearch,
}: HomeLoadingSkeletonProps) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 pt-3">
        <View>
          {/* Top Bar */}
          <View className="flex-row items-center justify-between px-6">
            <Pressable onPress={() => {}}>
              <Text className="text-2xl font-semibold">
                Palenque
                <Text className="text-primary-500">Mart</Text>
              </Text>
            </Pressable>

            <Pressable
              className="relative items-center justify-center w-10 h-10"
              hitSlop={10}
            >
              <Ionicons name="bag-outline" size={26} color="#1f2933" />
            </Pressable>
          </View>

          {/* Search */}
          <View className="px-6 mt-4">
            <Pressable onPress={handleOpenSearch} className="relative">
              <Ionicons
                className="absolute z-10 transform -translate-y-1/2 left-4 top-1/2"
                name="search"
                size={28}
                color="#b5b5b5"
              />

              <View className="py-3 pr-4 rounded-full pl-14 bg-white-600">
                <Text className="text-base text-white-700">
                  Search a product
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Categories */}
          <View className="pl-6 mt-5">
            <View>
              <View className="flex-row gap-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <View key={index} className="items-center">
                    <View className="items-center justify-center w-16 h-16 border rounded-full border-primary-500">
                      <Skeleton width={54} height={54} borderRadius={999} />
                    </View>

                    <View className="mt-2">
                      <Skeleton width={44} height={10} borderRadius={999} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Nearby Public Markets */}
          <View className="pl-6 mt-6">
            <Skeleton width={160} height={16} borderRadius={999} />

            <View className="pt-4 pr-6">
              <View className="flex-row gap-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <View
                    key={index}
                    className="bg-white border rounded-lg border-white-600"
                    style={{ width: 240 }}
                  >
                    {/* Image */}
                    <Skeleton width="100%" height={112} borderRadius={8} />

                    {/* Info */}
                    <View className="px-4 py-3">
                      <Skeleton width={120} height={14} borderRadius={999} />

                      <View className="mt-2">
                        <Skeleton width={160} height={10} borderRadius={999} />
                      </View>

                      <View className="mt-3">
                        <Skeleton width={72} height={10} borderRadius={999} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Popular Items Near You */}
          <View className="pl-6 mt-6">
            <Skeleton width={148} height={16} borderRadius={999} />

            <View className="pt-4 pr-6">
              <View className="flex-row gap-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <View
                    key={index}
                    className="bg-white border rounded-lg border-white-600"
                    style={{ width: 190 }}
                  >
                    {/* Image */}
                    <Skeleton width="100%" height={112} borderRadius={8} />

                    {/* Details */}
                    <View className="px-4 py-3">
                      <Skeleton width={104} height={14} borderRadius={999} />

                      <View className="flex-row items-center gap-2 mt-2">
                        <Skeleton width={20} height={20} borderRadius={999} />
                        <Skeleton width={72} height={10} borderRadius={999} />
                      </View>

                      <View className="mt-2">
                        <Skeleton width={52} height={22} borderRadius={6} />
                      </View>

                      <View className="mt-2">
                        <Skeleton width={64} height={14} borderRadius={999} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>

      {!authLoading && !isLoggedIn && (
        <View className="px-5 pt-5 pb-6 bg-primary-500">
          <View className="flex-row gap-4">
            <Pressable
              onPress={() => router.push("/(auth)/login")}
              className="items-center justify-center flex-1 py-4 bg-white border border-white rounded-lg"
            >
              <Text className="text-lg font-semibold text-primary-500">
                Login
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(auth)/register")}
              className="items-center justify-center flex-1 py-4 border border-white rounded-lg"
            >
              <Text className="text-lg font-semibold text-white">Register</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeLoadingSkeleton;
