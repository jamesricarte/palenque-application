import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useHome } from "@/src/features/app/consumer-tabs/home/useHome";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCartCount } from "@/src/hooks/useCartCount";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/src/hooks/useAuth";
import HomeLoadingSkeleton from "@/src/features/app/consumer-tabs/home/components/HomeLoadingSkeleton";

const HomeScreen = () => {
  const {
    categories,
    fetchHomeData,
    handleOpenCategory,
    handleOpenCart,
    handleOpenMarket,
    handleOpenSearch,
    hasError,
    nearbyMarkets,
    popularItems,
    shouldShowCartCount,
    loading,
  } = useHome();

  const { cartCount } = useCartCount();
  const { session, isLoading: authLoading } = useAuth();
  const isLoggedIn = !!session;

  return (
    <SafeAreaView
      edges={isLoggedIn ? ["top"] : ["top", "bottom"]}
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        contentContainerClassName={`pt-3 ${!authLoading && !isLoggedIn ? "pb-40" : "pb-28"}`}
        showsVerticalScrollIndicator={false}
      >
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
              onPress={handleOpenCart}
              disabled={hasError || loading}
              className="relative items-center justify-center w-10 h-10"
              hitSlop={10}
            >
              <Ionicons name="bag-outline" size={26} color="#1f2933" />

              {shouldShowCartCount && cartCount > 0 && (
                <View className="absolute items-center justify-center min-w-[20px] h-5 px-1 rounded-full -top-1 -right-1 bg-primary-500">
                  <Text className="text-[11px] font-semibold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Search */}
          <View className="px-6 mt-4">
            <Pressable
              onPress={handleOpenSearch}
              disabled={hasError}
              className="relative"
              style={{ opacity: hasError ? 0.7 : 1 }}
            >
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

          {hasError ? (
            <View className="items-center px-6 py-10 mt-8 border rounded-lg border-white-600">
              <View className="items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                <MaterialIcons name="error-outline" size={36} color="#ef4444" />
              </View>

              <Text className="mt-5 text-2xl font-semibold text-center text-brandBlack-900">
                Something Went Wrong
              </Text>

              <Text className="mt-3 text-base leading-6 text-center text-white-700">
                Please try again later.
              </Text>

              <Pressable
                onPress={fetchHomeData}
                className="flex-row items-center justify-center px-6 py-4 mt-6 bg-red-500 rounded-full"
              >
                <Ionicons name="refresh" size={20} color="#ffffff" />
                <Text className="ml-2 text-base font-semibold text-white">
                  Retry
                </Text>
              </Pressable>
            </View>
          ) : loading ? (
            <HomeLoadingSkeleton />
          ) : (
            <>
              {/* Categories */}
              <View className="mt-5">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="pr-6"
                >
                  <View className="flex-row gap-6">
                    {categories.map((cat, index) => (
                      <Pressable
                        key={cat.label}
                        onPress={() => handleOpenCategory(cat.label)}
                        className={`items-center ${index === 0 ? "pl-6" : ""}`}
                      >
                        <View className="items-center justify-center w-16 h-16 border rounded-full border-primary-500">
                          <View className="w-[54px] h-[54px] rounded-full overflow-hidden items-center justify-center bg-white-600">
                            {cat.image ? (
                              <Image
                                source={cat.image}
                                className="w-full h-full"
                                resizeMode="cover"
                              />
                            ) : (
                              <Ionicons
                                name="ellipsis-horizontal"
                                size={24}
                                color="#1f2933"
                              />
                            )}
                          </View>
                        </View>

                        <Text className="mt-2 text-sm">{cat.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Nearby Public Markets */}
              <View className="mt-6">
                <Text className="pl-6 text-xl font-semibold">
                  Nearby Public Markets
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="pt-4 pr-6"
                >
                  <View className="flex-row gap-4">
                    {nearbyMarkets.map((m, index) => (
                      <Pressable
                        key={m.id}
                        onPress={() => handleOpenMarket(m.id)}
                        className={`bg-white border rounded-lg border-white-600 ${index === 0 ? "ml-6" : ""}`}
                        style={{ width: 240 }}
                      >
                        {/* Image */}
                        <View className="overflow-hidden rounded-t-lg h-28">
                          {m.image?.uri ? (
                            <Image
                              source={m.image}
                              className="w-full h-full"
                              resizeMode="cover"
                            />
                          ) : (
                            <View className="items-center justify-center w-full h-full bg-white-600">
                              <Ionicons
                                name="image-outline"
                                size={32}
                                color="#9ca3af"
                              />
                            </View>
                          )}
                        </View>

                        {/* Info */}
                        <View className="px-4 py-3">
                          <Text
                            className="text-base font-semibold"
                            numberOfLines={1}
                          >
                            {m.name}
                          </Text>

                          <Text className="mt-1 text-sm text-white-700">
                            {m.address}
                          </Text>

                          <Text className="mt-2 text-sm text-green-600">
                            {m.status}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Popular Items Near You */}
              <View className="mt-6">
                <Text className="pl-6 text-xl font-semibold">
                  Popular Items Near You
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="pt-4 pr-6"
                >
                  <View className="flex-row gap-4">
                    {popularItems.map((item, index) => (
                      <Pressable
                        key={item.id}
                        onPress={() => router.push(`/products/${item.id}`)}
                        className={`bg-white border rounded-lg border-white-600 ${index === 0 ? "ml-6" : ""}`}
                        style={{ width: 190 }}
                      >
                        {/* Image */}
                        <View className="overflow-hidden rounded-t-lg h-28">
                          {item.image ? (
                            <Image
                              source={item.image}
                              className="w-full h-full"
                              resizeMode="cover"
                            />
                          ) : (
                            <View className="items-center justify-center w-full h-full bg-white-600">
                              <Ionicons
                                name="image-outline"
                                size={32}
                                color="#9ca3af"
                              />
                            </View>
                          )}
                        </View>

                        {/* Details */}
                        <View className="px-4 py-3">
                          <Text
                            className="text-base font-semibold"
                            numberOfLines={1}
                          >
                            {item.name}
                          </Text>

                          <View className="flex-row items-center gap-2 mt-2">
                            {item.vendorAvatar ? (
                              <Image
                                source={item.vendorAvatar}
                                className="w-5 h-5 rounded-full"
                                resizeMode="cover"
                              />
                            ) : (
                              <View className="items-center justify-center w-5 h-5 rounded-full bg-brandBlack-50">
                                <Text className="text-[10px] font-semibold text-black">
                                  {item.vendorInitials}
                                </Text>
                              </View>
                            )}

                            <Text className="text-sm text-white-700">
                              {item.vendor}
                            </Text>
                          </View>

                          <View className="mt-2">
                            <View className="self-start px-2 py-1 bg-green-700 rounded">
                              <Text className="text-xs text-white">
                                {item.tag}
                              </Text>
                            </View>
                          </View>

                          <Text className="mt-2 text-base font-semibold text-primary-500">
                            {item.price}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </>
          )}
        </View>
      </ScrollView>

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

export default HomeScreen;
