import React from "react";
import { View } from "react-native";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

const VendorOrdersLoadingSkeleton = () => {
  return (
    <View className="gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <View
          key={index}
          className="p-4 bg-white border rounded-md border-brandBlack-50"
        >
          {/* Top Row */}
          <View className="flex-row items-start justify-between mb-6">
            <View className="flex-1 pr-3">
              <Skeleton width={116} height={18} borderRadius={999} />

              <View className="mt-2">
                <Skeleton width={140} height={14} borderRadius={999} />
              </View>
            </View>

            <Skeleton width={88} height={28} borderRadius={999} />
          </View>

          {/* Products */}
          <View className="gap-3 mb-4">
            {Array.from({ length: 2 }).map((__, itemIndex) => (
              <View key={itemIndex} className="flex-row items-center">
                <Skeleton width={52} height={52} borderRadius={8} />

                <View className="flex-1 ml-3">
                  <Skeleton width={132} height={14} borderRadius={999} />

                  <View className="mt-2">
                    <Skeleton width={72} height={10} borderRadius={999} />
                  </View>

                  <View className="mt-2">
                    <Skeleton width={64} height={12} borderRadius={999} />
                  </View>
                </View>

                <Skeleton width={44} height={12} borderRadius={999} />
              </View>
            ))}
          </View>

          {/* Total */}
          <View className="flex-row items-center justify-between mb-4">
            <Skeleton width={100} height={16} borderRadius={999} />
            <Skeleton width={84} height={16} borderRadius={999} />
          </View>

          {/* Date and Payment */}
          <View className="flex-row items-center justify-between mb-5">
            <Skeleton width={124} height={12} borderRadius={999} />

            <View className="flex-row items-center gap-1">
              <Skeleton width={24} height={24} borderRadius={6} />
              <Skeleton width={96} height={12} borderRadius={999} />
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <Skeleton width="48%" height={40} borderRadius={6} />
            <Skeleton width="48%" height={40} borderRadius={6} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default VendorOrdersLoadingSkeleton;
