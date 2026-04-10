import React from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { useCart } from "@/src/features/app/cart/useCart";

const CartScreen = () => {
  const {
    isLoggedIn,
    loading,
    cartGroups,
    cartCount,
    selectedSubtotal,
    isProceedingToCheckout,
    handleBack,
    handleBrowseProducts,
    toggleVendorSelection,
    toggleItemSelection,
    decreaseQuantity,
    increaseQuantity,
    handleDeleteCartItem,
    handleProceedToCheckout,
  } = useCart();

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

      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-5 border-b border-white-600">
        <Pressable onPress={handleBack} className="mr-3" hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>

        <Text className="text-[22px] font-medium">My Cart ({cartCount})</Text>
      </View>

      {cartGroups.length === 0 ? (
        <View className="items-center justify-center flex-1 px-5">
          <Text className="mb-2 text-[18px] text-center text-white-700">
            {isLoggedIn
              ? "Your cart is empty."
              : "You must be logged in to view your cart."}
          </Text>

          <Text className="mb-8 text-[18px] leading-7 text-center text-white-700">
            {isLoggedIn
              ? "Browse products and add items to get started."
              : "Please log in to access your cart and continue shopping."}
          </Text>

          <Pressable
            onPress={handleBrowseProducts}
            className="items-center justify-center w-full py-4 rounded-md bg-primary-500"
          >
            <Text className="text-lg font-semibold text-white">
              {isLoggedIn ? "Browse Products" : "Login"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 150,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-4">
              {cartGroups.map((group) => (
                <View
                  key={group.vendorId}
                  className="p-4 bg-white border rounded-md border-white-600"
                >
                  {/* Vendor */}
                  <View className="flex-row items-center mb-4">
                    <Pressable
                      onPress={() => toggleVendorSelection(group.vendorId)}
                      className={`items-center justify-center w-5 h-5 mr-3 border rounded-sm ${
                        group.isAllSelected
                          ? "bg-primary-500 border-primary-500"
                          : "bg-white border-white-600"
                      }`}
                    >
                      {group.isAllSelected ? (
                        <Ionicons name="checkmark" size={14} color="#ffffff" />
                      ) : null}
                    </Pressable>

                    {group.vendorImage ? (
                      <Image
                        source={{ uri: group.vendorImage }}
                        className="rounded-full w-7 h-7"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="items-center justify-center rounded-full w-7 h-7 bg-brandBlack-50">
                        <Text className="text-[12px] font-semibold text-black-500">
                          {group.vendorInitials}
                        </Text>
                      </View>
                    )}

                    <View className="flex-1 ml-2">
                      <Text className="text-base font-medium text-black-500">
                        {group.vendorName}
                      </Text>
                    </View>
                  </View>

                  {/* Items */}
                  <View className="gap-4">
                    {group.items.map((item, index) => (
                      <View
                        key={item.id}
                        className={`flex-row ${
                          index !== group.items.length - 1
                            ? "pb-4 border-b border-white-600"
                            : ""
                        }`}
                      >
                        <Pressable
                          onPress={() =>
                            toggleItemSelection(group.vendorId, item.id)
                          }
                          className={`items-center justify-center w-5 h-5 mt-4 mr-3 border rounded-sm ${
                            item.isSelected
                              ? "bg-primary-500 border-primary-500"
                              : "bg-white border-white-600"
                          }`}
                        >
                          {item.isSelected ? (
                            <Ionicons
                              name="checkmark"
                              size={14}
                              color="#ffffff"
                            />
                          ) : null}
                        </Pressable>

                        <Image
                          source={{ uri: item.image }}
                          className="w-[70px] h-[70px] rounded-md"
                          resizeMode="cover"
                        />

                        <View className="flex-1 ml-3">
                          <View className="flex-row justify-between">
                            <Text className="text-xl text-black-500">
                              {item.name}
                            </Text>

                            <Pressable
                              onPress={() =>
                                handleDeleteCartItem(
                                  group.vendorId,
                                  item.id,
                                  item.name,
                                )
                              }
                              hitSlop={10}
                            >
                              <Ionicons
                                name="trash-outline"
                                size={18}
                                color="#FF6B6B"
                              />
                            </Pressable>
                          </View>

                          <Text className="text-[14px] text-white-700">
                            {item.unitLabel}
                          </Text>

                          {item.quantity > item.stock ? (
                            <Text className="mt-1 text-[13px] text-red-500">
                              Only {item.stock} item(s) are available in stock.
                            </Text>
                          ) : null}

                          <View className="flex-row justify-between">
                            <Text className="mt-1 text-[18px] text-primary-500">
                              {item.price}
                            </Text>

                            <View className="flex-row items-center">
                              <Pressable
                                onPress={() => decreaseQuantity(item.id)}
                                className="items-center justify-center w-6 h-6 rounded-full bg-brandBlack-50"
                              >
                                <Ionicons
                                  name="remove"
                                  size={13}
                                  color="#B5B5B5"
                                />
                              </Pressable>

                              <Text className="mx-4 text-[18px] text-black-500">
                                {item.quantity}
                              </Text>

                              <Pressable
                                onPress={() => increaseQuantity(item.id)}
                                className="items-center justify-center w-6 h-6 rounded-full bg-brandBlack-50"
                              >
                                <Ionicons
                                  name="add"
                                  size={13}
                                  color="#B5B5B5"
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Bottom Summary */}
          <View className="px-5 pt-5 pb-5 bg-primary-500">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[18px] font-semibold text-white">
                Subtotal:
              </Text>

              <Text className="text-[18px] font-semibold text-white">
                {selectedSubtotal}
              </Text>
            </View>

            <Pressable
              onPress={handleProceedToCheckout}
              className="items-center justify-center py-4 bg-white rounded-md"
            >
              {isProceedingToCheckout ? (
                <ActivityIndicator size="small" color="#F46B45" />
              ) : (
                <Text className="text-lg font-medium text-primary-500">
                  Proceed to Checkout
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;
