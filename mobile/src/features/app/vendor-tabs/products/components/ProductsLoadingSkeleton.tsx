import React from "react";
import { View } from "react-native";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

const ProductsLoadingSkeleton = () => {
  return (
    <View className="gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={index}
          className="overflow-hidden bg-white border rounded-md border-white-600"
        >
          <Skeleton width="100%" height={100} borderRadius={8} />

          <View className="px-3 py-3">
            <Skeleton width={136} height={18} borderRadius={999} />

            <View className="mt-2">
              <Skeleton width={52} height={18} borderRadius={4} />
            </View>

            <View className="flex-row items-end justify-between mt-3">
              <Skeleton width={84} height={18} borderRadius={999} />

              <View className="items-end">
                <Skeleton width={56} height={10} borderRadius={999} />

                <View className="mt-2">
                  <Skeleton width={40} height={24} borderRadius={999} />
                </View>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ProductsLoadingSkeleton;
