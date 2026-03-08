import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { useVendorApplicationForm } from "@/src/features/app/vendor-application/useVendorApplicationForm";

const VendorApplicationFormScreen = () => {
  const { form, loading, error, handleBack, handleChange, handleSubmit } =
    useVendorApplicationForm();

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

          {/* Stall / Store Location */}
          <View className="mb-4">
            <Text className="mb-2 text-base font-semibold">
              Stall / Store Location
            </Text>
            <TextInput
              placeholder="Enter market or store location"
              placeholderTextColor="#b5b5b5"
              className="p-4 text-base border rounded-md border-white-600"
              value={form.location}
              onChangeText={(value) => handleChange("location", value)}
            />
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
              textAlignVertical="top"
              className="p-4 text-base border rounded-md border-white-600 min-h-[120px]"
              value={form.description}
              onChangeText={(value) => handleChange("description", value)}
            />
          </View>

          {error && <Text className="mb-4 text-red-500">{error}</Text>}

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            className={`py-4 rounded-md ${!loading ? "bg-primary-500" : "bg-gray-300"}`}
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
