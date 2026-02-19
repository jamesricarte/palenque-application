import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import axios from "axios";
import * as Crypto from "expo-crypto";

import { supabase } from "@/config/supabaseClient";

const RegisterScreen = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const countryCallingCode: string = "+63";

  const signUpWithPhone = async () => {
    if (error) setError("");

    if (!phone) {
      console.error("Empty phone number!");
      setError("The mobile number should not be empty.");
      return;
    }

    // otp generation
    const code = await Crypto.getRandomBytesAsync(4);
    const num =
      ((code[0] << 24) | (code[1] << 16) | (code[2] << 8) | code[3]) %
      1_000_000;
    const otp = num.toString().padStart(6, "0");

    try {
      const response = await axios.post(
        "https://sms-api-ph-gceo.onrender.com/send/sms",
        {
          recipient: `${countryCallingCode + phone}`,
          message: `Your verification code is ${otp}`,
        },
        {
          headers: {
            "x-api-key": "sk-8ea40031593fed87ac91b34f",
            "Content-Type": "application/json",
          },
        },
      );

      prettyLog("Success sending sms:", response.data);
    } catch (error: any) {
      console.error("Error sending sms:", error?.response?.data || error);
    }
  };

  return (
    <View className="justify-center flex-1 px-6 bg-white">
      {/* Header */}
      <View className="mb-10">
        <Text className="text-3xl font-bold text-gray-900">
          Create account ✨
        </Text>
        <Text className="mt-2 text-gray-500">
          Sign up using your mobile number
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
            value={phone}
            onChangeText={(value) => setPhone(value)}
          />
        </View>

        {error && <Text className="mt-6 text-red-500">{error}</Text>}
      </View>

      {/* Register Button */}
      <TouchableOpacity
        className="py-4 mb-6 bg-black rounded-xl"
        onPress={signUpWithPhone}
      >
        <Text className="text-lg font-semibold text-center text-white">
          Send OTP
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-[1px] bg-gray-200" />
        <Text className="mx-4 text-gray-400">OR</Text>
        <View className="flex-1 h-[1px] bg-gray-200" />
      </View>

      {/* Social Signup */}
      <View className="gap-3">
        <TouchableOpacity className="py-4 border border-gray-300 rounded-xl">
          <Text className="font-medium text-center">Sign up with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity className="py-4 border border-gray-300 rounded-xl">
          <Text className="font-medium text-center">Sign up with Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="flex-row justify-center mt-10">
        <Text className="mr-1 text-gray-500">Already have an account?</Text>
        <Link href="/(auth)/login" replace className="font-semibold text-black">
          Login
        </Link>
      </View>
    </View>
  );
};

export default RegisterScreen;
