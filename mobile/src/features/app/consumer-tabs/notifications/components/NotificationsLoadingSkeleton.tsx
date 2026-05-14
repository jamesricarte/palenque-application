import React from "react";
import { View } from "react-native";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

const NotificationsLoadingSkeleton = () => {
  return (
    <View>
      {Array.from({ length: 3 }).map((_, index) => (
        <View key={index} className="px-5 py-4 border-b border-white-600">
          <Skeleton width={140} height={18} borderRadius={999} />

          <View className="mt-3">
            <Skeleton width="100%" height={12} borderRadius={999} />
          </View>

          <View className="mt-2">
            <Skeleton width="82%" height={12} borderRadius={999} />
          </View>

          <View className="mt-3">
            <Skeleton width={84} height={10} borderRadius={999} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default NotificationsLoadingSkeleton;
