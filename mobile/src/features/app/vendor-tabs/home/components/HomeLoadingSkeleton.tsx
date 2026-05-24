import React from "react";
import { View } from "react-native";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

const HomeLoadingSkeleton = () => {
  return (
    <>
      {/* Welcome Card */}
      <View className="flex-row items-center justify-between px-4 py-4 mt-6 bg-white border rounded-md border-white-600">
        <View className="flex-1 pr-4">
          <Skeleton width={176} height={18} borderRadius={999} />

          <View className="mt-2">
            <Skeleton width={220} height={12} borderRadius={999} />
          </View>
        </View>

        <Skeleton width={48} height={48} borderRadius={999} />
      </View>

      {/* Active Orders */}
      <View className="mt-6">
        <Skeleton width={112} height={16} borderRadius={999} />

        <View className="justify-center px-6 mt-3 bg-white border rounded-md h-[104px] border-white-600">
          <Skeleton width={180} height={12} borderRadius={999} />
        </View>
      </View>

      {/* Sales Activity */}
      <View className="mt-6">
        <Skeleton width={116} height={16} borderRadius={999} />

        <View className="flex-row items-center justify-between px-4 py-4 mt-3 bg-white border rounded-md border-white-600">
          <View className="flex-row items-center gap-3">
            <Skeleton width={22} height={22} borderRadius={999} />
            <Skeleton width={88} height={16} borderRadius={999} />
          </View>

          <Skeleton width={22} height={22} borderRadius={999} />
        </View>

        <View className="px-4 py-4 mt-3 bg-white border rounded-md border-white-600">
          <View className="flex-row items-center justify-between">
            <Skeleton width={88} height={16} borderRadius={999} />
            <Skeleton width={72} height={16} borderRadius={999} />
          </View>

          <View className="flex-row justify-around mt-7">
            {Array.from({ length: 2 }).map((_, index) => (
              <View key={index} className="items-center">
                <Skeleton width={24} height={20} borderRadius={999} />

                <View className="mt-2">
                  <Skeleton width={92} height={12} borderRadius={999} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );
};

export default HomeLoadingSkeleton;
