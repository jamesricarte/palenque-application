import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { useAddProduct } from "@/src/features/app/products/useAddProduct";

const AddProductScreen = () => {
  const {
    productName,
    category,
    price,
    unit,
    selectedImage,
    categoryOptions,
    unitOptions,
    handleBack,
    setProductName,
    setPrice,
    handleSelectImage,
    handleSelectCategory,
    handleSelectUnit,
    handleSaveProduct,
  } = useAddProduct();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-5 border-b border-white-600">
        <Pressable onPress={handleBack} className="mr-3" hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>

        <Text className="text-[22px] font-semibold">Add Products</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-5 text-lg text-black-500">
          Enter product details below.
        </Text>

        {/* Image Picker */}
        <Pressable
          onPress={handleSelectImage}
          className="items-center justify-center overflow-hidden mb-4 rounded-md bg-brandBlack-50 h-[150px]"
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="images" size={28} color="white" />
          )}
        </Pressable>

        {/* Product Name */}
        <TextInput
          value={productName}
          onChangeText={setProductName}
          placeholder="Product Name"
          placeholderTextColor="#b5b5b5"
          className="p-4 mb-4 text-lg bg-white border rounded-md border-white-600"
        />

        {/* Category */}
        <Pressable
          onPress={handleSelectCategory}
          className="flex-row items-center justify-between p-4 mb-4 bg-white border rounded-md border-white-600"
        >
          <Text
            className={`${category ? "text-black-500" : "text-[#b5b5b5]"} text-lg`}
          >
            {category || "Category"}
          </Text>

          <Ionicons name="chevron-down" size={20} color="#b5b5b5" />
        </Pressable>

        {/* Price and Unit */}
        <View className="flex-row gap-3 mb-6">
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="Price"
            placeholderTextColor="#b5b5b5"
            keyboardType="numeric"
            className="flex-1 p-4 text-lg bg-white border rounded-md border-white-600"
          />

          <Pressable
            onPress={handleSelectUnit}
            className="flex-row items-center justify-between flex-1 p-4 bg-white border rounded-md border-white-600"
          >
            <Text
              className={`${unit ? "text-black-500" : "text-[#b5b5b5]"} text-lg`}
            >
              {unit || "Unit"}
            </Text>

            <Ionicons name="chevron-down" size={20} color="#b5b5b5" />
          </Pressable>
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSaveProduct}
          className="py-4 rounded-md bg-primary-500"
        >
          <Text className="text-lg font-semibold text-center text-white">
            Save Product
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProductScreen;
