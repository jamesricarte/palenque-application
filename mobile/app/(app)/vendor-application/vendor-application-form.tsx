import React from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomDropdown } from "@/src/components/ui/custom-dropdown";
import { useVendorApplicationForm } from "@/src/features/app/vendor-application/useVendorApplicationForm";

const VendorApplicationFormScreen = () => {
  const {
    form,
    markets,
    marketsLoading,
    selectedMarket,
    userFullName,
    userPhone,
    formattedBirthDate,
    isMarketDropdownOpen,
    isBirthDatePickerOpen,
    loading,
    error,
    handleBack,
    handleBirthDateChange,
    handleMarketSelect,
    toggleMarketDropdown,
    openBirthDatePicker,
    closeBirthDatePicker,
    handleSubmit,
  } = useVendorApplicationForm();

  const birthDatePickerValue = form.birth_date ?? new Date(2000, 0, 1);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center px-5 py-4 border-b border-white-600">
          <Pressable onPress={handleBack} className="pr-3">
            <Ionicons name="arrow-back" size={22} color="#111111" />
          </Pressable>

          <Text className="text-lg font-semibold text-brandBlack-900">
            Vendor Application
          </Text>
        </View>

        <View className="justify-between flex-1">
          <View className="px-5 pt-4">
            <Text className="mb-6 text-base text-brandBlack-900">
              Enter the needed details below.
            </Text>

            <View className="mb-4 px-4 py-4 rounded-md bg-[#f1f1f1] border border-white-600">
              <Text className="text-base text-white-700">
                {userFullName || "Name"}
              </Text>
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 px-4 py-4 rounded-md bg-[#f1f1f1] border border-white-600">
                <Text className="text-base text-white-700">
                  {userPhone || "Phone Number"}
                </Text>
              </View>

              <Pressable
                onPress={openBirthDatePicker}
                className="flex-row items-center justify-between flex-1 px-4 py-4 bg-white border rounded-md border-white-600"
              >
                <Text
                  className={`text-base ${formattedBirthDate ? "text-brandBlack-900" : "text-white-700"}`}
                >
                  {formattedBirthDate || "Birthdate"}
                </Text>

                <Ionicons name="calendar-outline" size={18} color="#b5b5b5" />
              </Pressable>
            </View>

            <CustomDropdown
              items={markets}
              selectedItem={selectedMarket}
              isOpen={isMarketDropdownOpen}
              loading={marketsLoading}
              placeholder="Public Market"
              emptyText="No markets available right now."
              onToggle={toggleMarketDropdown}
              onSelect={(market) => handleMarketSelect(market.id)}
              keyExtractor={(market) => market.id}
              labelExtractor={(market) => market.name}
              isItemDisabled={(market) => market.status === "closed"}
              renderItemSubtext={(market) =>
                market.status === "closed" ? (
                  <Text className="mt-1 text-sm text-red-500">Closed</Text>
                ) : null
              }
            />

            {error ? (
              <Text className="mt-4 text-sm text-red-500">{error}</Text>
            ) : null}
          </View>

          <View className="px-5 pt-5 pb-6 bg-primary-500">
            <Pressable
              onPress={handleSubmit}
              disabled={loading || marketsLoading}
              className={`items-center justify-center py-4 bg-white rounded-md ${loading || marketsLoading ? "opacity-70" : "opacity-100"}`}
            >
              {!loading ? (
                <Text className="text-lg font-medium text-primary-500">
                  Submit Application
                </Text>
              ) : (
                <ActivityIndicator size="small" color="#F16B44" />
              )}
            </Pressable>
          </View>
        </View>

        {Platform.OS === "android" && isBirthDatePickerOpen ? (
          <DateTimePicker
            value={birthDatePickerValue}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(_event, selectedDate) => {
              closeBirthDatePicker();

              if (selectedDate) {
                handleBirthDateChange(selectedDate);
              }
            }}
          />
        ) : null}

        <Modal
          visible={Platform.OS === "ios" && isBirthDatePickerOpen}
          transparent
          animationType="slide"
          onRequestClose={closeBirthDatePicker}
        >
          <View className="justify-end flex-1 bg-black/20">
            <Pressable onPress={closeBirthDatePicker} className="flex-1" />
            <View className="px-5 pt-4 pb-8 bg-white rounded-t-3xl">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold text-brandBlack-900">
                  Select Birthdate
                </Text>

                <Pressable onPress={closeBirthDatePicker}>
                  <Text className="text-base font-medium text-primary-500">
                    Done
                  </Text>
                </Pressable>
              </View>

              <DateTimePicker
                value={birthDatePickerValue}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={(_event, selectedDate) => {
                  if (selectedDate) {
                    handleBirthDateChange(selectedDate);
                  }
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default VendorApplicationFormScreen;
