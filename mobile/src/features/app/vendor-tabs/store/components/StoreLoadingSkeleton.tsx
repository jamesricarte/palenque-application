import React from "react";
import { View } from "react-native";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

const StoreLoadingSkeleton = () => {
  return (
    <View className="px-5">
      <View className="p-4 mt-2 bg-white border rounded-md border-white-600">
        <Skeleton width={144} height={18} borderRadius={999} />

        <View className="mt-3">
          <Skeleton width="100%" height={12} borderRadius={999} />
        </View>

        <View className="mt-2">
          <Skeleton width="70%" height={12} borderRadius={999} />
        </View>
      </View>

      <View className="p-4 mt-4 bg-white border rounded-md border-white-600">
        <Skeleton width={120} height={16} borderRadius={999} />

        <View className="mt-4">
          <Skeleton width="100%" height={44} borderRadius={8} />
        </View>

        <View className="mt-3">
          <Skeleton width="100%" height={44} borderRadius={8} />
        </View>

        <View className="mt-3">
          <Skeleton width="100%" height={96} borderRadius={8} />
        </View>
      </View>
    </View>
  );
};

export default StoreLoadingSkeleton;
