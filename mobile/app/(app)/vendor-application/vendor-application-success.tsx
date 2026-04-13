import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const VendorApplicationSuccessScreen = () => {
  const handleGoBackHome = () => {
    router.replace("/(app)/(consumer-tabs)/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 px-5">
        {/* Header */}
        <View className="flex-row items-center px-5 py-4 -mx-5 border-b border-[#E9E9E9]">
          <Text className="text-[18px] font-semibold text-[#222222]">
            Application Review
          </Text>
        </View>

        {/* Content */}
        <View className="items-center justify-center flex-1 pb-32">
          <View className="items-center w-full">
            <View className="items-center justify-center mb-8 rounded-full w-36 h-36 bg-secondary-500">
              <Ionicons name="search-outline" size={72} color="white" />
            </View>

            <Text className="text-lg leading-7 text-center text-[#CFCFCF]">
              Your application is being reviewed.
            </Text>

            <Text className="text-lg leading-7 text-center text-[#CFCFCF]">
              This process usually takes 24-48 hours.
            </Text>
          </View>

          <View className="w-full mt-8">
            <Pressable
              onPress={handleGoBackHome}
              className="py-4 rounded-md bg-primary-500"
            >
              <Text className="text-lg font-semibold text-center text-white">
                Back to Home
              </Text>
            </Pressable>

            <Text className="mt-4 text-lg text-center text-brandBlack-500">
              We&apos;ll notify you once approved.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VendorApplicationSuccessScreen;
