import React from "react";
import { View } from "react-native";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

const ProfileLoadingSkeleton = () => {
  return (
    <>
      {/* Profile Card */}
      <View className="mt-6 bg-white border rounded-md border-white-600">
        <View className="py-4 pl-4 pr-2">
          <Skeleton width={144} height={18} borderRadius={999} />

          <View className="mt-3">
            <Skeleton width={92} height={12} borderRadius={999} />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="mt-4 overflow-hidden bg-white border rounded-md border-white-600">
        <View className="px-4 py-3 border-b border-white-600">
          <Skeleton width={104} height={16} borderRadius={999} />
        </View>

        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index}>
            <View className="py-4 pl-4 pr-2">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Skeleton width={40} height={40} borderRadius={999} />

                  <View>
                    <Skeleton width={132} height={14} borderRadius={999} />

                    <View className="mt-2">
                      <Skeleton width={148} height={12} borderRadius={999} />
                    </View>
                  </View>
                </View>

                <Skeleton width={20} height={20} borderRadius={999} />
              </View>
            </View>

            {index === 0 && <View className="h-[1px] bg-white-600" />}
          </View>
        ))}
      </View>

      {/* Logout Button */}
      <View className="items-center justify-center py-4 mt-6 border rounded-md border-white-600">
        <Skeleton width={68} height={14} borderRadius={999} />
      </View>
    </>
  );
};

export default ProfileLoadingSkeleton;
