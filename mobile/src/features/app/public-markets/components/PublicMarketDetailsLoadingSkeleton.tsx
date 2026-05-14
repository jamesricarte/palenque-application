import React from "react";
import { View } from "react-native";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

const PublicMarketDetailsLoadingSkeleton = () => {
  return (
    <>
      <View className="overflow-hidden rounded-[24px]">
        <Skeleton width="100%" height={192} borderRadius={24} />
      </View>

      <View className="mt-7">
        <Skeleton width={132} height={20} borderRadius={999} />

        <View className="flex-row gap-4 mt-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <View
              key={index}
              className="bg-white border rounded-lg border-white-600"
              style={{ width: 190 }}
            >
              <Skeleton width="100%" height={112} borderRadius={8} />

              <View className="px-4 py-3">
                <Skeleton width={104} height={14} borderRadius={999} />

                <View className="mt-2">
                  <Skeleton width={88} height={10} borderRadius={999} />
                </View>

                <View className="mt-3">
                  <Skeleton width={64} height={12} borderRadius={999} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-7">
        <Skeleton width={176} height={20} borderRadius={999} />

        <View className="gap-3 mt-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <View
              key={index}
              className="flex-row items-center px-4 py-4 bg-white border rounded-2xl border-white-600"
            >
              <Skeleton width={48} height={48} borderRadius={999} />

              <View className="flex-1 ml-3">
                <Skeleton width={136} height={16} borderRadius={999} />

                <View className="mt-2">
                  <Skeleton width="92%" height={10} borderRadius={999} />
                </View>

                <View className="mt-2">
                  <Skeleton width="68%" height={10} borderRadius={999} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );
};

export default PublicMarketDetailsLoadingSkeleton;
