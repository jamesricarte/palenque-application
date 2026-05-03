import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { usePublicMarketDetails } from "@/src/features/app/public-markets/usePublicMarketDetails";

const PublicMarketDetailsScreen = () => {
  const {
    bannerImage,
    bannerTitle,
    handleBack,
    handleOpenProduct,
    handleOpenSearch,
    isMarketMissing,
    loading,
    marketStatus,
    topProducts,
    topVendors,
  } = usePublicMarketDetails();

  if (loading) {
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

      <View className="flex-row items-center px-5 pt-2 pb-5 border-b border-white-600">
        <Pressable onPress={handleBack} className="mr-3" hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>

        {/* <Text className="flex-1 text-[22px] font-semibold text-black-500">
          {bannerTitle}
        </Text> */}

        <View className="flex-1">
          <Pressable onPress={handleOpenSearch} className="relative">
            <Ionicons
              className="absolute z-10 transform -translate-y-1/2 left-4 top-1/2"
              name="search"
              size={28}
              color="#b5b5b5"
            />

            <View className="py-3 pr-4 rounded-full pl-14 bg-white-600">
              <Text className="text-base text-white-700">Search a product</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="overflow-hidden rounded-[24px] bg-[#fff4ef]">
          <View className="h-48">
            {bannerImage ? (
              <Image
                source={{ uri: bannerImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center justify-center w-full h-full bg-[#fde8e1]">
                <Ionicons name="storefront-outline" size={48} color="#f16b44" />
              </View>
            )}
          </View>

          <View className="px-5 py-5">
            <View className="flex-row items-center justify-between">
              <View className="self-start px-3 py-1 rounded-full bg-primary-500">
                <Text className="text-xs font-semibold tracking-[1px] text-white">
                  PUBLIC MARKET
                </Text>
              </View>

              {marketStatus ? (
                <View
                  className={`self-start rounded-full px-3 py-1 ${
                    marketStatus === "open"
                      ? "bg-green-100"
                      : "bg-brandBlack-50"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold uppercase ${
                      marketStatus === "open"
                        ? "text-green-700"
                        : "text-white-700"
                    }`}
                  >
                    {marketStatus}
                  </Text>
                </View>
              ) : null}
            </View>

            <Text className="mt-4 text-[24px] font-semibold text-black-500">
              {bannerTitle}
            </Text>

            <Text className="mt-2 text-base leading-6 text-white-700">
              Browse the standout products and trusted vendors inside this
              market, with a layout that feels like entering a specific public
              market section.
            </Text>
          </View>
        </View>

        {isMarketMissing ? (
          <View className="items-center px-6 py-12 mt-6 border rounded-2xl border-white-600">
            <View className="items-center justify-center w-16 h-16 rounded-full bg-brandBlack-50">
              <Ionicons name="alert-circle-outline" size={30} color="#6b7280" />
            </View>

            <Text className="mt-4 text-xl font-semibold text-black-500">
              Market not found
            </Text>

            <Text className="mt-2 text-base leading-6 text-center text-white-700">
              We couldn&apos;t load this public market right now.
            </Text>
          </View>
        ) : (
          <>
            <View className="mt-7">
              <Text className="text-xl font-semibold text-black-500">
                Top Products
              </Text>

              {topProducts.length === 0 ? (
                <View className="items-center px-6 py-10 mt-3 border rounded-2xl border-white-600">
                  <Ionicons name="basket-outline" size={30} color="#9ca3af" />
                  <Text className="mt-3 text-base text-center text-white-700">
                    No products are featured in this market yet.
                  </Text>
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="pt-4 pr-6"
                >
                  <View className="flex-row gap-4">
                    {topProducts.map((product) => (
                      <Pressable
                        key={product.id}
                        onPress={() => handleOpenProduct(product.id)}
                        className="bg-white border rounded-lg border-white-600"
                        style={{ width: 190 }}
                      >
                        <View className="overflow-hidden rounded-t-lg h-28">
                          {product.image ? (
                            <Image
                              source={{ uri: product.image }}
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

                        <View className="px-4 py-3">
                          <Text
                            className="text-base font-semibold text-black-500"
                            numberOfLines={1}
                          >
                            {product.name}
                          </Text>

                          <View className="flex-row items-center gap-2 mt-2">
                            {product.vendorAvatar ? (
                              <Image
                                source={{ uri: product.vendorAvatar }}
                                className="w-5 h-5 rounded-full"
                                resizeMode="cover"
                              />
                            ) : (
                              <View className="items-center justify-center w-5 h-5 rounded-full bg-brandBlack-50">
                                <Text className="text-[10px] font-semibold text-black-500">
                                  {product.vendorInitials}
                                </Text>
                              </View>
                            )}

                            <Text
                              className="flex-1 text-sm text-white-700"
                              numberOfLines={1}
                            >
                              {product.vendorName}
                            </Text>
                          </View>

                          <View className="mt-2">
                            <View className="self-start px-2 py-1 bg-green-700 rounded">
                              <Text className="text-xs text-white">
                                {product.tag}
                              </Text>
                            </View>
                          </View>

                          <Text className="mt-2 text-base font-semibold text-primary-500">
                            {product.price}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>

            <View className="mt-7">
              <Text className="text-xl font-semibold text-black-500">
                Vendors in This Market
              </Text>

              {topVendors.length === 0 ? (
                <View className="items-center px-6 py-10 mt-3 border rounded-2xl border-white-600">
                  <Ionicons
                    name="storefront-outline"
                    size={30}
                    color="#9ca3af"
                  />
                  <Text className="mt-3 text-base text-center text-white-700">
                    No vendors are featured in this market yet.
                  </Text>
                </View>
              ) : (
                <View className="gap-3 mt-4">
                  {topVendors.map((vendor) => (
                    <View
                      key={vendor.id}
                      className="flex-row items-center px-4 py-4 bg-white border rounded-2xl border-white-600"
                    >
                      {vendor.avatar ? (
                        <Image
                          source={{ uri: vendor.avatar }}
                          className="w-12 h-12 rounded-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="items-center justify-center w-12 h-12 rounded-full bg-brandBlack-50">
                          <Text className="text-sm font-semibold text-black-500">
                            {vendor.initials}
                          </Text>
                        </View>
                      )}

                      <View className="flex-1 ml-3">
                        <Text className="text-lg font-semibold text-black-500">
                          {vendor.name}
                        </Text>

                        <Text
                          className="mt-1 text-sm leading-5 text-white-700"
                          numberOfLines={2}
                        >
                          {vendor.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PublicMarketDetailsScreen;
