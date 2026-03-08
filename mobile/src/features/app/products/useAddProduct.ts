import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";

export const useAddProduct = () => {
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [unit, setUnit] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const categoryOptions = ["Meat", "Seafood", "Vegetables", "Fruits"];
    const unitOptions = ["1kg", "500g", "1pc", "1 bundle"];

    const handleBack = () => {
        if (router.canGoBack()) router.back();
    };

    const handleSelectImage = () => {
        setSelectedImage(
            "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80",
        );
    };

    const handleSelectCategory = () => {
        const currentIndex = categoryOptions.findIndex((item) =>
            item === category
        );
        const nextIndex =
            currentIndex === -1 || currentIndex === categoryOptions.length - 1
                ? 0
                : currentIndex + 1;

        setCategory(categoryOptions[nextIndex]);
    };

    const handleSelectUnit = () => {
        const currentIndex = unitOptions.findIndex((item) => item === unit);
        const nextIndex =
            currentIndex === -1 || currentIndex === unitOptions.length - 1
                ? 0
                : currentIndex + 1;

        setUnit(unitOptions[nextIndex]);
    };

    const handleSaveProduct = () => {
        if (!productName.trim() || !category || !price.trim() || !unit) {
            Alert.alert(
                "Incomplete details",
                "Please complete all product fields.",
            );
            return;
        }

        Alert.alert(
            "Product saved",
            "Your product has been saved successfully.",
        );
    };

    return {
        productName,
        category,
        price,
        unit,
        selectedImage,
        categoryOptions,
        unitOptions,
        handleBack,
        setProductName,
        setPrice,
        handleSelectImage,
        handleSelectCategory,
        handleSelectUnit,
        handleSaveProduct,
    };
};
