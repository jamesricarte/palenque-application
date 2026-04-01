import React, { useState } from "react";
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
import { useOrders } from "@/src/features/app/consumer-tabs/orders/useOrders";
import CashIcon from "@/src/assets/cashIcon.png";

const statusLabelMap = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
} as const;

const statusClassNameMap = {
  pending: "bg-secondary-500",
  confirmed: "bg-secondary-500",
  preparing: "bg-secondary-500",
  ready: "bg-secondary-500",
  completed: "bg-brandBlack-400",
  cancelled: "bg-red-500",
} as const;

const VendorOrdersScreen = () => {
  const {
    activeTab,
    setActiveTab,
    orderTabs,
    orders,
    loading,
    handleOrderCardPress,
  } = useOrders();
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-5 border-b border-white-600">
        <Text className="text-[22px] font-semibold">My Orders</Text>
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
                      isActive ? "text-white" : "text-black"
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
        {loading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#f16b44" />
          </View>
        ) : orders.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Text className="text-base text-white-700">No orders found.</Text>
          </View>
        ) : (
          <View className="gap-4">
            {orders.map((order) => {
              const isExpanded = expandedOrderIds.includes(order.id);
              const firstVendorOrder = order.vendorOrders[0];
              const firstItem = firstVendorOrder?.items[0] ?? null;
              const hasMultipleItems =
                order.vendorOrders.reduce(
                  (sum, vendorOrder) => sum + vendorOrder.items.length,
                  0,
                ) > 1;

              return (
                <Pressable
                  key={order.id}
                  className="p-4 bg-white border rounded-md border-brandBlack-50"
                  onPress={() => handleOrderCardPress(order.id)}
                >
                  {/* Top Row */}
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1 pr-3">
                      <Text className="text-lg font-medium text-black-500">
                        Order #{order.orderNumber}
                      </Text>
                    </View>

                    <View
                      className={`px-6 py-1 rounded-full ${statusClassNameMap[order.status]}`}
                    >
                      <Text className="text-sm text-white">
                        {statusLabelMap[order.status]}
                      </Text>
                    </View>
                  </View>

                  {/* Products */}
                  <View className="gap-3 mb-4">
                    {isExpanded ? (
                      order.vendorOrders.map((vendorOrder) => (
                        <View key={vendorOrder.id} className="gap-3">
                          <View className="flex-row items-center gap-2">
                            <View className="items-center justify-center w-8 h-8 rounded-full bg-brandBlack-50">
                              <Text className="text-[12px] font-semibold text-black-500">
                                {vendorOrder.vendorInitials}
                              </Text>
                            </View>

                            <Text className="mt-1 text-black-400">
                              {vendorOrder.vendorName}
                            </Text>
                          </View>

                          {vendorOrder.items.map((item) => (
                            <View
                              key={item.id}
                              className="flex-row items-center"
                            >
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
                      ))
                    ) : firstItem ? (
                      <View className="gap-3">
                        <View className="flex-row items-center gap-2">
                          <View className="items-center justify-center w-8 h-8 rounded-full bg-brandBlack-50">
                            <Text className="text-[12px] font-semibold text-black-500">
                              {firstVendorOrder?.vendorInitials ?? "V"}
                            </Text>
                          </View>

                          <Text className="mt-1 text-black-400">
                            {firstVendorOrder?.vendorName ?? "Vendor Name"}
                          </Text>
                        </View>

                        <View className="flex-row items-center">
                          {firstItem.image ? (
                            <Image
                              source={{ uri: firstItem.image }}
                              className="w-[52px] h-[52px] rounded-md"
                              resizeMode="cover"
                            />
                          ) : (
                            <View className="w-[52px] h-[52px] rounded-md bg-brandBlack-50" />
                          )}

                          <View className="flex-1 ml-3">
                            <Text className="text-base font-medium text-black-500">
                              {firstItem.name}
                            </Text>
                            <Text className="text-[13px] text-white-700">
                              {firstItem.unit}
                            </Text>
                            <Text className="text-base text-primary-500">
                              {firstItem.priceLabel}
                            </Text>
                          </View>

                          <Text className="text-base text-black-400">
                            Qty:{firstItem.quantity}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  {hasMultipleItems && (
                    <Pressable
                      onPress={() => toggleOrderExpansion(order.id)}
                      className="flex-row items-center justify-center gap-1 mb-4"
                    >
                      <Text className="text-sm font-medium text-primary-500">
                        {isExpanded ? "View Less" : "View More"}
                      </Text>
                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={16}
                        color="#20B26C"
                      />
                    </Pressable>
                  )}

                  {/* Total */}
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="font-medium text-black-500">
                      Total ({order.totalItems} items):
                    </Text>
                    <Text className="font-medium text-primary-500">
                      {order.totalAmount}
                    </Text>
                  </View>

                  {/* Date and Payment */}
                  <View className="flex-row items-start justify-between">
                    <Text className="flex-1 pr-3 text-sm font-medium text-white-700">
                      {order.createdAt}
                    </Text>

                    <View className="flex-row items-center gap-1">
                      <Image
                        className="w-6 h-6 rounded-md opacity-75"
                        resizeMode="cover"
                        source={CashIcon}
                      />
                      <Text className="text-sm font-medium text-white-700">
                        {order.paymentMethod}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorOrdersScreen;
