import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useCreatePassword } from "@/src/features/auth/useCreatePassword";
import { SafeAreaView } from "react-native-safe-area-context";

const CreatePasswordScreen = () => {
  const router = useRouter();

  const [hasTyped, setHasTyped] = useState(false);

  const {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    showPassword,
    showConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    loading,
    error,
    setError,
    isComplete,
    requirements,
    handleConfirm,
  } = useCreatePassword();

  const RequirementRow = ({ met, label }: { met: boolean; label: string }) => (
    <View className="flex-row items-center mt-2">
      <Ionicons
        name={met ? "checkmark-circle" : "close-circle"}
        size={18}
        color={met ? "#06b6d4" : "#b5b5b5"}
      />
      <Text
        className={`ml-2 text-sm ${met ? "text-primary-500" : "text-white-600"}`}
      >
        {label}
      </Text>
    </View>
  );

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

          <Text className="text-base text-black">Step 2 of 3</Text>
        </View>

        {/* Content */}
        <View className="mt-10">
          <Text className="text-3xl font-semibold">Create your password</Text>
          <Text className="mt-2 text-xl text-primary-500">
            Enter your password.
          </Text>

          {/* Password */}
          <View className="relative mt-8">
            <TextInput
              value={password}
              onChangeText={(t) => {
                if (error) setError("");
                if (!hasTyped) setHasTyped(true);
                setPassword(t);
              }}
              placeholder="Password"
              placeholderTextColor="#b5b5b5"
              secureTextEntry={!showPassword}
              className={`w-full text-lg border  rounded-md p-4 pr-12 ${
                error ? "border-red-500" : "border-white-600"
              }`}
            />

            <Pressable
              onPress={toggleShowPassword}
              className="absolute -translate-y-1/2 right-4 top-1/2"
              hitSlop={10}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#b5b5b5"
              />
            </Pressable>
          </View>

          {/* Confirm Password */}
          <View className="relative mt-4">
            <TextInput
              value={confirmPassword}
              onChangeText={(t) => {
                if (error) setError("");
                if (!hasTyped) setHasTyped(true);
                setConfirmPassword(t);
              }}
              placeholder="Confirm Password"
              placeholderTextColor="#b5b5b5"
              secureTextEntry={!showConfirmPassword}
              className={`w-full text-lg border  rounded-md p-4 pr-12 ${
                error ? "border-red-500" : "border-white-600"
              }`}
            />

            <Pressable
              onPress={toggleShowConfirmPassword}
              className="absolute -translate-y-1/2 right-4 top-1/2"
              hitSlop={10}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={22}
                color="#b5b5b5"
              />
            </Pressable>
          </View>

          {hasTyped ? (
            <View className="mt-4">
              <Text className="text-sm text-white-600">
                Password must have:
              </Text>

              <RequirementRow
                met={requirements.minLength}
                label="At least 8 characters"
              />
              <RequirementRow
                met={requirements.hasLowercase}
                label="At least 1 lowercase letter"
              />
              <RequirementRow
                met={requirements.hasUppercase}
                label="At least 1 uppercase letter"
              />
              <RequirementRow
                met={requirements.hasDigit}
                label="At least 1 digit"
              />
              <RequirementRow
                met={requirements.hasSymbol}
                label="At least 1 symbol"
              />
              <RequirementRow
                met={requirements.passwordsMatch}
                label="Passwords match"
              />
            </View>
          ) : null}

          {error ? <Text className="mt-4 text-red-500">{error}</Text> : null}

          {/* Confirm button */}
          <Pressable
            className={`mt-8 py-4 rounded-md ${
              !loading ? "bg-primary-500" : "bg-gray-300"
            }`}
            onPress={handleConfirm}
            disabled={loading}
          >
            {!loading ? (
              <Text className="text-lg font-semibold text-center text-white">
                Confirm
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

export default CreatePasswordScreen;
