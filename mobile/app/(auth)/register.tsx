import { View, Text, TextInput, TouchableOpacity, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import axios from "axios";
import * as Crypto from "expo-crypto";
import AuthBackground from "../../assets/authBackground.png";
import PhilippineFlag from "../../assets/philippineFlag.png";
import IconGoogle from "../../assets/iconGoogle.png";
import IconFacebook from "../../assets/iconFacebook.png";

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
    <View className="absolute top-[20%] left-0 right-0 bottom-0 bg-white rounded-t-[30px]">

      <View className="flex-1 mx-6 mt-10">

        {/* This wrapper pushes footer to bottom */}
        <View className="flex-1 justify-between">

          {/* ===== MAIN CONTENT ===== */}
          <View>

            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-semibold">
                Create your account
              </Text>

              <Text className="text-primary-500 text-xl">
                Be part of something fresh.
              </Text>
            </View>

            {/* Phone Input */}
            <View className="mb-6">
              <View className="flex-row gap-2">

                <View className="flex-row items-center justify-center gap-1 bg-white-600 rounded-md px-3 py-2">
                  <Image
                    source={PhilippineFlag}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                  <Text className="font-semibold text-lg">
                    {countryCallingCode}
                  </Text>
                </View>

                <TextInput
                  placeholder="Mobile Number"
                  placeholderTextColor="#b5b5b5"
                  keyboardType="phone-pad"
                  className="flex-1 text-lg border border-white-600 rounded-md p-4"
                  value={phone}
                  onChangeText={(value) => setPhone(value)}
                />
              </View>
            </View>

            {/* Register Button */}
            <Pressable
              className="py-4 bg-primary-500 rounded-md"
              onPress={signUpWithPhone}
            >
              <Text className="text-lg font-semibold text-center text-white">
                Continue
              </Text>
            </Pressable>

            {/* Divider */}
            <View className="flex-row items-center my-10">
              <View className="flex-1 h-[1px] bg-black-100" />
              <Text className="mx-4 text-white-700">Or register with</Text>
              <View className="flex-1 h-[1px] bg-black-100" />
            </View>

            {/* Social Signup */}
            <View className="gap-6">
              <Pressable className="py-4 border border-white-600 rounded-md justify-center items-center relative">
                <Image
                  source={IconGoogle}
                  className="w-5 h-5 absolute left-4"
                  resizeMode="contain"
                />
                <Text className="font-semibold text-center text-lg">
                  Continue with Google
                </Text>
              </Pressable>

              <Pressable className="py-4 border border-white-600 rounded-md justify-center items-center relative">
                <Image
                  source={IconFacebook}
                  className="w-5 h-5 absolute left-4"
                  resizeMode="contain"
                />
                <Text className="font-semibold text-center text-lg">
                  Continue with Facebook
                </Text>
              </Pressable>
            </View>

          </View>

          {/* ===== FOOTER (FLOATING AT BOTTOM) ===== */}
          <View className="flex-row justify-center items-center pb-20">
            <Text className="mr-1 text-lg">Already have an account?</Text>
            <Link href="/(auth)/login" replace className="text-lg">
              Login
            </Link>
          </View>

        </View>

      </View>
    </View>

  </View>
  );
};

export default RegisterScreen;
