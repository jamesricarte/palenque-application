import React from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { useCheckout } from "@/src/features/app/checkout/useCheckout";

const CheckoutScreen = () => {
  const {
    loading,
    addresses,
    selectedAddress,
    isAddressModalVisible,
    isPlacingOrder,
    user,
    vendorGroups,
    subtotal,
    deliveryFee,
    totalAmount,
    handleBack,
    openAddressModal,
    closeAddressModal,
    handleSelectAddress,
    handlePlaceOrder,
  } = useCheckout();

  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  const formattedAddress = selectedAddress
    ? [
        selectedAddress.street_address,
        selectedAddress.barangay,
        selectedAddress.city,
        selectedAddress.province,
        selectedAddress.postal_code,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

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

      {loading ? (
        <View className="flex-1 px-5 pt-8">
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#F46B45" />

            <View className="w-full gap-4 mt-8">
              <View className="h-24 rounded-2xl bg-brandBlack-50" />
              <View className="h-40 rounded-2xl bg-brandBlack-50" />
              <View className="h-28 rounded-2xl bg-brandBlack-50" />
            </View>
          </View>
        </View>
      ) : (
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

                <Pressable onPress={openAddressModal} hitSlop={10}>
                  <Text className="text-primary-500">Change</Text>
                </Pressable>
              </View>

              {selectedAddress ? (
                <>
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-[16px] text-black">
                      {fullName || "Saved Address"}
                    </Text>

                    {selectedAddress.addressLabel ? (
                      <View className="px-2 py-1 rounded-full bg-brandBlack-50">
                        <Text className="text-[12px] text-black">
                          {selectedAddress.addressLabel}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <Text className="text-[15px] text-black">
                    {formattedAddress}
                  </Text>
                  <Text className="text-[15px] text-black">
                    {user?.phone ?? "No phone number"}
                  </Text>
                </>
              ) : (
                <View className="px-4 py-4 rounded-2xl bg-brandBlack-50">
                  <Text className="text-[15px] text-black">
                    No saved delivery address found.
                  </Text>
                  <Text className="mt-1 text-[14px] text-black">
                    Add an address from your profile setup to continue checkout.
                  </Text>
                </View>
              )}
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
                <Text className="text-[16px] text-black-500">
                  Delivery Fee:
                </Text>

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
              disabled={!selectedAddress || isPlacingOrder}
              className={`items-center justify-center py-4 bg-white rounded-md ${
                !selectedAddress || isPlacingOrder ? "opacity-70" : ""
              }`}
            >
              {isPlacingOrder ? (
                <ActivityIndicator size="small" color="#F46B45" />
              ) : (
                <Text className="text-lg font-medium text-primary-500">
                  Place Order – {totalAmount}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      )}

      <Modal
        visible={isAddressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeAddressModal}
      >
        <View className="justify-end flex-1 bg-black/40">
          <View className="px-5 pt-6 pb-5 bg-white rounded-t-[32px]">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-[22px] font-semibold text-black-500">
                Select Address
              </Text>

              <Pressable onPress={closeAddressModal} hitSlop={10}>
                <Ionicons name="close" size={28} color="#1f2933" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
            >
              <View className="gap-3">
                {addresses.map((address) => {
                  const isSelected = selectedAddress?.id === address.id;
                  const addressText = [
                    address.street_address,
                    address.barangay,
                    address.city,
                    address.province,
                    address.postal_code,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <Pressable
                      key={address.id}
                      onPress={() => handleSelectAddress(address)}
                      className={`p-4 rounded-2xl border ${
                        isSelected
                          ? "border-primary-500 bg-white"
                          : "border-black bg-white"
                      }`}
                    >
                      <View className="flex-row items-start justify-between gap-3">
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2 mb-1">
                            <Text className="text-[16px] font-medium text-black-500">
                              {fullName || "Saved Address"}
                            </Text>

                            {address.addressLabel ? (
                              <View className="px-2 py-1 rounded-full bg-brandBlack-50">
                                <Text className="text-[12px] text-black">
                                  {address.addressLabel}
                                </Text>
                              </View>
                            ) : null}

                            {address.is_default ? (
                              <View className="px-2 py-1 rounded-full bg-primary-500/10">
                                <Text className="text-[12px] text-primary-500">
                                  Default
                                </Text>
                              </View>
                            ) : null}
                          </View>

                          <Text className="text-[14px] leading-5 text-black">
                            {addressText}
                          </Text>

                          <Text className="mt-2 text-[14px] text-black">
                            {user?.phone ?? "No phone number"}
                          </Text>
                        </View>

                        <View
                          className={`items-center justify-center w-6 h-6 rounded-full border ${
                            isSelected
                              ? "border-primary-500 bg-primary-500"
                              : "border-white-600"
                          }`}
                        >
                          {isSelected ? (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="white"
                            />
                          ) : null}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}

                {addresses.length === 0 ? (
                  <View className="px-4 py-5 rounded-2xl bg-brandBlack-50">
                    <Text className="text-[15px] text-black-500">
                      No saved addresses available.
                    </Text>
                  </View>
                ) : null}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
