import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import AuthBackground from "@/src/assets/authBackground.png";
import PhilippineFlag from "@/src/assets/philippineFlag.png";
import IconGoogle from "@/src/assets/iconGoogle.png";
import IconFacebook from "@/src/assets/iconFacebook.png";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const LoginScreen = () => {
  const countryCallingCode = "+63";
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

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
          <View className="justify-between flex-1">
            {/* ===== MAIN CONTENT ===== */}
            <View>
              {/* Header */}
              <View className="mb-8">
                <Text className="text-3xl font-semibold">
                  Login your account
                </Text>

                <Text className="text-xl text-primary-500">
                  Your market access starts here.
                </Text>
              </View>

              {/* Login Fields */}
              <View className="mb-2">
                <View className="gap-4">
                  {/* Mobile Number */}
                  <TextInput
                    placeholder="Mobile Number"
                    placeholderTextColor="#b5b5b5"
                    keyboardType="phone-pad"
                    className="w-full p-4 text-lg border rounded-md border-white-600"
                  />

                  {/* Password Field */}
                  <View className="relative">
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor="#b5b5b5"
                      secureTextEntry={!passwordVisible}
                      className="w-full p-4 pr-12 text-lg border rounded-md border-white-600"
                    />

                    {/* Eye Icon */}
                    <Pressable
                      onPress={() => setPasswordVisible(!passwordVisible)}
                      className="absolute -translate-y-1/2 right-4 top-1/2"
                    >
                      <Ionicons
                        name={passwordVisible ? "eye-off" : "eye"}
                        size={22}
                        color="#b5b5b5"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>

              <View className="flex-row justify-end mb-6">
                <Text className="text-xl text-primary-500">
                  Forgot Password?
                </Text>
              </View>

              {/* Register Button */}
              <Pressable
                className="py-4 rounded-md bg-primary-500"
                onPress={() => {}}
              >
                <Text className="text-lg font-semibold text-center text-white">
                  Login
                </Text>
              </Pressable>

              {/* Divider */}
              <View className="flex-row items-center my-10">
                <View className="flex-1 h-[1px] bg-black-100" />
                <Text className="mx-4 text-white-700">Or login with</Text>
                <View className="flex-1 h-[1px] bg-black-100" />
              </View>

              {/* Social Signup */}
              <View className="gap-4">
                <Pressable className="relative items-center justify-center py-4 border rounded-md border-white-600">
                  <Image
                    source={IconGoogle}
                    className="absolute w-5 h-5 left-4"
                    resizeMode="contain"
                  />
                  <Text className="text-lg font-semibold text-center">
                    Continue with Google
                  </Text>
                </Pressable>

                <Pressable className="relative items-center justify-center py-4 border rounded-md border-white-600">
                  <Image
                    source={IconFacebook}
                    className="absolute w-5 h-5 left-4"
                    resizeMode="contain"
                  />
                  <Text className="text-lg font-semibold text-center">
                    Continue with Facebook
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* ===== FOOTER (FLOATING AT BOTTOM) ===== */}
            <View className="flex-row items-center justify-center pb-10">
              <Text className="mr-1 text-xl">Don’t have an account?</Text>
              <Link href="/(auth)/register" replace className="text-lg">
                Register
              </Link>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
