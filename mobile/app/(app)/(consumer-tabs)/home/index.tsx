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
              onPress={() => {}}
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
                {categories.map((cat, idx) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => {}}
                    className="items-center"
                  >
                    <View className="items-center justify-center w-16 h-16 border rounded-full border-primary-500">
                      {/* Placeholder: replace with real image later */}
                      <View
                        className="w-[54px] h-[54px] rounded-full overflow-hidden"
                        style={{
                          backgroundColor:
                            idx % 5 === 0
                              ? "#FDE68A"
                              : idx % 5 === 1
                                ? "#BFDBFE"
                                : idx % 5 === 2
                                  ? "#FBCFE8"
                                  : idx % 5 === 3
                                    ? "#BBF7D0"
                                    : "#FED7AA",
                        }}
                      >
                        {/* Example image-ready slot */}
                        {/* <Image source={...} className="w-full h-full" resizeMode="cover" /> */}
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
                {nearbyMarkets.map((m, idx) => (
                  <Pressable
                    key={m.id}
                    onPress={() => {}}
                    className="bg-white border rounded-xl border-white-600"
                    style={{ width: 240 }}
                  >
                    {/* Image */}
                    <View className="overflow-hidden rounded-t-xl h-28">
                      <View
                        className="w-full h-full"
                        style={{
                          backgroundColor:
                            idx % 3 === 0
                              ? "#CBD5E1"
                              : idx % 3 === 1
                                ? "#E2E8F0"
                                : "#D1D5DB",
                        }}
                      >
                        {/* Ready to replace with real image later */}
                        {/* <Image source={...} className="w-full h-full" resizeMode="cover" /> */}
                      </View>
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
                {popularItems.map((item, idx) => (
                  <Pressable
                    key={item.id}
                    onPress={() => {}}
                    className="bg-white border rounded-xl border-white-600"
                    style={{ width: 190 }}
                  >
                    {/* Image */}
                    <View className="overflow-hidden rounded-t-xl h-28">
                      <View
                        className="w-full h-full"
                        style={{
                          backgroundColor:
                            idx % 3 === 0
                              ? "#E5E7EB"
                              : idx % 3 === 1
                                ? "#D1FAE5"
                                : "#FEF3C7",
                        }}
                      >
                        {/* Ready to replace with real image later */}
                        {/* <Image source={...} className="w-full h-full" resizeMode="cover" /> */}
                      </View>
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
                          {/* Ready for vendor avatar */}
                          {/* <Image source={...} className="w-full h-full" /> */}
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
