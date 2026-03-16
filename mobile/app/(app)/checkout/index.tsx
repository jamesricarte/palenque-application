import React from "react";
import { View, Text, Pressable, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { useCheckout } from "@/src/features/app/checkout/useCheckout";

const CheckoutScreen = () => {
  const {
    vendorGroups,
    subtotal,
    deliveryFee,
    totalAmount,
    handleBack,
    handlePlaceOrder,
  } = useCheckout();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-5 border-b border-white-600">
        <Pressable onPress={handleBack} className="mr-3" hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>

        <Text className="text-[22px] font-medium">Checkout</Text>
      </View>

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 160,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Delivery Address */}
          <View className="mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-[18px] font-semibold text-black-500">
                Delivery Address
              </Text>

              <Text className="text-primary-500">Change</Text>
            </View>

            <Text className="text-[16px] text-black-500">
              Mark Joseph M. Ante
            </Text>
            <Text className="text-[15px] text-white-700">
              202 E. Jacinto St., Brgy. 6, Banadero
            </Text>
            <Text className="text-[15px] text-white-700">+639566082679</Text>
          </View>

          {/* Order Summary */}
          <View className="mb-4">
            <View className="flex-row justify-between mb-4">
              <Text className="text-[18px] font-semibold text-black-500">
                Order Summary
              </Text>

              <Text className="text-primary-500">Edit</Text>
            </View>

            <View className="gap-6">
              {vendorGroups.map((group) => (
                <View key={group.vendorId}>
                  <View className="flex-row items-center gap-2 mb-4">
                    {group.vendorImage ? (
                      <Image
                        source={{ uri: group.vendorImage }}
                        className="w-8 h-8 rounded-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="items-center justify-center w-8 h-8 rounded-full bg-brandBlack-50">
                        <Text className="text-[12px] font-semibold text-black-500">
                          {group.vendorInitials}
                        </Text>
                      </View>
                    )}

                    <Text className="text-[16px] font-medium text-black-500">
                      {group.vendorName}
                    </Text>
                  </View>

                  <View className="gap-4">
                    {group.items.map((item) => (
                      <View key={item.productId} className="flex-row">
                        <Image
                          source={{ uri: item.image }}
                          className="w-[60px] h-[60px] rounded-md"
                          resizeMode="cover"
                        />

                        <View className="flex-1 ml-3">
                          <Text className="text-[16px] text-black-500">
                            {item.productName}
                          </Text>

                          <Text className="text-[13px] text-white-700">
                            Per Kilo
                          </Text>

                          <Text className="text-[16px] text-primary-500 mt-1">
                            ₱ {item.unitPrice.toFixed(2)}
                          </Text>
                        </View>

                        <Text className="text-[15px] text-black-500">
                          Qty:{item.quantity}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="h-[1px] bg-white-600 my-6" />

          {/* Totals */}
          <View className="gap-3">
            <View className="flex-row justify-between">
              <Text className="text-[16px] text-black-500">Subtotal:</Text>

              <Text className="text-[16px] text-primary-500">{subtotal}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-[16px] text-black-500">Delivery Fee:</Text>

              <Text className="text-[16px] text-primary-500">
                {deliveryFee}
              </Text>
            </View>

            <View className="flex-row justify-between mt-2">
              <Text className="text-[18px] font-semibold text-black-500">
                Total Amount:
              </Text>

              <Text className="text-[18px] font-semibold text-primary-500">
                {totalAmount}
              </Text>
            </View>
          </View>

          {/* Payment Method */}
          <View className="mt-8">
            <Text className="mb-3 text-[18px] font-semibold text-black-500">
              Payment Method
            </Text>

            <View className="px-4 py-4 border rounded-md border-white-600">
              <Text className="text-[16px] text-black-500">
                💵 Cash on Delivery
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View className="px-5 pt-5 pb-5 bg-primary-500">
          <Pressable
            onPress={handlePlaceOrder}
            className="items-center justify-center py-4 bg-white rounded-md"
          >
            <Text className="text-lg font-medium text-primary-500">
              Place Order – {totalAmount}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
