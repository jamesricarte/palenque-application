import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useHome } from "@/src/features/app/consumer-tabs/home/useHome";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCartCount } from "@/src/hooks/useCartCount";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const {
    search,
    setSearch,
    categories,
    nearbyMarkets,
    popularItems,
    loading,
  } = useHome();

  const { cartCount } = useCartCount();

  if (loading)
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />

        <ScrollView
          className="flex-1"
          contentContainerClassName="pt-3 pb-28"
          showsVerticalScrollIndicator={false}
        >
          <View className="mx-6">
            {/* Top Bar */}
            <View className="flex-row items-center justify-between">
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
            <View className="mt-4">
              <View className="relative">
                <Ionicons
                  className="absolute z-10 transform -translate-y-1/2 left-4 top-1/2"
                  name="search"
                  size={28}
                  color="#b5b5b5"
                />

                <TextInput
                  placeholder="Search a product"
                  placeholderTextColor="#b5b5b5"
                  value={search}
                  onChangeText={(v) => setSearch(v)}
                  className="py-3 pr-4 text-base rounded-full pl-14 bg-white-600"
                  editable={false}
                />
              </View>
            </View>

            {/* Categories */}
            <View className="mt-5">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="pr-2"
              >
                <View className="flex-row gap-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <View key={index} className="items-center">
                      <View className="items-center justify-center w-16 h-16 border rounded-full border-primary-500">
                        <View className="w-[54px] h-[54px] rounded-full bg-white-600" />
                      </View>

                      <View className="w-12 h-4 mt-2 rounded-full bg-white-600" />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Nearby Public Markets */}
            <View className="mt-6">
              <View className="w-48 rounded-full h-7 bg-white-600" />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="pt-4 pr-6"
              >
                <View className="flex-row gap-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <View
                      key={index}
                      className="bg-white border rounded-lg border-white-600"
                      style={{ width: 240 }}
                    >
                      {/* Image */}
                      <View className="rounded-t-lg h-28 bg-white-600" />

                      {/* Info */}
                      <View className="px-4 py-3">
                        <View className="w-32 h-5 rounded-full bg-white-600" />

                        <View className="w-40 h-4 mt-2 rounded-full bg-white-600" />

                        <View className="w-20 h-4 mt-3 bg-green-100 rounded-full" />
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Popular Items Near You */}
            <View className="mt-6">
              <View className="rounded-full w-44 h-7 bg-white-600" />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="pt-4 pr-6"
              >
                <View className="flex-row gap-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <View
                      key={index}
                      className="bg-white border rounded-lg border-white-600"
                      style={{ width: 190 }}
                    >
                      {/* Image */}
                      <View className="rounded-t-lg h-28 bg-white-600" />

                      {/* Details */}
                      <View className="px-4 py-3">
                        <View className="h-5 rounded-full w-28 bg-white-600" />

                        <View className="flex-row items-center gap-2 mt-2">
                          <View className="w-5 h-5 rounded-full bg-white-600" />
                          <View className="w-20 h-4 rounded-full bg-white-600" />
                        </View>

                        <View className="mt-2">
                          <View className="self-start px-2 py-1 rounded bg-white-600">
                            <View className="w-10 h-3 rounded-full bg-white-700" />
                          </View>
                        </View>

                        <View className="w-16 h-5 mt-2 rounded-full bg-primary-100" />
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-3 pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-6">
          {/* Top Bar */}
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => {}}>
              <Text className="text-2xl font-semibold">
                Palenque
                <Text className="text-primary-500">Mart</Text>
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(app)/cart")}
              className="relative items-center justify-center w-10 h-10"
              hitSlop={10}
            >
              <Ionicons name="bag-outline" size={26} color="#1f2933" />

              {cartCount > 0 && (
                <View className="absolute items-center justify-center min-w-[20px] h-5 px-1 rounded-full -top-1 -right-1 bg-primary-500">
                  <Text className="text-[11px] font-semibold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Search */}
          <View className="mt-4">
            <View className="relative">
              <Ionicons
                className="absolute z-10 transform -translate-y-1/2 left-4 top-1/2"
                name="search"
                size={28}
                color="#b5b5b5"
              />

              <TextInput
                placeholder="Search a product"
                placeholderTextColor="#b5b5b5"
                value={search}
                onChangeText={(v) => setSearch(v)}
                className="py-3 pr-4 text-base rounded-full pl-14 bg-white-600"
              />
            </View>
          </View>

          {/* Categories */}
          <View className="mt-5">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="pr-2"
            >
              <View className="flex-row gap-6">
                {categories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => {}}
                    className="items-center"
                  >
                    <View className="items-center justify-center w-16 h-16 border rounded-full border-primary-500">
                      <View className="w-[54px] h-[54px] rounded-full overflow-hidden">
                        <Image
                          source={cat.image}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
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
            <Text className="text-xl font-semibold">Nearby Public Markets</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="pt-4 pr-6"
            >
              <View className="flex-row gap-4">
                {nearbyMarkets.map((m) => (
                  <Pressable
                    key={m.id}
                    onPress={() => {}}
                    className="bg-white border rounded-lg border-white-600"
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
            <Text className="text-xl font-semibold">
              Popular Items Near You
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="pt-4 pr-6"
            >
              <View className="flex-row gap-4">
                {popularItems.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => router.push(`/products/${item.id}`)}
                    className="bg-white border rounded-lg border-white-600"
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
                            <Text className="text-[10px] font-semibold text-black-500">
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
                          <Text className="text-xs text-white">{item.tag}</Text>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
