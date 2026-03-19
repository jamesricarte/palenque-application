import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { useVendorApplicationForm } from "@/src/features/app/vendor-application/useVendorApplicationForm";

const VendorApplicationFormScreen = () => {
  const {
    form,
    markets,
    marketsLoading,
    selectedMarket,
    isMarketDropdownOpen,
    loading,
    error,
    handleBack,
    handleChange,
    handleMarketSelect,
    toggleMarketDropdown,
    closeMarketDropdown,
    handleSubmit,
  } = useVendorApplicationForm();

  const [shouldRender, setShouldRender] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isMarketDropdownOpen) {
      setShouldRender(true);
      fadeAnim.setValue(1);
    } else if (shouldRender) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [isMarketDropdownOpen, shouldRender, fadeAnim]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-white-600">
        <Pressable onPress={handleBack} className="pr-3">
          <Ionicons name="arrow-back" size={22} color="#111111" />
        </Pressable>

        <Text className="text-lg font-semibold">Vendor Application</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-6">
          {/* Title */}
          <View className="mb-8">
            <Text className="text-2xl font-semibold">Vendor Details</Text>
            <Text className="mt-2 text-base text-secondary-500">
              Fill out the basic details below so we can review your
              application.
            </Text>
          </View>

          {/* Market Location */}
          <View className="mb-4">
            <Text className="mb-2 text-base font-semibold">
              Market Location
            </Text>

            <View className="relative">
              <Pressable
                onPress={toggleMarketDropdown}
                className="flex-row items-center justify-between p-4 bg-white border rounded-md border-white-600"
              >
                <View className="flex-1 pr-3">
                  <Text
                    className={`text-base ${selectedMarket ? "text-black" : "text-[#b5b5b5]"}`}
                  >
                    {selectedMarket?.name || "Select a market"}
                  </Text>
                </View>

                {marketsLoading ? (
                  <ActivityIndicator size="small" color="#111111" />
                ) : (
                  <Ionicons
                    name={isMarketDropdownOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6f6f6f"
                  />
                )}
              </Pressable>

              {/* Dropdown */}
              {shouldRender ? (
                <Animated.View
                  style={{ opacity: fadeAnim }}
                  className="absolute z-20 w-full overflow-hidden bg-white border rounded-md shadow-lg border-white-600 top-16"
                >
                  {marketsLoading ? (
                    <View className="items-center py-4">
                      <ActivityIndicator size="small" color="#111111" />
                    </View>
                  ) : markets.length > 0 ? (
                    <ScrollView
                      nestedScrollEnabled
                      className="max-h-60"
                      showsVerticalScrollIndicator={false}
                    >
                      {markets.map((market, index) => {
                        const isSelected = form.market_id === market.id;
                        const isClosed = market.status === "closed";

                        return (
                          <Pressable
                            key={market.id}
                            disabled={isClosed}
                            onPress={() => handleMarketSelect(market.id)}
                            className={`flex-row items-center justify-between px-4 py-3 ${index !== markets.length - 1 ? "border-b border-white-600" : ""} ${isClosed ? "opacity-60" : ""} ${isSelected ? "bg-white-600" : "bg-white"}`}
                          >
                            <View className="flex-1 pr-3">
                              <Text
                                className={`text-base ${isClosed ? "text-white-700" : "text-black"}`}
                              >
                                {market.name}
                              </Text>

                              {isClosed ? (
                                <Text className="mt-1 text-sm text-red-500">
                                  Closed
                                </Text>
                              ) : null}
                            </View>

                            {isSelected ? (
                              <Ionicons
                                name="checkmark"
                                size={18}
                                color="#F46B45"
                              />
                            ) : null}
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  ) : (
                    <View className="px-4 py-3">
                      <Text className="text-base text-white-700">
                        No markets available right now.
                      </Text>
                    </View>
                  )}
                </Animated.View>
              ) : null}
            </View>
          </View>

          {/* Short Description */}
          <View className="mb-4">
            <Text className="mb-2 text-base font-semibold">
              Short Description
            </Text>
            <TextInput
              placeholder="Tell us a bit about your business"
              placeholderTextColor="#b5b5b5"
              multiline
              onFocus={closeMarketDropdown}
              textAlignVertical="top"
              className="p-4 text-base border rounded-md border-white-600 min-h-[120px]"
              value={form.description}
              onChangeText={(value) => handleChange("description", value)}
            />
          </View>

          {error ? <Text className="mb-4 text-red-500">{error}</Text> : null}

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={loading || marketsLoading}
            className={`py-4 rounded-md ${!loading && !marketsLoading ? "bg-primary-500" : "bg-gray-300"}`}
          >
            {!loading ? (
              <Text className="text-lg font-semibold text-center text-white">
                Submit Application
              </Text>
            ) : (
              <ActivityIndicator size="small" color="white" />
            )}
          </Pressable>

          <Text className="mt-4 text-center text-white-700">
            You can keep the requirements simple for now and update more details
            later.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorApplicationFormScreen;
