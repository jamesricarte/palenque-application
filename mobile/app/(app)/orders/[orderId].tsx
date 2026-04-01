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

import CashIcon from "@/src/assets/cashIcon.png";
import { useOrderDetails } from "@/src/features/app/orders/orderDetails";

const OrderDetailsScreen = () => {
  const { orderDetails, loading, errorMessage, handleBack } = useOrderDetails();

  const renderPaymentIcon = () => {
    if (orderDetails?.paymentMethodLabel === "Cash on Delivery") {
      return (
        <Image
          source={CashIcon}
          className="w-5 h-5 rounded-sm"
          resizeMode="cover"
        />
      );
    }

    return <Ionicons name="card-outline" size={18} color="#111111" />;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-row items-center px-5 pt-2 pb-5 border-b border-white-600">
        <Pressable onPress={handleBack} className="mr-3" hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>

        <Text className="text-[22px] font-medium text-black-500">
          Order Details
        </Text>
      </View>

      {loading ? (
        <View className="items-center justify-center flex-1 px-5">
          <ActivityIndicator size="large" color="#F46B45" />

          <View className="w-full gap-4 mt-8">
            <View className="h-28 rounded-2xl bg-brandBlack-50" />
            <View className="h-24 rounded-2xl bg-brandBlack-50" />
            <View className="h-56 rounded-2xl bg-brandBlack-50" />
          </View>
        </View>
      ) : !orderDetails ? (
        <View className="items-center justify-center flex-1 px-8">
          <Text className="text-lg font-medium text-black-500">
            Order not found
          </Text>
          <Text className="mt-2 text-center text-white-700">
            {errorMessage || "We couldn't load this order right now."}
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8">
            <Text className="mb-3 text-xl font-semibold text-black-500">
              Order Information
            </Text>

            <Text className="text-lg font-medium text-black-500">
              Order #{orderDetails.orderNumber}
            </Text>
            <Text className="text-lg text-black-500">
              {orderDetails.createdAtLabel}
            </Text>
            <Text className="text-lg text-green-700">
              Status: {orderDetails.statusMessage}
            </Text>
          </View>

          <View className="mb-8">
            <Text className="mb-3 text-xl font-semibold text-black-500">
              Delivery Address
            </Text>

            <Text className="text-lg text-black-500">
              {orderDetails.deliveryAddress.fullName}
            </Text>

            <Text className="text-lg text-black-500">
              {orderDetails.deliveryAddress.streetAddress}
            </Text>

            <Text className="text-lg text-black-500">
              {orderDetails.deliveryAddress.locality}
            </Text>

            <Text className="text-lg text-black-500">
              {orderDetails.deliveryAddress.phone}
            </Text>
          </View>

          <View>
            <Text className="mb-3 text-[18px] font-semibold text-black-500">
              Order Summary
            </Text>

            <View className="gap-6">
              {orderDetails.vendorGroups.map((group) => (
                <View key={group.id}>
                  <View className="flex-row items-center gap-2 mb-3">
                    <View className="items-center justify-center w-8 h-8 rounded-full bg-brandBlack-50">
                      <Text className="text-[12px] font-semibold text-black-500">
                        {group.vendorInitials}
                      </Text>
                    </View>

                    <Text className="text-lg text-black-500">
                      {group.vendorName}
                    </Text>
                  </View>

                  <View className="gap-4">
                    {group.items.map((item) => (
                      <View key={item.id} className="flex-row items-center">
                        {item.image ? (
                          <Image
                            source={{ uri: item.image }}
                            className="w-[52px] h-[52px] rounded-md"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="w-[52px] h-[52px] rounded-md bg-brandBlack-50" />
                        )}

                        <View className="flex-1 ml-3">
                          <Text className="text-[16px] text-black-500">
                            {item.name}
                          </Text>
                          <Text className="text-[13px] text-white-700">
                            {item.unitLabel}
                          </Text>
                          <Text className="mt-1 text-[16px] text-primary-500">
                            {item.priceLabel}
                          </Text>
                        </View>

                        <Text className="text-[16px] text-black-500">
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

          <View className="gap-3">
            <View className="flex-row justify-between">
              <Text className="text-lg text-black-500">Subtotal:</Text>
              <Text className="text-lg text-primary-500">
                {orderDetails.subtotalLabel}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-lg text-black-500">Delivery Fee:</Text>
              <Text className="text-lg text-primary-500">
                {orderDetails.deliveryFeeLabel}
              </Text>
            </View>

            <View className="h-[1px] bg-white-600" />

            <View className="flex-row justify-between">
              <Text className="text-lg font-semibold text-black-500">
                Total Amount:
              </Text>
              <Text className="text-lg font-semibold text-primary-500">
                {orderDetails.totalAmountLabel}
              </Text>
            </View>
          </View>

          <View className="mt-8">
            <Text className="mb-3 text-xl font-semibold text-black-500">
              Payment Method
            </Text>

            <View className="flex-row items-center px-4 py-4 border rounded-md border-white-600">
              {renderPaymentIcon()}
              <Text className="ml-3 text-lg text-black-500">
                {orderDetails.paymentMethodLabel}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default OrderDetailsScreen;
