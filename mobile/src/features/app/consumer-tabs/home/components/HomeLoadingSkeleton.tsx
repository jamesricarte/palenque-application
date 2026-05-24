import React from "react";
import { View } from "react-native";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

const HomeLoadingSkeleton = () => {
  return (
    <View>
      {/* Categories */}
      <View className="pl-6 mt-5">
        <View>
          <View className="flex-row gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <View key={index} className="items-center">
                <View className="items-center justify-center w-16 h-16 rounded-full ">
                  <Skeleton width={56} height={56} borderRadius={999} />
                </View>

                <View className="mt-2">
                  <Skeleton width={44} height={10} borderRadius={999} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Nearby Public Markets */}
      <View className="pl-6 mt-6">
        <Skeleton width={160} height={16} borderRadius={999} />

        <View className="pt-4 pr-6">
          <View className="flex-row gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <View
                key={index}
                className="bg-white border rounded-lg border-white-600"
                style={{ width: 240 }}
              >
                {/* Image */}
                <Skeleton width="100%" height={112} borderRadius={8} />

                {/* Info */}
                <View className="px-4 py-3">
                  <Skeleton width={120} height={14} borderRadius={999} />

                  <View className="mt-2">
                    <Skeleton width={160} height={10} borderRadius={999} />
                  </View>

                  <View className="mt-3">
                    <Skeleton width={72} height={10} borderRadius={999} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Popular Items Near You */}
      <View className="pl-6 mt-6">
        <Skeleton width={148} height={16} borderRadius={999} />

        <View className="pt-4 pr-6">
          <View className="flex-row gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <View
                key={index}
                className="bg-white border rounded-lg border-white-600"
                style={{ width: 190 }}
              >
                {/* Image */}
                <Skeleton width="100%" height={112} borderRadius={8} />

                {/* Details */}
                <View className="px-4 py-3">
                  <Skeleton width={104} height={14} borderRadius={999} />

                  <View className="flex-row items-center gap-2 mt-2">
                    <Skeleton width={20} height={20} borderRadius={999} />
                    <Skeleton width={72} height={10} borderRadius={999} />
                  </View>

                  <View className="mt-2">
                    <Skeleton width={52} height={22} borderRadius={6} />
                  </View>

                  <View className="mt-2">
                    <Skeleton width={64} height={14} borderRadius={999} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeLoadingSkeleton;
