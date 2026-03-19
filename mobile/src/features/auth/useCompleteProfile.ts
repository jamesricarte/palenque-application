import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "@/src/config/supabaseClient";
import { router, useLocalSearchParams } from "expo-router";
import { handleFormChange } from "@/src/utils/formHandler";
import * as Location from "expo-location";

type AddressType = {
    id: number;
    code: string;
    display_name: string;
    applicable_to: string;
};

type Coordinate = {
    latitude: number;
    longitude: number;
};

type Region = Coordinate & {
    latitudeDelta: number;
    longitudeDelta: number;
};

const DEFAULT_REGION: Region = {
    latitude: 13.1391,
    longitude: 123.7438,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
};

const FALLBACK_ADDRESS_TYPES: AddressType[] = [
    {
        id: 1,
        code: "home",
        display_name: "Home",
        applicable_to: "user",
    },
    {
        id: 2,
        code: "work",
        display_name: "Work",
        applicable_to: "user",
    },
    {
        id: 3,
        code: "other",
        display_name: "Other",
        applicable_to: "both",
    },
];

export const useCompleteProfile = () => {
    const { id } = useLocalSearchParams<{ id?: string }>();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    const [addressData, setAddressData] = useState({
        streetAddress: "",
        barangay: "",
        city: "",
        province: "",
        postalCode: "",
    });

    const [addressTypes, setAddressTypes] = useState<AddressType[]>([]);
    const [selectedAddressTypeId, setSelectedAddressTypeId] = useState<
        number | null
    >(null);

    const [selectedCoordinate, setSelectedCoordinate] = useState<
        Coordinate | null
    >(
        null,
    );
    const [mapRegion, setMapRegion] = useState<Region>(DEFAULT_REGION);

    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const setFirstName = (value: string) =>
        handleFormChange(setFormData, "firstName", value);
    const setLastName = (value: string) =>
        handleFormChange(setFormData, "lastName", value);
    const setEmail = (value: string) =>
        handleFormChange(setFormData, "email", value);

    const setStreetAddress = (value: string) =>
        handleFormChange(setAddressData, "streetAddress", value);
    const setBarangay = (value: string) =>
        handleFormChange(setAddressData, "barangay", value);
    const setCity = (value: string) =>
        handleFormChange(setAddressData, "city", value);
    const setProvince = (value: string) =>
        handleFormChange(setAddressData, "province", value);
    const setPostalCode = (value: string) =>
        handleFormChange(setAddressData, "postalCode", value);

    useEffect(() => {
        fetchAddressTypes();
    }, []);

    const fetchAddressTypes = async () => {
        try {
            const { data, error } = await supabase
                .from("address_types")
                .select("id, code, display_name, applicable_to")
                .in("applicable_to", ["user", "both"])
                .order("id", { ascending: true });

            if (error) {
                throw new Error(error.message);
            }

            if (data && data.length > 0) {
                setAddressTypes(data as AddressType[]);
                setSelectedAddressTypeId(data[0].id);
                return;
            }

            setAddressTypes(FALLBACK_ADDRESS_TYPES);
            setSelectedAddressTypeId(FALLBACK_ADDRESS_TYPES[0].id);
        } catch (error) {
            setAddressTypes(FALLBACK_ADDRESS_TYPES);
            setSelectedAddressTypeId(FALLBACK_ADDRESS_TYPES[0].id);
        }
    };

    const deliveryAddress = useMemo(() => {
        const parts = [
            addressData.streetAddress.trim(),
            addressData.barangay.trim(),
            addressData.city.trim(),
            addressData.province.trim(),
            addressData.postalCode.trim(),
        ].filter(Boolean);

        return parts.join(", ");
    }, [
        addressData.streetAddress,
        addressData.barangay,
        addressData.city,
        addressData.province,
        addressData.postalCode,
    ]);

    const hasSelectedAddress = useMemo(() => {
        return deliveryAddress.trim().length > 0;
    }, [deliveryAddress]);

    const isComplete = useMemo(() => {
        return (
            formData.firstName.trim().length > 0 &&
            formData.lastName.trim().length > 0 &&
            addressData.streetAddress.trim().length > 0 &&
            addressData.barangay.trim().length > 0 &&
            addressData.city.trim().length > 0 &&
            addressData.province.trim().length > 0 &&
            selectedAddressTypeId !== null &&
            selectedCoordinate !== null
        );
    }, [
        formData.firstName,
        formData.lastName,
        addressData.streetAddress,
        addressData.barangay,
        addressData.city,
        addressData.province,
        selectedAddressTypeId,
        selectedCoordinate,
    ]);

    const isValidEmail = (val: string) => {
        // Simple practical email check (good enough for forms)
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    };

    const openAddressModal = async () => {
        const granted = await ensureLocationPermission();

        if (!granted) {
            setError("Location permission is required to select your address.");
            return;
        }

        setIsAddressModalVisible(true);

        if (!selectedCoordinate) {
            await handleUseCurrentLocation();
        }
    };

    const closeAddressModal = () => {
        if (!selectedCoordinate) {
            setError("Please select your delivery location on the map.");
            return;
        }

        if (!addressData.streetAddress.trim()) {
            setError("Street address is required.");
            return;
        }

        if (!addressData.barangay.trim()) {
            setError("Barangay is required.");
            return;
        }

        if (!addressData.city.trim()) {
            setError("City or municipality is required.");
            return;
        }

        if (!addressData.province.trim()) {
            setError("Province is required.");
            return;
        }

        if (!selectedAddressTypeId) {
            setError("Please select an address type.");
            return;
        }

        setIsAddressModalVisible(false);
    };

    const reverseGeocode = async (coordinate: Coordinate) => {
        try {
            setIsReverseGeocoding(true);

            const result = await Location.reverseGeocodeAsync({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
            });

            if (result.length > 0) {
                const address = result[0];

                const streetParts = [
                    address.name,
                    address.street,
                ].filter(Boolean);

                setAddressData({
                    streetAddress: streetParts.join(" ").trim(),
                    barangay: address.district ||
                        address.subregion ||
                        "",
                    city: address.city ||
                        address.subregion ||
                        "",
                    province: address.region || "",
                    postalCode: address.postalCode || "",
                });
            }
        } catch (error) {
            console.error("Reverse geocoding error:", error);
        } finally {
            setIsReverseGeocoding(false);
        }
    };

    const ensureLocationPermission = async () => {
        const currentPermission = await Location
            .getForegroundPermissionsAsync();

        if (currentPermission.granted) {
            return true;
        }

        const requestedPermission = await Location
            .requestForegroundPermissionsAsync();

        return requestedPermission.granted;
    };

    const handleUseCurrentLocation = async () => {
        try {
            setIsLoadingLocation(true);

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const coordinate = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            setSelectedCoordinate(coordinate);
            setMapRegion({
                ...coordinate,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            await reverseGeocode(coordinate);
        } catch (error) {
            console.error("Error getting current location:", error);
            Alert.alert("Error", "Failed to get your current location.");
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const handleMapPress = async (event: any) => {
        const coordinate = event.nativeEvent.coordinate as Coordinate;

        setSelectedCoordinate(coordinate);
        setMapRegion({
            ...coordinate,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });

        await reverseGeocode(coordinate);
    };

    const validate = () => {
        if (!formData.firstName.trim()) return "First name is required.";
        if (!formData.lastName.trim()) return "Last name is required.";

        if (!selectedCoordinate) {
            return "Please select your delivery location on the map.";
        }

        if (!selectedAddressTypeId) {
            return "Please select an address type.";
        }

        if (!addressData.streetAddress.trim()) {
            return "Street address is required.";
        }

        if (!addressData.barangay.trim()) {
            return "Barangay is required.";
        }

        if (!addressData.city.trim()) {
            return "City or municipality is required.";
        }

        if (!addressData.province.trim()) {
            return "Province is required.";
        }

        if (formData.email.trim() && !isValidEmail(formData.email)) {
            return "Please enter a valid email address.";
        }

        return "";
    };

    const handleSave = async () => {
        if (error) setError("");

        const msg = validate();
        if (msg) {
            setError(msg);
            return;
        }

        try {
            setLoading(true);

            const { error: updateUserError } = await supabase
                .from("users")
                .update({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email || null,
                })
                .eq("user_id", id);

            if (updateUserError) {
                throw new Error(updateUserError.message);
            }

            const { data: userRecord, error: userRecordError } = await supabase
                .from("users")
                .select("*")
                .eq("user_id", id)
                .maybeSingle();

            if (userRecordError) {
                throw new Error(userRecordError.message);
            }

            const ownerId = (userRecord as any)?.user_id;

            if (!ownerId) {
                throw new Error(
                    "Unable to find the public user id needed for saving the address. Please check your users and addresses table relationship.",
                );
            }

            const { error: resetDefaultError } = await supabase
                .from("addresses")
                .update({ is_default: false })
                .eq("owner_type", "user")
                .eq("owner_id", ownerId);

            if (resetDefaultError) {
                throw new Error(resetDefaultError.message);
            }

            const { error: insertAddressError } = await supabase
                .from("addresses")
                .insert({
                    owner_type: "user",
                    owner_id: ownerId,
                    address_type_id: selectedAddressTypeId,
                    street_address: addressData.streetAddress.trim(),
                    barangay: addressData.barangay.trim(),
                    city: addressData.city.trim(),
                    province: addressData.province.trim(),
                    postal_code: addressData.postalCode.trim() || null,
                    coordinates: {
                        latitude: selectedCoordinate?.latitude,
                        longitude: selectedCoordinate?.longitude,
                    },
                    is_default: true,
                });

            if (insertAddressError) {
                throw new Error(insertAddressError.message);
            }

            if (router.canDismiss?.()) {
                router.dismissAll();
            }
            router.replace("/(app)/(consumer-tabs)/home");
        } catch (error: any) {
            const message = error?.response?.data?.error ||
                error?.response?.data || error?.message || error ||
                "Unknown error";

            setError(message);
            console.error(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        // fields
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        deliveryAddress,
        setFirstName,
        setLastName,
        setEmail,

        // address fields
        streetAddress: addressData.streetAddress,
        barangay: addressData.barangay,
        city: addressData.city,
        province: addressData.province,
        postalCode: addressData.postalCode,
        setStreetAddress,
        setBarangay,
        setCity,
        setProvince,
        setPostalCode,

        // address modal state
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
        handleMapPress,
        handleUseCurrentLocation,
        hasSelectedAddress,

        // ui state
        loading,
        error,
        setError,

        // computed
        isComplete,

        // actions
        handleSave,
    };
};
