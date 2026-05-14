import React from "react";
import { View } from "react-native";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

const SearchResultsLoadingSkeleton = () => {
  return (
    <View className="flex-row flex-wrap justify-between mt-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={index}
          className="mb-4 overflow-hidden bg-white border rounded-lg border-white-600"
          style={{ width: "48%" }}
        >
          <Skeleton width="100%" height={112} borderRadius={8} />

          <View className="px-3 py-3">
            <Skeleton width="78%" height={14} borderRadius={999} />

            <View className="mt-2">
              <Skeleton width="62%" height={14} borderRadius={999} />
            </View>

            <View className="flex-row items-center gap-2 mt-3">
              <Skeleton width={20} height={20} borderRadius={999} />
              <Skeleton width={72} height={10} borderRadius={999} />
            </View>

            <View className="mt-3">
              <Skeleton width={64} height={22} borderRadius={6} />
            </View>

            <View className="mt-3">
              <Skeleton width={56} height={14} borderRadius={999} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default SearchResultsLoadingSkeleton;
