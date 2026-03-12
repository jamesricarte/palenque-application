import { router } from "expo-router";
import { useState } from "react";

const orderTabs = ["New", "Preparing", "Ready", "Completed"];

const orderItems = [
    {
        id: 1,
        name: "Yellowfin Tuna",
        priceLabel: "₱ 240.00",
        unit: "Per Kilo",
        quantity: 2,
        image:
            "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 2,
        name: "Tilapia",
        priceLabel: "₱ 140.00",
        unit: "Per Kilo",
        quantity: 1,
        image:
            "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=300&q=80",
    },
];

export const useOrders = () => {
    const [activeTab, setActiveTab] = useState("New");

    const handleBack = () => {
        if (router.canGoBack()) router.back();
    };

    return {
        activeTab,
        setActiveTab,
        orderTabs,
        orderItems,
        handleBack,
    };
};
