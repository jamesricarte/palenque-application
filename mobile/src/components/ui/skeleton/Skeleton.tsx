import { View, type DimensionValue, LayoutChangeEvent } from "react-native";
import React, { useEffect, useState } from "react";
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
  borderRadius?: number;
};

export default function Skeleton({
  width,
  height,
  borderRadius = 8,
}: SkeletonProps) {
  const translateX = useSharedValue(-150);

  const opacity = useSharedValue(1);

  const [containerWidth, setContainerWidth] = useState(0);

  const shimmerWidth = 120;

  useEffect(() => {
    // Pulse animation
    opacity.value = withRepeat(
      withTiming(0.6, {
        duration: 600,
      }),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    if (containerWidth === 0) return;

    // Shimmer animation
    translateX.value = withRepeat(
      withTiming(containerWidth, {
        duration: 1200,
      }),
      -1,
      false,
    );
  }, [containerWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    // <Animated.View
    //   onLayout={handleLayout}
    //   style={[
    //     {
    //       backgroundColor: "#e8e8e8",
    //       overflow: "hidden",
    //     },
    //     {
    //       width,
    //       height,
    //       borderRadius,
    //     },
    //     containerAnimatedStyle,
    //   ]}
    // >
    //   <Animated.View
    //     style={[
    //       {
    //         width: shimmerWidth,
    //         height: "100%",
    //       },
    //       shimmerAnimatedStyle,
    //     ]}
    //   >
    //     <LinearGradient
    //       colors={[
    //         "rgba(255,255,255,0)",
    //         "rgba(255,255,255,0.45)",
    //         "rgba(255,255,255,0)",
    //       ]}
    //       start={{ x: 0, y: 0 }}
    //       end={{ x: 1, y: 0 }}
    //       style={{
    //         width: "100%",
    //         height: "100%",
    //       }}
    //     />
    //   </Animated.View>
    // </Animated.View>

    <View
      onLayout={handleLayout}
      style={[
        {
          backgroundColor: "#e8e8e8",
          overflow: "hidden",
        },
        {
          width,
          height,
          borderRadius,
        },
      ]}
    ></View>
  );
}
