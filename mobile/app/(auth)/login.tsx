import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";

const LoginScreen = () => {
  const countryCallingCode = "+63";

  return (
    <View className="justify-center flex-1 px-6 bg-white">
      {/* Header */}
      <View className="mb-10">
        <Text className="text-3xl font-bold text-gray-900">
          Welcome back 👋
        </Text>
        <Text className="mt-2 text-gray-500">
          Login with your mobile number to continue shopping
        </Text>
      </View>

      {/* Phone Input */}
      <View className="mb-6">
        <Text className="mb-2 font-medium text-gray-700">Mobile Number</Text>
        <View className="flex-row items-center px-4 py-3 border border-gray-300 rounded-xl">
          <Text className="mr-2 text-gray-600">{countryCallingCode}</Text>
          <TextInput
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
            className="flex-1 text-gray-900"
          />
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity className="py-4 mb-6 bg-black rounded-xl">
        <Text className="text-lg font-semibold text-center text-white">
          Continue
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-[1px] bg-gray-200" />
        <Text className="mx-4 text-gray-400">OR</Text>
        <View className="flex-1 h-[1px] bg-gray-200" />
      </View>

      {/* Social Login */}
      <View className="gap-3">
        <TouchableOpacity className="py-4 border border-gray-300 rounded-xl">
          <Text className="font-medium text-center">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity className="py-4 border border-gray-300 rounded-xl">
          <Text className="font-medium text-center">
            Continue with Facebook
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="flex-row justify-center mt-10">
        <Text className="mr-1 text-gray-500">New here?</Text>
        <Link
          href="/(auth)/register"
          replace
          className="font-semibold text-black"
        >
          Create an account
        </Link>
      </View>
    </View>
  );
};

export default LoginScreen;
