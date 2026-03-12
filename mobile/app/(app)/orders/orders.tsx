import React from "react";
import { View, Text, Pressable, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useOrders } from "@/src/features/app/orders/useOrders";
import CashIcon from "@/src/assets/cashIcon.png";

const OrderScreen = () => {
  const { activeTab, setActiveTab, orderTabs, orderItems, handleBack } =
    useOrders();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-5 border-b border-white-600">
        <Pressable className="mr-3" hitSlop={10} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>

        <Text className="text-[22px] font-semibold">Manage Orders</Text>
      </View>

      {/* Tabs */}
      <View className="px-5 py-4 border-b border-white-600">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {orderTabs.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md border ${
                    isActive
                      ? "bg-primary-500 border-primary-500"
                      : "bg-white border-brandBlack-50"
                  }`}
                >
                  <Text
                    className={`text-[13px] ${
                      isActive ? "text-white" : "text-black-500"
                    }`}
                  >
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
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
        {/* Order Card */}
        <View className="p-4 bg-white border rounded-md border-brandBlack-50">
          {/* Top Row */}
          <View className="flex-row items-start justify-between mb-6">
            <View>
              <Text className="mb-1 text-xl font-medium text-black-500">
                Order #ORDXXXXX
              </Text>
              <Text className="mt-1 text-lg text-black-400">
                Customer: Mark Joseph
              </Text>
            </View>

            <View className="px-6 py-[6px] rounded-full bg-secondary-500">
              <Text className="text-[12px] text-white">New</Text>
            </View>
          </View>

          {/* Products */}
          <View className="gap-3 mb-4">
            {orderItems.map((item) => (
              <View key={item.id} className="flex-row items-center">
                <Image
                  source={{ uri: item.image }}
                  className="w-[52px] h-[52px] rounded-md"
                  resizeMode="cover"
                />

                <View className="flex-1 ml-3">
                  <Text className="text-base font-medium text-black-500">
                    {item.name}
                  </Text>
                  <Text className="text-[13px] text-white-700">
                    {item.unit}
                  </Text>
                  <Text className="text-base text-primary-500">
                    {item.priceLabel}
                  </Text>
                </View>

                <Text className="text-base text-black-400">
                  Qty:{item.quantity}
                </Text>
              </View>
            ))}
          </View>

          {/* Total */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-medium text-black-500">
              Total Amount:
            </Text>
            <Text className="text-lg font-medium text-primary-500">
              ₱ 380.00
            </Text>
          </View>

          {/* Date and Payment */}
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-[15px] font-medium text-white-700">
              March 9, 2026, 9:00 AM
            </Text>

            <View className="flex-row items-center gap-1">
              <Image
                className="w-6 h-6 rounded-md opacity-75"
                resizeMode="cover"
                source={CashIcon}
              />
              <Text className="text-[15px] font-medium text-white-700">
                Cash on Delivery
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <Pressable className="items-center justify-center flex-1 py-2 rounded-md bg-primary-500">
              <Text className="text-base font-semibold text-white">
                Accept Order
              </Text>
            </Pressable>

            <Pressable className="items-center justify-center flex-1 py-2 bg-white border rounded-md border-brandBlack-50">
              <Text className="text-base text-black-500">Decline Order</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderScreen;
