import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import type { LocationMapProps } from "@/src/features/auth/components/LocationMap.types";

export default function LocationMap({
  region,
  selectedCoordinate,
  onPress,
}: LocationMapProps) {
  const [latitude, setLatitude] = useState(String(region.latitude));
  const [longitude, setLongitude] = useState(String(region.longitude));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedCoordinate) return;

    setLatitude(String(selectedCoordinate.latitude));
    setLongitude(String(selectedCoordinate.longitude));
  }, [selectedCoordinate]);

  const pinLocation = () => {
    const nextLatitude = Number(latitude);
    const nextLongitude = Number(longitude);

    if (
      !latitude.trim() ||
      !longitude.trim() ||
      !Number.isFinite(nextLatitude) ||
      !Number.isFinite(nextLongitude) ||
      Math.abs(nextLatitude) > 90 ||
      Math.abs(nextLongitude) > 180
    ) {
      setError("Enter valid latitude and longitude coordinates.");
      return;
    }

    setError("");
    onPress({
      nativeEvent: {
        coordinate: { latitude: nextLatitude, longitude: nextLongitude },
      },
    });
  };

  return (
    <View className="flex-1 justify-center px-4 bg-white">
      <Text className="mb-3 text-base text-white-700">
        Enter coordinates to pin your delivery location.
      </Text>
      <View className="flex-row mb-3">
        <TextInput
          accessibilityLabel="Latitude"
          value={latitude}
          onChangeText={setLatitude}
          placeholder="Latitude"
          keyboardType="decimal-pad"
          className="flex-1 px-3 py-2 mr-2 border rounded-md border-white-600"
        />
        <TextInput
          accessibilityLabel="Longitude"
          value={longitude}
          onChangeText={setLongitude}
          placeholder="Longitude"
          keyboardType="decimal-pad"
          className="flex-1 px-3 py-2 border rounded-md border-white-600"
        />
      </View>
      {error ? <Text className="mb-2 text-red-500">{error}</Text> : null}
      <Pressable onPress={pinLocation} className="px-4 py-3 rounded-md bg-primary-500">
        <Text className="font-semibold text-center text-white">Pin location</Text>
      </Pressable>
    </View>
  );
}
