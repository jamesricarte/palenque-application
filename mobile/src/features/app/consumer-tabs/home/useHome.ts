import { useCallback, useEffect, useMemo, useState } from "react";

import MeatCategoryImage from "@/src/assets/Meat.png";
import SeafoodCategoryImage from "@/src/assets/Seafood.png";
import PoultryCategoryImage from "@/src/assets/Poultry.png";
import FruitsCategoryImage from "@/src/assets/Fruits.png";
import VegetablesCategoryImage from "@/src/assets/Vegetables.png";

import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";
import { useFocusEffect } from "expo-router";
import { getInitials } from "@/src/utils/getInitials";

export const useHome = () => {
    const { session } = useAuth();
    const [search, setSearch] = useState("");

    const [popularItems, setPopularItems] = useState<
        {
            id: string;
            name: string;
            vendor: string;
            vendorInitials: string;
            tag: string;
            price: string;
            image: { uri: string } | null;
            vendorAvatar: { uri: string } | null;
        }[]
    >([]);

    const [nearbyMarkets, setNearbyMarkets] = useState<
        {
            id: string;
            name: string;
            address: string;
            status: string;
            image: { uri: string } | null;
        }[]
    >([]);

    const [hasMarketsFetched, setHasMarketsFetched] = useState<boolean>(false);
    const [hasProductsFetched, setHasProductsFetched] = useState<boolean>(
        false,
    );
    const [loading, setLoading] = useState<boolean>(true);

    const formatDistance = (distanceInKm: number) => {
        if (distanceInKm < 1) {
            return `${Math.round(distanceInKm * 1000)} m away`;
        }

        return `${distanceInKm.toFixed(1)} km away`;
    };

    const calculateDistanceInKm = (
        from: { latitude: number; longitude: number },
        to: { latitude: number; longitude: number },
    ) => {
        const toRadians = (value: number) => value * (Math.PI / 180);
        const earthRadiusInKm = 6371;

        const latitudeDelta = toRadians(to.latitude - from.latitude);
        const longitudeDelta = toRadians(to.longitude - from.longitude);
        const fromLatitude = toRadians(from.latitude);
        const toLatitude = toRadians(to.latitude);

        const a = Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
            Math.cos(fromLatitude) * Math.cos(toLatitude) *
                Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusInKm * c;
    };

    useFocusEffect(
        useCallback(() => {
            const fetchProducts = async () => {
                try {
                    const { data, error } = await supabase.from("products")
                        .select(`
                        id,
                        name,
                        category,
                        price,
                        unit,
                        image_path,
                        vendors (
                            id,
                            users (
                                first_name,
                                last_name
                            )
                        )`)
                        .gt("stock", 0)
                        .limit(10);

                    if (error) throw new Error(error.message);

                    if (data) {
                        setPopularItems(
                            data.map((product: any) => {
                                const { data: imageData } = supabase.storage
                                    .from("products")
                                    .getPublicUrl(product.image_path);

                                const vendorFirstName =
                                    product.vendors.users.first_name ?? "";
                                const vendorLastName =
                                    product.vendors.users.last_name ?? "";

                                const vendorName =
                                    `${vendorFirstName} ${vendorLastName}`;

                                const vendorInitials = getInitials(
                                    vendorFirstName,
                                    vendorLastName,
                                );

                                return {
                                    id: String(product.id),
                                    name: product.name,
                                    vendor: vendorName,
                                    vendorInitials,
                                    tag: product.category,
                                    price: `₱ ${product.price}/${product.unit}`,
                                    image: product.image_path
                                        ? { uri: imageData.publicUrl }
                                        : null,
                                    vendorAvatar: null,
                                };
                            }),
                        );
                    }
                } catch (error: any) {
                    console.error(error);
                } finally {
                    setHasProductsFetched(true);
                }
            };

            const fetchMarkets = async () => {
                try {
                    const userId = session?.user?.id;

                    let defaultUserCoordinates: {
                        latitude: number;
                        longitude: number;
                    } | null = null;

                    if (userId) {
                        const { data: addressTypes, error: addressTypesError } =
                            await supabase
                                .from("address_types")
                                .select("id")
                                .in("applicable_to", ["user", "both"]);

                        if (addressTypesError) {
                            throw new Error(addressTypesError.message);
                        }

                        const addressTypeIds = (addressTypes ?? []).map(
                            (addressType: any) => addressType.id,
                        );

                        if (addressTypeIds.length > 0) {
                            const {
                                data: defaultAddress,
                                error: defaultAddressError,
                            } = await supabase
                                .from("addresses")
                                .select("coordinates")
                                .eq("owner_type", "user")
                                .eq("owner_id", userId)
                                .eq("is_default", true)
                                .in("address_type_id", addressTypeIds)
                                .maybeSingle();

                            if (defaultAddressError) {
                                throw new Error(defaultAddressError.message);
                            }

                            const coordinates = defaultAddress?.coordinates as {
                                latitude?: number;
                                longitude?: number;
                            } | null;

                            if (
                                typeof coordinates?.latitude === "number" &&
                                typeof coordinates?.longitude === "number"
                            ) {
                                defaultUserCoordinates = {
                                    latitude: coordinates.latitude,
                                    longitude: coordinates.longitude,
                                };
                            }
                        }
                    }

                    const { data, error } = await supabase.from("markets")
                        .select(`
                        id,
                        name,
                        status,
                        image_path,
                        coordinates
                    `).limit(10);

                    if (error) throw new Error(error.message);

                    if (data) {
                        setNearbyMarkets(
                            data
                                .map((market: any) => {
                                    const { data: imageData } =
                                        market.image_path
                                            ? supabase.storage
                                                .from("markets")
                                                .getPublicUrl(market.image_path)
                                            : { data: { publicUrl: "" } };

                                    const coordinates = market.coordinates as {
                                        latitude?: number;
                                        longitude?: number;
                                    } | null;
                                    const hasMarketCoordinates =
                                        typeof coordinates?.latitude ===
                                            "number" &&
                                        typeof coordinates?.longitude ===
                                            "number";
                                    const distanceInKm =
                                        defaultUserCoordinates &&
                                            hasMarketCoordinates
                                            ? calculateDistanceInKm(
                                                defaultUserCoordinates,
                                                {
                                                    latitude: coordinates
                                                        .latitude!,
                                                    longitude: coordinates
                                                        .longitude!,
                                                },
                                            )
                                            : null;

                                    return {
                                        id: String(market.id),
                                        name: `${market.name} Public Market`,
                                        address: distanceInKm !== null
                                            ? formatDistance(distanceInKm)
                                            : "Distance unavailable",
                                        status: market.status,
                                        image: market.image_path
                                            ? { uri: imageData.publicUrl }
                                            : null,
                                        distanceInKm,
                                    };
                                })
                                .sort((firstMarket, secondMarket) => {
                                    if (
                                        firstMarket.distanceInKm === null &&
                                        secondMarket.distanceInKm === null
                                    ) {
                                        return 0;
                                    }

                                    if (firstMarket.distanceInKm === null) {
                                        return 1;
                                    }

                                    if (secondMarket.distanceInKm === null) {
                                        return -1;
                                    }

                                    return firstMarket.distanceInKm -
                                        secondMarket.distanceInKm;
                                })
                                .map(({ distanceInKm, ...market }) => market),
                        );
                    }
                } catch (error: any) {
                    console.error(error);
                } finally {
                    setHasMarketsFetched(true);
                }
            };

            fetchProducts();
            fetchMarkets();
        }, [session?.user?.id]),
    );

    useEffect(() => {
        if (hasMarketsFetched && hasProductsFetched) setLoading(false);
    }, [hasMarketsFetched, hasProductsFetched]);

    const categories = useMemo(
        () => [
            { id: "meat", label: "Meat", image: MeatCategoryImage },
            { id: "seafood", label: "Seafood", image: SeafoodCategoryImage },
            { id: "poultry", label: "Poultry", image: PoultryCategoryImage },
            { id: "fruits", label: "Fruits", image: FruitsCategoryImage },
            {
                id: "vegetables",
                label: "Vegetables",
                image: VegetablesCategoryImage,
            },
        ],
        [],
    );

    return {
        search,
        setSearch,
        categories,
        nearbyMarkets,
        popularItems,
        loading,
    };
};
