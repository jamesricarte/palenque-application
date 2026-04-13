import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useVendorApplication } from "@/src/features/app/vendor-application/useVendorApplication";
import { SafeAreaView } from "react-native-safe-area-context";

const VendorApplicationScreen = () => {
  const {
    handleBack,
    handleStartApplication,
    heroImageSource,
    existingApplication,
    loading,
  } = useVendorApplication();

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
        {loading ? (
          <View className="pt-6">
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : existingApplication ? (
          <View className="px-5 pt-6">
            {/* Title */}
            <View className="mb-8">
              <Text className="text-2xl font-semibold">
                Application Overview
              </Text>
              <Text className="mt-2 text-base text-secondary-500">
                You already have an existing vendor application in our system.
              </Text>
            </View>

            {/* Status Card */}
            <View className="mb-4 overflow-hidden bg-white border rounded-md border-white-600">
              <View className="px-4 py-3 border-b border-white-600">
                <Text className="text-base font-semibold">
                  Application Status
                </Text>
              </View>

              <View className="px-4 py-4">
                <View className="flex-row items-center gap-3">
                  <View className="items-center justify-center w-12 h-12 rounded-full bg-[#fef0ec]">
                    <Ionicons
                      name="document-text-outline"
                      size={24}
                      color="#f16b44"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-base font-semibold capitalize">
                      {existingApplication.status || "Pending"}
                    </Text>
                    <Text className="mt-1 text-base text-white-700">
                      We are currently reviewing your application details.
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Submitted Details */}
            <View className="mb-4 overflow-hidden bg-white border rounded-md border-white-600">
              <View className="px-4 py-3 border-b border-white-600">
                <Text className="text-base font-semibold">
                  Submitted Details
                </Text>
              </View>

              <View className="px-4 py-4">
                <View className="mb-4">
                  <Text className="mb-1 text-base font-semibold">
                    Market Location
                  </Text>
                  <Text className="text-base text-white-700">
                    {existingApplication.market_name || "Not provided"}
                  </Text>
                </View>

                <View className="h-[1px] mb-4 bg-white-600" />

                <View>
                  <Text className="mb-1 text-base font-semibold">
                    Short Description
                  </Text>
                  <Text className="text-base leading-6 text-white-700">
                    {existingApplication.description || "Not provided"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Information Card */}
            <View className="mb-8 overflow-hidden bg-white border rounded-md border-white-600">
              <View className="px-4 py-3 border-b border-white-600">
                <Text className="text-base font-semibold">
                  What happens next
                </Text>
              </View>

              <View className="gap-3 px-4 py-4">
                <View className="flex-row">
                  <Text className="mr-2 text-white-700">•</Text>
                  <Text className="flex-1 text-white-700">
                    Our team will review your submitted application.
                  </Text>
                </View>

                <View className="flex-row">
                  <Text className="mr-2 text-white-700">•</Text>
                  <Text className="flex-1 text-white-700">
                    You will be updated once your application has been approved.
                  </Text>
                </View>

                <View className="flex-row">
                  <Text className="mr-2 text-white-700">•</Text>
                  <Text className="flex-1 text-white-700">
                    For now, you do not need to submit another vendor
                    application.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className="px-5 pt-6">
            {/* Title */}
            <Text className="mb-4 text-2xl font-semibold">Become a Vendor</Text>

            {/* Hero Image */}
            <View className="mb-3 overflow-hidden rounded-lg bg-black-100">
              <Image
                source={heroImageSource}
                className="w-full h-[170px]"
                resizeMode="cover"
              />
            </View>

            {/* Description */}
            <Text className="mb-6 text-base text-secondary-500">
              Join our digital marketplace and connect with nearby customers
              looking for fresh products.
            </Text>

            {/* Benefits */}
            <Text className="mb-3 text-xl font-semibold">
              Partnership Benefits
            </Text>

            <View className="gap-2 mb-8">
              <View className="flex-row">
                <Text className="mr-2 text-white-700">•</Text>
                <Text className="text-white-700">
                  Accept orders through the app
                </Text>
              </View>

              <View className="flex-row">
                <Text className="mr-2 text-white-700">•</Text>
                <Text className="text-white-700">Reach nearby customers</Text>
              </View>

              <View className="flex-row">
                <Text className="mr-2 text-white-700">•</Text>
                <Text className="text-white-700">Increase daily sales</Text>
              </View>
            </View>

            {/* CTA Button */}
            <Pressable
              onPress={handleStartApplication}
              className="py-4 rounded-md bg-primary-500"
            >
              <Text className="text-lg font-semibold text-center text-white">
                Start Application
              </Text>
            </Pressable>

            <Text className="mt-4 text-center text-white-700">
              Our team will contact you within 24–48 hours.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorApplicationScreen;
