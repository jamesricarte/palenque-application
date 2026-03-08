import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const VendorApplicationSuccessScreen = () => {
  const handleGoBackHome = () => {
    router.replace("/(app)/(consumer-tabs)/profile");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 px-5">
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 -mx-5 border-b border-white-600">
          <Text className="text-lg font-semibold">Vendor Application</Text>
        </View>

        {/* Content */}
        <View className="items-center justify-center flex-1">
          <View className="items-center w-full">
            <View className="items-center justify-center mb-6 rounded-full w-28 h-28 bg-secondary-500">
              <Ionicons name="checkmark" size={70} color="white" />
            </View>

            <Text className="text-2xl font-semibold text-center">
              Application Submitted
            </Text>

            <Text className="mt-3 text-base leading-6 text-center text-white-700">
              Your vendor application has been submitted successfully. We will
              review your application and update you once it is approved.
            </Text>
          </View>
        </View>

        {/* Bottom Button */}
        <View className="pb-6">
          <Pressable
            onPress={handleGoBackHome}
            className="py-4 rounded-md bg-primary-500"
          >
            <Text className="text-lg font-semibold text-center text-white">
              Back to Profile
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VendorApplicationSuccessScreen;
