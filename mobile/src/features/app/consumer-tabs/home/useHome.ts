import { useMemo, useState } from "react";

import MeatCategoryImage from "@/src/assets/Meat.png";
import SeafoodCategoryImage from "@/src/assets/Seafood.png";
import PoultryCategoryImage from "@/src/assets/Poultry.png";
import FruitsCategoryImage from "@/src/assets/Fruits.png";
import VegetablesCategoryImage from "@/src/assets/Vegetables.png";
import LegazpiCityPublicMarketImage from "@/src/assets/Legazpi_City_Public_Market_image.jpg";
import GuinobatanPublicMarketImage from "@/src/assets/Guinobatan_Public_Market_image.jpg";
import DaragaPublicMarketImage from "@/src/assets/Daraga_Public_Market_image.jpg";
import TunaImage from "@/src/assets/Tuna.jpg";
import MeatImage from "@/src/assets/Meat.jpg";
import ChickenImage from "@/src/assets/Chicken.jpg";

export const useHome = () => {
    const [search, setSearch] = useState("");

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

    const popularItems = useMemo(
        () => [
            {
                id: "tuna",
                name: "Yellowfin Tuna",
                vendor: "Vendor Name",
                tag: "Seafood",
                price: "₱ 120.00/1kg",
                image: TunaImage,
                vendorAvatar: LegazpiCityPublicMarketImage,
            },
            {
                id: "pork-belly",
                name: "Pork Belly",
                vendor: "Vendor Name",
                tag: "Meat",
                price: "₱ 200.00/1kg",
                image: MeatImage,
                vendorAvatar: LegazpiCityPublicMarketImage,
            },
            {
                id: "chicken",
                name: "Chicken Breast",
                vendor: "Vendor Name",
                tag: "Poultry",
                price: "₱ 160.00/1kg",
                image: ChickenImage,
                vendorAvatar: LegazpiCityPublicMarketImage,
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
