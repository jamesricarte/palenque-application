import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useVerifyNumber } from "@/src/features/auth/useVerifyNumber";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const VerifyNumberScreen = () => {
  const {
    router,
    countryCallingCode,
    phone,
    digits,
    inputRefs,
    handleChange,
    handleKeyPress,
    error,
    loading,
    handleVerify,
    handleResend,
    resendTimeout,
  } = useVerifyNumber();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 mx-6">
        {/* Top bar */}
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="items-center justify-center w-10 h-10 rounded-full bg-white-600"
          >
            <Ionicons name="chevron-back" size={24} color="#b5b5b5" />
          </Pressable>

          <Text className="text-base text-black">Step 1 of 3</Text>
        </View>

        {/* Content */}
        <View className="mt-10">
          <Text className="text-3xl font-semibold">Verify your number</Text>
          <Text className="mt-2 text-xl text-primary-500">
            Enter the 6-digit code sent to your mobile.
          </Text>

          <Text className="mt-8 text-base text-white-700">
            Code sent to{" "}
            <Text className="font-semibold text-black">
              {countryCallingCode} {phone?.replace("+63", "")}
            </Text>
          </Text>

          {/* OTP boxes */}
          <View className="flex-row justify-between mt-5">
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={(ref) => {
                  inputRefs.current[i] = ref;
                }}
                value={d}
                onChangeText={(v) => handleChange(i, v)}
                onKeyPress={(e) => handleKeyPress(i, e)}
                keyboardType="number-pad"
                maxLength={1}
                className={`w-[14%] h-14 text-xl text-center border rounded-md ${
                  error ? "border-red-500" : "border-white-600"
                }`}
                returnKeyType="done"
              />
            ))}
          </View>

          {error ? <Text className="mt-4 text-red-500">{error}</Text> : null}

          {/* Verify button */}
          <Pressable
            className={`mt-8 py-4 rounded-md ${
              !loading ? "bg-primary-500" : "bg-gray-300"
            }`}
            onPress={handleVerify}
            disabled={loading}
          >
            {!loading ? (
              <Text className="text-lg font-semibold text-center text-white">
                Verify Code
              </Text>
            ) : (
              <ActivityIndicator size="small" color="white" />
            )}
          </Pressable>

          {/* Resend */}

          <Pressable
            onPress={handleResend}
            disabled={loading || resendTimeout > 0}
            className="items-center mt-5"
          >
            <Text className="text-lg text-white-700">
              {resendTimeout > 0
                ? `Resend in ${resendTimeout} secs`
                : "Resend Verification Code"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyNumberScreen;
