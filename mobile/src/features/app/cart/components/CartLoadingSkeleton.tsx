import React from "react";
import { View } from "react-native";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

const CartLoadingSkeleton = () => {
  return (
    <View className="justify-between flex-1">
      <View className="px-5 pt-5 pb-6">
        <View className="gap-4">
          {Array.from({ length: 2 }).map((_, groupIndex) => (
            <View
              key={groupIndex}
              className="p-4 bg-white border rounded-md border-white-600"
            >
              <View className="flex-row items-center mb-4">
                <Skeleton width={20} height={20} borderRadius={4} />
                <View className="ml-3">
                  <Skeleton width={28} height={28} borderRadius={999} />
                </View>
                <View className="ml-2">
                  <Skeleton width={112} height={16} borderRadius={999} />
                </View>
              </View>

              <View className="gap-4">
                {Array.from({ length: 2 }).map((_, itemIndex) => (
                  <View key={itemIndex} className="flex-row">
                    <Skeleton width={20} height={20} borderRadius={4} />

                    <View className="ml-3">
                      <Skeleton width={70} height={70} borderRadius={8} />
                    </View>

                    <View className="flex-1 ml-3">
                      <Skeleton width="72%" height={18} borderRadius={999} />

                      <View className="mt-2">
                        <Skeleton width={88} height={10} borderRadius={999} />
                      </View>

                      <View className="flex-row items-center justify-between mt-3">
                        <Skeleton width={64} height={16} borderRadius={999} />
                        <Skeleton width={84} height={24} borderRadius={999} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Buttons */}
      {/* <View className="px-5 pt-5 pb-5 bg-primary-500">
        <View className="flex-row items-center justify-between mb-4">
          <Skeleton width={88} height={18} borderRadius={999} />
          <Skeleton width={96} height={18} borderRadius={999} />
        </View>

        <Skeleton width="100%" height={56} borderRadius={8} />
      </View> */}
    </View>
  );
};

export default CartLoadingSkeleton;
