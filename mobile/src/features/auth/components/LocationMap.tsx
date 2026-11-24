import MapView, { Marker } from "react-native-maps";

import type { LocationMapProps } from "@/src/features/auth/components/LocationMap.types";

export default function LocationMap({
  region,
  selectedCoordinate,
  onPress,
}: LocationMapProps) {
  return (
    <MapView
      style={{ flex: 1 }}
      region={region}
      onPress={onPress}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      {selectedCoordinate ? <Marker coordinate={selectedCoordinate} /> : null}
    </MapView>
  );
}
