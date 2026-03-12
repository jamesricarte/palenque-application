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

const HomeScreen = () => {
  const { search, setSearch, categories, nearbyMarkets, popularItems } =
    useHome();

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
            <Pressable onPress={() => {}}>
              <Text className="text-2xl font-semibold">
                Palenque
                <Text className="text-primary-500">Mart</Text>
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(app)/cart")}
              className="items-center justify-center w-10 h-10"
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
                      <Image
                        source={m.image}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
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
                      <Image
                        source={item.image}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
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
                        <View className="w-5 h-5 overflow-hidden rounded-full bg-white-600">
                          <Image
                            source={item.vendorAvatar}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        </View>
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
    </View>
  );
};

export default HomeScreen;
