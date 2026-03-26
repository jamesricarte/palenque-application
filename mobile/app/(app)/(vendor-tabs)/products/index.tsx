import React from "react";
import { View, Text, ScrollView, Pressable, Image, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { useProducts } from "@/src/features/app/vendor-tabs/products/useProducts";
import { router } from "expo-router";

const MyProductsScreen = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    toggleAvailability,
  } = useProducts();

  const renderProductCard = (product: {
    id: string;
    name: string;
    category: string;
    categoryKey: string;
    price: string;
    available: boolean;
    image: string;
  }) => {
    return (
      <View
        key={product.id}
        className="overflow-hidden bg-white border rounded-md border-white-600"
      >
        <Image
          source={{ uri: product.image }}
          className="w-full h-[100px]"
          resizeMode="cover"
        />

        <View className="px-3 py-3">
          <Text className="text-xl">{product.name}</Text>

          <View className="self-start px-1.5 py-0.5 mt-1 rounded bg-green-700">
            <Text className="text-[9px] text-white">{product.category}</Text>
          </View>

          <View className="flex-row items-end justify-between">
            <Text className="text-xl text-primary-500">{product.price}</Text>

            <View className="items-end ">
              <Text className="text-xs text-white-700">Availability</Text>

              <View className="justify-center w-10 h-6">
                <Switch
                  value={product.available}
                  onValueChange={() => toggleAvailability(product.id)}
                  trackColor={{ false: "#E5E7EB", true: "#F46B45" }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#E5E7EB"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-5 border-b border-white-600">
        <Text className="text-[22px] font-semibold">
          My Products ({filteredProducts.length})
        </Text>

        <Pressable
          onPress={() => router.push("/(app)/orders/vendor-orders")}
          className="items-center justify-center w-10 h-10"
          hitSlop={10}
        >
          <Ionicons name="cube-outline" size={26} color="#1f2933" />
        </Pressable>
      </View>

      <View className="flex-1">
        {/* Filters */}
        <View className="flex-row gap-2 px-5 py-4 border-b border-white-600">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;

            return (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-md border ${
                  isActive
                    ? "bg-primary-500 border-primary-500"
                    : "bg-white border-brandBlack-50"
                }`}
              >
                <Text
                  className={`text-sm ${
                    isActive ? "text-white" : "text-black-500"
                  }`}
                >
                  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {filteredProducts.length === 0 ? (
          <View className="items-center justify-center flex-1 px-10">
            <Text className="text-xl text-center text-white-700">
              No products has been added.
            </Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-4">
              {filteredProducts.map(renderProductCard)}
            </View>
          </ScrollView>
        )}

        {/* Floating Add Button */}
        <Pressable
          onPress={() => {
            router.push("/(app)/products/add-products");
          }}
          className="absolute items-center justify-center w-16 h-16 rounded-full shadow-md bottom-6 right-5 bg-primary-500"
          style={{
            elevation: 6,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Ionicons name="add" size={34} color="#ffffff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default MyProductsScreen;
