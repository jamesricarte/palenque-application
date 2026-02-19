import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import axios from "axios";
import * as Crypto from "expo-crypto";
import AuthBackground from "../../assets/authBackground.png";

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

    try {
      const response = await axios.post(
        "https://bprcrthwboowrexrvplu.supabase.co/functions/v1/generate-otp",
        {
          phone: `${countryCallingCode + phone}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        },
      );

      prettyLog("Otp generated:", response.data);
    } catch (error: any) {
      prettyLog("Error generating otp:", error?.response?.data || error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top Section */}
      <View className="h-[30%]">
        <Image
          source={AuthBackground}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Bottom Section */}
      <View className="absolute top-[20%] left-0 right-0 bg-white rounded-t-[30px] h-screen">
        <View className="mx-6 mt-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-semibold">Create your account</Text>

            <Text className="text-xl text-primary-500">
              Be part of something fresh.
            </Text>
          </View>

          {/* Phone Input */}
          <View className="mb-6">
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
          </View>

          {/* Register Button */}
          <TouchableOpacity
            className="py-4 mb-6 bg-primary-500 rounded-xl"
            onPress={signUpWithPhone}
          >
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

          {/* Social Signup */}
          <View className="gap-3">
            <TouchableOpacity className="py-4 border border-gray-300 rounded-xl">
              <Text className="font-medium text-center">
                Sign up with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="py-4 border border-gray-300 rounded-xl">
              <Text className="font-medium text-center">
                Sign up with Facebook
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-10">
            <Text className="mr-1 text-gray-500">Already have an account?</Text>
            <Link
              href="/(auth)/login"
              replace
              className="font-semibold text-black"
            >
              Login
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;
