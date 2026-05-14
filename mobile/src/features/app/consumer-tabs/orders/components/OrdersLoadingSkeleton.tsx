import React from "react";
import { View } from "react-native";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

const OrdersLoadingSkeleton = () => {
  return (
    <View className="gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <View
          key={index}
          className="p-4 bg-white border rounded-md border-brandBlack-50"
        >
          <View className="flex-row items-start justify-between mb-4">
            <View>
              <Skeleton width={120} height={18} borderRadius={999} />
            </View>

            <Skeleton width={88} height={28} borderRadius={999} />
          </View>

          <View className="gap-3 mb-4">
            <View className="flex-row items-center gap-2">
              <Skeleton width={32} height={32} borderRadius={999} />
              <Skeleton width={108} height={12} borderRadius={999} />
            </View>

            <View className="flex-row items-center">
              <Skeleton width={52} height={52} borderRadius={8} />

              <View className="flex-1 ml-3">
                <Skeleton width={132} height={14} borderRadius={999} />

                <View className="mt-2">
                  <Skeleton width={88} height={10} borderRadius={999} />
                </View>

                <View className="mt-2">
                  <Skeleton width={64} height={12} borderRadius={999} />
                </View>
              </View>

              <Skeleton width={52} height={12} borderRadius={999} />
            </View>
          </View>

          <View className="flex-row items-center justify-between pt-4 border-t border-white-600">
            <View>
              <Skeleton width={76} height={10} borderRadius={999} />

              <View className="mt-2">
                <Skeleton width={96} height={16} borderRadius={999} />
              </View>
            </View>

            <Skeleton width={72} height={28} borderRadius={8} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default OrdersLoadingSkeleton;
