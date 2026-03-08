import { useMemo, useState } from "react";

export const useHome = () => {
    const [search, setSearch] = useState("");

    const categories = useMemo(
        () => [
            { id: "meat", label: "Meat" },
            { id: "seafood", label: "Seafood" },
            { id: "poultry", label: "Poultry" },
            { id: "fruits", label: "Fruits" },
            { id: "vegetables", label: "Vegetables" },
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
            },
            {
                id: "guinobatan",
                name: "Guinobatan Public Market",
                address: "Address - 1 km",
                status: "Open",
            },
            {
                id: "daraga",
                name: "Daraga Public Market",
                address: "Address - 2 km",
                status: "Open",
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
            },
            {
                id: "pork-belly",
                name: "Pork Belly",
                vendor: "Vendor Name",
                tag: "Meat",
                price: "₱ 200.00/1kg",
            },
            {
                id: "chicken",
                name: "Chicken Breast",
                vendor: "Vendor Name",
                tag: "Poultry",
                price: "₱ 160.00/1kg",
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
