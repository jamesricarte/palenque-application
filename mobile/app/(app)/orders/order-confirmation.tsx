import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import CashIcon from "@/src/assets/cashIcon.png";

const OrderConfirmationScreen = () => {
  const { orderNumber, vendorName, paymentMethod, totalAmount } =
    useLocalSearchParams<{
      orderNumber?: string;
      vendorName?: string;
      paymentMethod?: string;
      totalAmount?: string;
    }>();

  const getParamValue = (value?: string | string[]) => {
    if (Array.isArray(value)) {
      return value[0] ?? "";
    }

    return value ?? "";
  };

  const orderNumberValue = getParamValue(orderNumber) || "#ORDXXXXXX";
  const vendorNameValue = getParamValue(vendorName) || "Vendor";
  const paymentMethodValue = getParamValue(paymentMethod);
  const totalAmountValue = getParamValue(totalAmount) || "₱ 0.00";

  const paymentMethodLabel =
    paymentMethodValue === "cash_on_delivery"
      ? "Cash on Delivery"
      : paymentMethodValue === "e_payment"
        ? "E-Payment"
        : paymentMethodValue || "Cash on Delivery";

  const handleTrackOrder = () => {
    console.log("Tracking order...");
  };

  const handleBackToHome = () => {
    router.replace("/(app)/(consumer-tabs)/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="px-5 pt-2 pb-5 border-b border-white-600">
        <Text className="text-[22px] font-medium text-black-500">
          Order Confirmation
        </Text>
      </View>

      <View className="justify-between flex-1">
        <View className="flex-1 px-5 pt-20">
          <View className="items-center mb-10">
            <View className="items-center justify-center w-[140px] h-[140px] rounded-full bg-green-700 mb-8">
              <Ionicons name="checkmark" size={88} color="white" />
            </View>

            <Text className="mb-2 text-lg text-center text-white-700">
              Order Placed Successfully!
            </Text>
            <Text className="text-lg leading-6 text-center text-white-700">
              Your order has been sent to the vendor.
            </Text>
          </View>

          <View className="p-4 bg-white border rounded-md border-brandBlack-50">
            <Text className="mb-4 text-xl font-medium text-black-500">
              Order Details
            </Text>

            <View className="gap-2">
              <View className="flex-row items-center justify-between gap-4">
                <Text className="text-lg text-black-500">Order Number</Text>

                <Text className="flex-1 text-lg font-bold text-right text-black-500">
                  #{orderNumberValue}
                </Text>
              </View>

              <View className="flex-row items-center justify-between gap-4">
                <Text className="text-lg text-black-500">Vendor Name</Text>

                <Text className="flex-1 text-lg text-right text-black-500">
                  {vendorNameValue}
                </Text>
              </View>

              <View className="flex-row items-center justify-between gap-4">
                <Text className="text-lg text-black-500">Payment Method</Text>

                <View className="flex-row items-center justify-end flex-1 gap-2">
                  <Image
                    source={CashIcon}
                    className="w-5 h-5 rounded"
                    resizeMode="cover"
                  />
                  <Text className="text-lg text-right text-black-500">
                    {paymentMethodLabel}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between gap-4">
                <Text className="text-lg text-black-500">Total Amount</Text>

                <Text className="flex-1 text-lg font-bold text-right text-primary-500">
                  {totalAmountValue}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 px-5 pt-5 pb-5 bg-primary-500">
          <Pressable
            onPress={handleTrackOrder}
            className="items-center justify-center flex-1 py-4 bg-white rounded-md"
          >
            <Text className="text-lg font-medium text-primary-500">
              Track Order
            </Text>
          </Pressable>

          <Pressable
            onPress={handleBackToHome}
            className="items-center justify-center flex-1 py-4 border border-white rounded-md"
          >
            <Text className="text-lg font-medium text-white">Back to Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderConfirmationScreen;
