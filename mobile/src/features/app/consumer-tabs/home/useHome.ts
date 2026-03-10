import { useCallback, useMemo, useState } from "react";

import MeatCategoryImage from "@/src/assets/Meat.png";
import SeafoodCategoryImage from "@/src/assets/Seafood.png";
import PoultryCategoryImage from "@/src/assets/Poultry.png";
import FruitsCategoryImage from "@/src/assets/Fruits.png";
import VegetablesCategoryImage from "@/src/assets/Vegetables.png";
import LegazpiCityPublicMarketImage from "@/src/assets/Legazpi_City_Public_Market_image.jpg";
import GuinobatanPublicMarketImage from "@/src/assets/Guinobatan_Public_Market_image.jpg";
import DaragaPublicMarketImage from "@/src/assets/Daraga_Public_Market_image.jpg";
import MeatImage from "@/src/assets/Meat.jpg";

import { supabase } from "@/src/config/supabaseClient";
import { useFocusEffect } from "expo-router";

export const useHome = () => {
    const [search, setSearch] = useState("");

    const [popularItems, setPopularItems] = useState<
        {
            id: string;
            name: string;
            vendor: string;
            tag: string;
            price: string;
            image: { uri: string } | typeof LegazpiCityPublicMarketImage;
            vendorAvatar: typeof LegazpiCityPublicMarketImage;
        }[]
    >([]);

    useFocusEffect(
        useCallback(() => {
            const fetchProducts = async () => {
                try {
                    const { data, error } = await supabase.from("products")
                        .select(`
                        id,
                        name,
                        categories,
                        price,
                        unit,
                        image_path,
                        vendors (
                            id,
                            users (
                                first_name,
                                last_name
                            )
                        )`).limit(10);

                    if (error) throw new Error(error.message);

                    if (data) {
                        setPopularItems(
                            data.map((product: any) => {
                                const { data: imageData } = supabase.storage
                                    .from("products")
                                    .getPublicUrl(product.image_path);

                                const vendorName = `${
                                    product.vendors.users.first_name ?? ""
                                } ${product.vendors.users.last_name ?? ""}`;

                                return {
                                    id: String(product.id),
                                    name: product.name,
                                    vendor: vendorName,
                                    tag: product.categories,
                                    price: `₱ ${product.price}/${product.unit}`,
                                    image: product.image_path
                                        ? { uri: imageData.publicUrl }
                                        : MeatImage,
                                    vendorAvatar: LegazpiCityPublicMarketImage,
                                };
                            }),
                        );
                    }
                } catch (error: any) {
                    console.error(error);
                }
            };

            fetchProducts();
        }, []),
    );

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

    const nearbyMarkets = useMemo(
        () => [
            {
                id: "legazpi",
                name: "Legazpi City Public Market",
                address: "Address - 1 km",
                status: "Open",
                image: LegazpiCityPublicMarketImage,
            },
            {
                id: "guinobatan",
                name: "Guinobatan Public Market",
                address: "Address - 1 km",
                status: "Open",
                image: GuinobatanPublicMarketImage,
            },
            {
                id: "daraga",
                name: "Daraga Public Market",
                address: "Address - 2 km",
                status: "Open",
                image: DaragaPublicMarketImage,
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
    };
};
