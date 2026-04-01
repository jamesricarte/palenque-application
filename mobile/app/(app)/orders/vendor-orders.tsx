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
import { useVendorOrders } from "@/src/features/app/orders/useVendorOrders";
import CashIcon from "@/src/assets/cashIcon.png";

const statusLabelMap = {
  pending: "New",
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
    processingOrderId,
    handleBack,
    handleAcceptOrder,
    handleDeclineOrder,
    handleAdvanceOrderStatus,
  } = useVendorOrders();

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
              const isProcessing = processingOrderId === order.id;

              return (
                <View
                  key={order.id}
                  className="p-4 bg-white border rounded-md border-brandBlack-50"
                >
                  {/* Top Row */}
                  <View className="flex-row items-start justify-between mb-6">
                    <View className="flex-1 pr-3">
                      <Text className="mb-1 text-xl font-medium text-black-500">
                        Order #{order.orderNumber}
                      </Text>
                      <Text className="mt-1 text-lg text-black-400">
                        Customer: {order.customerName}
                      </Text>
                    </View>

                    <View
                      className={`px-6 py-[6px] rounded-full ${statusClassNameMap[order.status]}`}
                    >
                      <Text className="text-[12px] text-white">
                        {statusLabelMap[order.status]}
                      </Text>
                    </View>
                  </View>

                  {/* Products */}
                  <View className="gap-3 mb-4">
                    {order.orderItems.map((item) => (
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
                      {order.totalAmount}
                    </Text>
                  </View>

                  {/* Date and Payment */}
                  <View className="flex-row items-center justify-between mb-5">
                    <Text className="text-[15px] font-medium text-white-700">
                      {order.createdAt}
                    </Text>

                    <View className="flex-row items-center gap-1">
                      <Image
                        className="w-6 h-6 rounded-md opacity-75"
                        resizeMode="cover"
                        source={CashIcon}
                      />
                      <Text className="text-[15px] font-medium text-white-700">
                        {order.paymentMethod}
                      </Text>
                    </View>
                  </View>

                  {/* Buttons */}
                  {order.status === "pending" ? (
                    <View className="flex-row gap-3">
                      <Pressable
                        className={`items-center justify-center flex-1 py-2 rounded-md bg-primary-500 ${
                          isProcessing ? "opacity-70" : ""
                        }`}
                        onPress={() => handleAcceptOrder(order.id)}
                        disabled={isProcessing}
                      >
                        <Text className="text-base font-semibold text-white">
                          Accept Order
                        </Text>
                      </Pressable>

                      <Pressable
                        className={`items-center justify-center flex-1 py-2 bg-white border rounded-md border-brandBlack-50 ${
                          isProcessing ? "opacity-70" : ""
                        }`}
                        onPress={() => handleDeclineOrder(order.id)}
                        disabled={isProcessing}
                      >
                        <Text className="text-base text-black-500">
                          Decline Order
                        </Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      className={`items-center justify-center py-2 rounded-md bg-primary-500 ${
                        isProcessing ||
                        order.status === "completed" ||
                        order.status === "cancelled"
                          ? "opacity-70"
                          : ""
                      }`}
                      onPress={() =>
                        handleAdvanceOrderStatus(order.id, order.status)
                      }
                      disabled={
                        isProcessing ||
                        order.status === "completed" ||
                        order.status === "cancelled"
                      }
                    >
                      <Text className="text-base font-semibold text-white">
                        {order.status === "confirmed"
                          ? "Start Preparing"
                          : order.status === "preparing"
                          ? "Done Preparing"
                          : order.status === "ready"
                          ? "Complete Order"
                          : order.status === "cancelled"
                          ? "Order Cancelled"
                          : "Order Completed"}
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorOrdersScreen;
