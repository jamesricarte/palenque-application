import { View, type DimensionValue } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

type SkeletonProps = {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius: number;
};

export default function Skeleton({
  width,
  height,
  borderRadius = 8,
}: SkeletonProps) {
  const translateX = useSharedValue(-200);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(400, {
        duration: 1200,
      }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        { backgroundColor: "#e8e8e8", overflow: "hidden" },
        { width, height, borderRadius },
      ]}
    >
      <Animated.View style={[{ width: "100%", height: "100%" }, animatedStyle]}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.5)",
            "rgba(255,255,255,0)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: "40%", height: "100%" }}
        />
      </Animated.View>
    </View>
  );
}
