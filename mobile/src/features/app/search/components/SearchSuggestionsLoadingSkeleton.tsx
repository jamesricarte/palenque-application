import React from "react";
import { View } from "react-native";
import Skeleton from "@/src/components/ui/skeleton/Skeleton";

const SearchSuggestionsLoadingSkeleton = () => {
  return (
    <View>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index} className="flex-row items-center py-1.5">
          <Skeleton width={18} height={18} borderRadius={999} />

          <View className="flex-1 ml-3">
            <Skeleton
              width={`${72 - index * 6}%`}
              height={16}
              borderRadius={999}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default SearchSuggestionsLoadingSkeleton;
