import React from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { useProductDetails } from "@/src/features/app/products/useProductDetails";
import { useCartCount } from "@/src/hooks/useCartCount";
import { router } from "expo-router";
import ProductDetailsLoadingSkeleton from "@/src/features/app/products/components/ProductDetailsLoadingSkeleton";

const ProductDetailsScreen = () => {
  const { cartCount, fetchCartCount } = useCartCount();

  const {
    product,
    loading,
    quantity,
    subtotal,
    isQuantityModalVisible,
    modalAction,
    handleBack,
    openQuantityModal,
    closeQuantityModal,
    increaseQuantity,
    decreaseQuantity,
    handleConfirmQuantityAction,
    isConfirming,
  } = useProductDetails(fetchCartCount);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-5 border-b border-white-600">
        <View className="flex-row items-center">
          <Pressable onPress={handleBack} className="mr-3" hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color="#111111" />
          </Pressable>

          <Text className="text-[22px] font-semibold">Product Details</Text>
        </View>

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

      <View className="flex-1">
        {loading ? (
          <ProductDetailsLoadingSkeleton />
        ) : product ? (
          <>
            <Image
              source={{ uri: product.image }}
              className="w-full h-[250px]"
              resizeMode="cover"
            />

            <View className="flex-1 px-5 py-4">
              <View className="flex-row items-start justify-between mb-3">
                <Text className="flex-1 mr-4 text-[22px] font-semibold text-black-500">
                  {product.name}
                </Text>

                <Text className="text-[18px] font-medium text-primary-500">
                  {product.price}
                </Text>
              </View>

              <View className="self-start px-3 py-1 bg-green-700 rounded mb-7">
                <Text className="text-[12px] text-white">
                  {product.category}
                </Text>
              </View>

              <View>
                <Text className="mb-3 text-xl font-medium text-black-500">
                  Vendor Information
                </Text>

                <View className="flex-row gap-2">
                  {product.vendorImage ? (
                    <Image
                      source={{ uri: product.vendorImage }}
                      className="w-8 h-8 rounded-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="items-center justify-center w-8 h-8 rounded-full bg-brandBlack-50">
                      <Text className="text-[12px] font-semibold text-black-500">
                        {product.vendorInitials}
                      </Text>
                    </View>
                  )}

                  <Text className="text-lg text-black-400">
                    {product.vendorName}
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Buttons */}
            <View className="flex-row gap-3 px-5 py-5 bg-primary-500">
              <Pressable
                onPress={() => openQuantityModal("cart")}
                className="items-center justify-center flex-1 py-4 bg-white rounded-md"
              >
                <Text className="text-lg font-medium text-primary-500">
                  Add to Cart
                </Text>
              </Pressable>

              <Pressable
                onPress={() => openQuantityModal("buy")}
                className="items-center justify-center flex-1 py-4 border border-white rounded-md"
              >
                <Text className="text-lg font-medium text-white">Buy Now</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View className="items-center justify-center flex-1 px-10">
            <Text className="text-lg text-center text-white-700">
              Product not found.
            </Text>
          </View>
        )}
      </View>

      <Modal
        visible={isQuantityModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeQuantityModal}
      >
        <View className="justify-end flex-1 bg-black/40">
          <View className="px-5 pt-6 pb-5 bg-white rounded-t-[32px]">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-[22px] font-semibold text-black-500">
                Select Quantity
              </Text>

              <Pressable onPress={closeQuantityModal} hitSlop={10}>
                <Ionicons name="close" size={28} color="#1f2933" />
              </Pressable>
            </View>

            <View className="flex-row items-center justify-between px-4 py-3 mb-5 rounded-md bg-brandBlack-50">
              <Pressable
                onPress={decreaseQuantity}
                className="items-center justify-center w-10 h-10 bg-white rounded-full"
              >
                <Ionicons name="remove" size={24} color="#111111" />
              </Pressable>

              <Text className="text-[22px] font-medium text-black-500">
                {quantity}
              </Text>

              <Pressable
                onPress={increaseQuantity}
                className="items-center justify-center w-10 h-10 bg-white rounded-full"
              >
                <Ionicons name="add" size={24} color="#111111" />
              </Pressable>
            </View>

            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-[18px] font-semibold text-black-500">
                Subtotal:
              </Text>

              <Text className="text-[18px] font-medium text-primary-500">
                {subtotal}
              </Text>
            </View>

            <Pressable
              onPress={handleConfirmQuantityAction}
              className="items-center justify-center py-4 rounded-md bg-primary-500"
            >
              {isConfirming ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-lg font-semibold text-white">
                  {modalAction === "buy" ? "Buy Now" : "Add to Cart"}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;
