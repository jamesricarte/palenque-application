import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import AuthBackground from "@/src/assets/authBackground.png";
import PhilippineFlag from "@/src/assets/philippineFlag.png";
import IconGoogle from "@/src/assets/iconGoogle.png";
import IconFacebook from "@/src/assets/iconFacebook.png";

import { useRegister } from "@/src/features/auth/useRegister";
import { StatusBar } from "expo-status-bar";

const RegisterScreen = () => {
  const {
    countryCallingCode,
    phone,
    setPhone,
    loading,
    signUpWithPhone,
    error,
  } = useRegister();

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
                  Create your account
                </Text>

                <Text className="text-xl text-primary-500">
                  Be part of something fresh.
                </Text>
              </View>

              {/* Phone Input */}
              <View className="mb-6">
                <View className="flex-row gap-2">
                  <View className="flex-row items-center justify-center gap-1 px-3 py-2 rounded-md bg-white-600">
                    <Image
                      source={PhilippineFlag}
                      className="w-5 h-5"
                      resizeMode="contain"
                    />
                    <Text className="text-lg font-semibold">
                      {countryCallingCode}
                    </Text>
                  </View>

                  <TextInput
                    placeholder="Mobile Number"
                    placeholderTextColor="#b5b5b5"
                    keyboardType="phone-pad"
                    className={`flex-1 p-4 text-lg border rounded-md ${error ? "border-red-500" : "border-white-600"}`}
                    value={phone}
                    onChangeText={(value) => setPhone(value)}
                  />
                </View>
              </View>

              {error && <Text className="mb-6 text-red-500">{error}</Text>}

              {/* Register Button */}
              <Pressable
                className={`py-4 rounded-md ${!loading ? "bg-primary-500" : "bg-gray-300"} `}
                onPress={signUpWithPhone}
              >
                {!loading ? (
                  <Text className="text-lg font-semibold text-center text-white">
                    Continue
                  </Text>
                ) : (
                  <ActivityIndicator size="small" color="white" />
                )}
              </Pressable>

              {/* Divider */}
              <View className="flex-row items-center my-10">
                <View className="flex-1 h-[1px] bg-black-100" />
                <Text className="mx-4 text-white-700">Or register with</Text>
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
              <Text className="mr-1 text-xl">Already have an account?</Text>
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
