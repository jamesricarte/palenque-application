import React, { useState } from "react";
import { View, Text, Pressable, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useOrders } from "@/src/features/app/consumer-tabs/orders/useOrders";
import CashIcon from "@/src/assets/cashIcon.png";
import OrdersLoadingSkeleton from "@/src/features/app/consumer-tabs/orders/components/OrdersLoadingSkeleton";

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

const emptyStateCopyMap = {
  All: {
    title: "No market orders yet",
    description:
      "Fresh finds from your favorite wet market vendors will appear here once you place an order.",
  },
  Pending: {
    title: "No pending orders right now",
    description:
      "You have no market orders waiting to be confirmed or prepared at the moment.",
  },
  Preparing: {
    title: "No orders being prepared",
    description:
      "Your fresh picks are not being packed just yet. Check again after your next order is confirmed.",
  },
  "On the Way": {
    title: "No orders on the way",
    description:
      "There are no wet market orders currently out for delivery to your doorstep.",
  },
  Completed: {
    title: "No completed orders yet",
    description:
      "Finished orders from your market runs will show up here after they have been delivered.",
  },
  Cancelled: {
    title: "No cancelled orders",
    description:
      "Good news, you do not have any cancelled wet market orders for this filter.",
  },
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
  const emptyStateCopy =
    emptyStateCopyMap[activeTab as keyof typeof emptyStateCopyMap];

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
          <OrdersLoadingSkeleton />
        ) : orders.length === 0 ? (
          <View className="items-center justify-center px-6 py-16">
            <View className="items-center justify-center w-20 h-20 rounded-full bg-[#fef0ec]">
              <Ionicons name="basket-outline" size={34} color="#f16b44" />
            </View>

            <Text className="mt-5 text-xl font-semibold text-center text-brandBlack-900">
              {emptyStateCopy.title}
            </Text>

            <Text className="mt-3 text-base leading-6 text-center text-white-700">
              {emptyStateCopy.description}
            </Text>
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
                            {vendorOrder.vendorImage ? (
                              <Image
                                source={{ uri: vendorOrder.vendorImage }}
                                className="w-8 h-8 rounded-full"
                                resizeMode="cover"
                              />
                            ) : (
                              <View className="items-center justify-center w-8 h-8 rounded-full bg-brandBlack-50">
                                <Text className="text-[12px] font-semibold text-black-500">
                                  {vendorOrder.vendorInitials}
                                </Text>
                              </View>
                            )}

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
                          {firstVendorOrder.vendorImage ? (
                            <Image
                              source={{ uri: firstVendorOrder.vendorImage }}
                              className="w-8 h-8 rounded-full"
                              resizeMode="cover"
                            />
                          ) : (
                            <View className="items-center justify-center w-8 h-8 rounded-full bg-brandBlack-50">
                              <Text className="text-[12px] font-semibold text-black-500">
                                {firstVendorOrder?.vendorInitials ?? "V"}
                              </Text>
                            </View>
                          )}

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
