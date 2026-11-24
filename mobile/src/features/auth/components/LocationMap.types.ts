export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type LocationMapProps = {
  region: MapCoordinate & {
    latitudeDelta: number;
    longitudeDelta: number;
  };
  selectedCoordinate: MapCoordinate | null;
  onPress: (event: { nativeEvent: { coordinate: MapCoordinate } }) => void;
};
