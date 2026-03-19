import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCompleteProfile } from "@/src/features/auth/useCompleteProfile";
import { SafeAreaView } from "react-native-safe-area-context";

const CompleteProfileScreen = () => {
  const router = useRouter();

  const {
    firstName,
    lastName,
    email,
    deliveryAddress,
    setFirstName,
    setLastName,
    setEmail,
    loading,
    error,
    setError,
    isComplete,
    handleSave,
    isAddressModalVisible,
    openAddressModal,
    closeAddressModal,
    mapRegion,
    selectedCoordinate,
    isLoadingLocation,
    isReverseGeocoding,
    addressTypes,
    selectedAddressTypeId,
    setSelectedAddressTypeId,
    streetAddress,
    barangay,
    city,
    province,
    postalCode,
    setStreetAddress,
    setBarangay,
    setCity,
    setProvince,
    setPostalCode,
    handleMapPress,
    handleUseCurrentLocation,
    hasSelectedAddress,
  } = useCompleteProfile();

  const inputBorder = error ? "border-red-500" : "border-white-600";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 mx-6">
        {/* Top bar */}
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="items-center justify-center w-10 h-10 rounded-full bg-white-600"
          >
            <Ionicons name="chevron-back" size={24} color="#b5b5b5" />
          </Pressable>

          <Text className="text-base text-black">Step 3 of 3</Text>
        </View>

        {/* Content */}
        <View className="mt-10">
          <Text className="text-3xl font-semibold">Complete your profile</Text>
          <Text className="mt-2 text-xl text-primary-500">
            Enter the required details.
          </Text>

          {/* First Name */}
          <TextInput
            value={firstName}
            onChangeText={(t) => {
              if (error) setError("");
              setFirstName(t);
            }}
            placeholder="First Name"
            placeholderTextColor="#b5b5b5"
            className={`w-full text-lg border border-white-600 rounded-md p-4 pr-12 mt-8 ${inputBorder}`}
            autoCapitalize="words"
          />

          {/* Last Name */}
          <TextInput
            value={lastName}
            onChangeText={(t) => {
              if (error) setError("");
              setLastName(t);
            }}
            placeholder="Last Name"
            placeholderTextColor="#b5b5b5"
            className={`w-full text-lg border border-white-600 rounded-md p-4 pr-12 mt-4 ${inputBorder}`}
            autoCapitalize="words"
          />

          {/* Email (Optional) */}
          <TextInput
            value={email}
            onChangeText={(t) => {
              if (error) setError("");
              setEmail(t);
            }}
            placeholder="Email Address (Optional)"
            placeholderTextColor="#b5b5b5"
            keyboardType="email-address"
            autoCapitalize="none"
            className={`w-full text-lg border border-white-600 rounded-md p-4 pr-12 mt-4 ${inputBorder}`}
          />

          {/* Delivery Address Button */}
          <View className="relative mt-4">
            <Pressable
              onPress={() => {
                if (error) setError("");
                openAddressModal();
              }}
              className={`w-full border rounded-md p-4 pr-12 ${inputBorder}`}
            >
              <Text
                className={`text-lg ${
                  hasSelectedAddress ? "text-black" : "text-white-700"
                }`}
                numberOfLines={2}
              >
                {hasSelectedAddress ? deliveryAddress : "Delivery Address"}
              </Text>
            </Pressable>

            <View className="absolute -translate-y-1/2 right-4 top-1/2">
              <Ionicons name="location" size={22} color="#b5b5b5" />
            </View>
          </View>

          {error ? <Text className="mt-4 text-red-500">{error}</Text> : null}

          {/* Save button */}
          <Pressable
            className={`mt-8 py-4 rounded-md ${
              !loading && isComplete ? "bg-primary-500" : "bg-gray-300"
            }`}
            onPress={handleSave}
            disabled={loading || !isComplete}
          >
            {!loading ? (
              <Text className="text-lg font-semibold text-center text-white">
                Save &amp; Continue
              </Text>
            ) : (
              <ActivityIndicator size="small" color="white" />
            )}
          </Pressable>
        </View>
      </View>

      <Modal
        visible={isAddressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeAddressModal}
      >
        <View className="justify-end flex-1 bg-black/40">
          <View className="h-[90%] bg-white rounded-t-[30px] overflow-hidden">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-5 pt-5 pb-4 border-b border-white-600">
              <View>
                <Text className="text-[22px] font-semibold text-black">
                  Set Delivery Address
                </Text>
                <Text className="mt-1 text-[15px] text-white-700">
                  Tap on the map to pin your exact location.
                </Text>
              </View>

              <Pressable onPress={closeAddressModal} hitSlop={10}>
                <Ionicons name="close" size={28} color="#111111" />
              </Pressable>
            </View>

            {/* Map */}
            <View className="h-[38%] border-b border-white-600">
              {isLoadingLocation ? (
                <View className="items-center justify-center flex-1">
                  <ActivityIndicator size="large" color="#F46B45" />
                  <Text className="mt-3 text-[15px] text-white-700">
                    Getting your location...
                  </Text>
                </View>
              ) : (
                <>
                  <MapView
                    style={{ flex: 1 }}
                    region={mapRegion}
                    onPress={handleMapPress}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                  >
                    {selectedCoordinate ? (
                      <Marker coordinate={selectedCoordinate} />
                    ) : null}
                  </MapView>

                  <Pressable
                    onPress={handleUseCurrentLocation}
                    className="absolute flex-row items-center px-4 py-3 bg-white rounded-md right-4 top-4"
                  >
                    <Ionicons name="locate" size={18} color="#F46B45" />
                    <Text className="ml-2 text-[14px] font-medium text-primary-500">
                      Use Current
                    </Text>
                  </Pressable>
                </>
              )}
            </View>

            <ScrollView
              className="flex-1"
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 30,
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* Address Type */}
              <View className="mb-6">
                <Text className="text-[18px] font-semibold text-black">
                  Address Type
                </Text>

                <View className="flex-row flex-wrap gap-2 mt-3">
                  {addressTypes.map((type) => {
                    const isActive = selectedAddressTypeId === type.id;

                    return (
                      <Pressable
                        key={type.id}
                        onPress={() => {
                          if (error) setError("");
                          setSelectedAddressTypeId(type.id);
                        }}
                        className={`px-4 py-2 rounded-md border ${
                          isActive
                            ? "bg-primary-500 border-primary-500"
                            : "bg-white border-white-600"
                        }`}
                      >
                        <Text
                          className={`text-[14px] ${
                            isActive ? "text-white" : "text-black"
                          }`}
                        >
                          {type.display_name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Auto-filled Address Fields */}
              <View>
                <Text className="mb-4 text-[18px] font-semibold text-black">
                  Address Details
                </Text>

                {isReverseGeocoding ? (
                  <View className="flex-row items-center p-4 mb-4 rounded-md bg-brandBlack-50">
                    <ActivityIndicator size="small" color="#F46B45" />
                    <Text className="ml-3 text-[14px] text-white-700">
                      Getting address details...
                    </Text>
                  </View>
                ) : null}

                <TextInput
                  value={streetAddress}
                  onChangeText={(t) => {
                    if (error) setError("");
                    setStreetAddress(t);
                  }}
                  placeholder="Street Address"
                  placeholderTextColor="#b5b5b5"
                  className={`w-full text-lg border rounded-md p-4 mt-0 ${
                    error ? "border-red-500" : "border-white-600"
                  }`}
                />

                <TextInput
                  value={barangay}
                  onChangeText={(t) => {
                    if (error) setError("");
                    setBarangay(t);
                  }}
                  placeholder="Barangay"
                  placeholderTextColor="#b5b5b5"
                  className={`w-full text-lg border rounded-md p-4 mt-4 ${
                    error ? "border-red-500" : "border-white-600"
                  }`}
                />

                <TextInput
                  value={city}
                  onChangeText={(t) => {
                    if (error) setError("");
                    setCity(t);
                  }}
                  placeholder="City / Municipality"
                  placeholderTextColor="#b5b5b5"
                  className={`w-full text-lg border rounded-md p-4 mt-4 ${
                    error ? "border-red-500" : "border-white-600"
                  }`}
                />

                <TextInput
                  value={province}
                  onChangeText={(t) => {
                    if (error) setError("");
                    setProvince(t);
                  }}
                  placeholder="Province"
                  placeholderTextColor="#b5b5b5"
                  className={`w-full text-lg border rounded-md p-4 mt-4 ${
                    error ? "border-red-500" : "border-white-600"
                  }`}
                />

                <TextInput
                  value={postalCode}
                  onChangeText={(t) => {
                    if (error) setError("");
                    setPostalCode(t);
                  }}
                  placeholder="Postal Code"
                  placeholderTextColor="#b5b5b5"
                  keyboardType="numeric"
                  className={`w-full text-lg border rounded-md p-4 mt-4 ${
                    error ? "border-red-500" : "border-white-600"
                  }`}
                />
              </View>

              <Pressable
                onPress={closeAddressModal}
                className="items-center justify-center py-4 mt-6 rounded-md bg-primary-500"
              >
                <Text className="text-lg font-semibold text-white">
                  Confirm Address
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CompleteProfileScreen;
