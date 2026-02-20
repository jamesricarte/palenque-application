import { View, Text, TextInput, TouchableOpacity, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import AuthBackground from "../../assets/authBackground.png";
import PhilippineFlag from "../../assets/philippineFlag.png";
import IconGoogle from "../../assets/iconGoogle.png";
import IconFacebook from "../../assets/iconFacebook.png";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
  const countryCallingCode = "+63";
  const [passwordVisible, setPasswordVisible] = useState(false);

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
                Login your account
              </Text>

              <Text className="text-primary-500 text-xl">
                Your market access starts here.
              </Text>
            </View>

            {/* Login Fields */}
           <View className="mb-6">
              <View className="gap-4">

                {/* Mobile Number */}
                <TextInput
                  placeholder="Mobile Number"
                  placeholderTextColor="#b5b5b5"
                  keyboardType="phone-pad"
                  className="w-full text-lg border border-white-600 rounded-md p-4"
                />

                {/* Password Field */}
                <View className="relative">

                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#b5b5b5"
                    secureTextEntry={!passwordVisible}
                    className="w-full text-lg border border-white-600 rounded-md p-4 pr-12"
                  />

                  {/* Eye Icon */}
                  <Pressable
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
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

            {/* Register Button */}
            <Pressable
              className="py-4 bg-primary-500 rounded-md"
              onPress={()=> {}}
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
          <View className="flex-row justify-center items-center pb-10">
            <Text className="mr-1 text-lg">Don’t have an account?</Text>
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
