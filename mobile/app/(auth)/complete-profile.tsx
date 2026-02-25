import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCompleteProfile } from "@/src/features/auth/useCompleteProfile";
import { SafeAreaView } from "react-native-safe-area-context";

const CompleteProfileScreen = () => {
  const router = useRouter();

  const {
    firstName,
    lastName,
    email,
    deliveryAddress,
    setFirstName,
    setLastName,
    setEmail,
    setDeliveryAddress,
    loading,
    error,
    setError,
    isComplete,
    handleSave,
  } = useCompleteProfile();

  const inputBorder = error ? "border-red-500" : "border-white-600";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 mx-6">
        {/* Top bar */}
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="items-center justify-center w-10 h-10 rounded-full bg-white-600"
          >
            <Ionicons name="chevron-back" size={24} color="#b5b5b5" />
          </Pressable>

          <Text className="text-base text-black">Step 3 of 3</Text>
        </View>

        {/* Content */}
        <View className="mt-10">
          <Text className="text-3xl font-semibold">Complete your profile</Text>
          <Text className="mt-2 text-xl text-primary-500">
            Enter the required details.
          </Text>

          {/* First Name */}
          <TextInput
            value={firstName}
            onChangeText={(t) => {
              if (error) setError("");
              setFirstName(t);
            }}
            placeholder="First Name"
            placeholderTextColor="#b5b5b5"
            className={`w-full text-lg border border-white-600 rounded-md p-4 pr-12 mt-8 ${inputBorder}`}
            autoCapitalize="words"
          />

          {/* Last Name */}
          <TextInput
            value={lastName}
            onChangeText={(t) => {
              if (error) setError("");
              setLastName(t);
            }}
            placeholder="Last Name"
            placeholderTextColor="#b5b5b5"
            className={`w-full text-lg border border-white-600 rounded-md p-4 pr-12 mt-4 ${inputBorder}`}
            autoCapitalize="words"
          />

          {/* Email (Optional) */}
          <TextInput
            value={email}
            onChangeText={(t) => {
              if (error) setError("");
              setEmail(t);
            }}
            placeholder="Email Address (Optional)"
            placeholderTextColor="#b5b5b5"
            keyboardType="email-address"
            autoCapitalize="none"
            className={`w-full text-lg border border-white-600 rounded-md p-4 pr-12 mt-4 ${inputBorder}`}
          />

          {/* Delivery Address with icon */}
          <View className="relative mt-4">
            <TextInput
              value={deliveryAddress}
              onChangeText={(t) => {
                if (error) setError("");
                setDeliveryAddress(t);
              }}
              placeholder="Delivery Address"
              placeholderTextColor="#b5b5b5"
              className={`w-full text-lg border border-white-600 rounded-md p-4 pr-12 ${inputBorder}`}
            />

            <View className="absolute -translate-y-1/2 right-4 top-1/2">
              <Ionicons name="location" size={22} color="#b5b5b5" />
            </View>
          </View>

          {error ? <Text className="mt-4 text-red-500">{error}</Text> : null}

          {/* Save button */}
          <Pressable
            className={`mt-8 py-4 rounded-md ${
              !loading ? "bg-primary-500" : "bg-gray-300"
            }`}
            onPress={handleSave}
            disabled={loading}
          >
            {!loading ? (
              <Text className="text-lg font-semibold text-center text-white">
                Save &amp; Continue
              </Text>
            ) : (
              <ActivityIndicator size="small" color="white" />
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CompleteProfileScreen;
