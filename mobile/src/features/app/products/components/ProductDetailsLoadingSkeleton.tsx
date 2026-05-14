import React from "react";
import { View } from "react-native";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

const ProductDetailsLoadingSkeleton = () => {
  return (
    <View className="flex-1">
      <Skeleton width="100%" height={250} borderRadius={0} />

      <View className="flex-1 px-5 py-4">
        <View className="flex-row items-start justify-between mb-3">
          <Skeleton width="62%" height={24} borderRadius={999} />
          <Skeleton width={72} height={18} borderRadius={999} />
        </View>

        <Skeleton width={92} height={28} borderRadius={8} />

        <View className="mt-7">
          <Skeleton width={156} height={20} borderRadius={999} />

          <View className="flex-row gap-2 mt-4">
            <Skeleton width={32} height={32} borderRadius={999} />
            <Skeleton width={124} height={18} borderRadius={999} />
          </View>
        </View>
      </View>

      {/* <View className="flex-row gap-3 px-5 py-5 bg-primary-500">
        <Skeleton width="48%" height={56} borderRadius={8} />
        <Skeleton width="48%" height={56} borderRadius={8} />
      </View> */}
    </View>
  );
};

export default ProductDetailsLoadingSkeleton;
