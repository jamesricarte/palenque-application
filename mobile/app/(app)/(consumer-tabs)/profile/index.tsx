import { View, Text, Pressable } from "react-native";
import React from "react";
import { supabase } from "@/src/config/supabaseClient";

const OrdersScreen = () => {
  return (
    <View className="items-center justify-center flex-1 gap-2">
      <Text>Profile Tab</Text>
      <Pressable
        onPress={async () => {
          await supabase.auth.signOut();
        }}
        className="px-4 py-1 bg-blue-500 rounded-md"
      >
        <Text className="text-lg font-semibold text-center text-white">
          Logout
        </Text>
      </Pressable>
    </View>
  );
};

export default OrdersScreen;
