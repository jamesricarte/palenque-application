import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

const MyProfileScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <Pressable onPress={() => {}}>
          <Text className="text-2xl font-semibold">
            Palenque
            <Text className="text-primary-500">Mart</Text>
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {}}
          className="items-center justify-center w-10 h-10"
          hitSlop={10}
        >
          <Ionicons name="cube-outline" size={26} color="#1f2933" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default MyProfileScreen;
