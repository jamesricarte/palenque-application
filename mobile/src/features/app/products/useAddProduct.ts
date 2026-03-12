import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";

export const useAddProduct = () => {
    const { vendorData } = useAuth();

    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [unit, setUnit] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const categoryOptions = ["Meat", "Seafood", "Vegetables", "Fruits"];
    const unitOptions = ["1kg", "500g", "1pc", "1 bundle"];

    const handleBack = () => {
        if (router.canGoBack()) router.back();
    };

    const handleSelectImage = async () => {
        try {
            const permissionResult = await ImagePicker
                .requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert(
                    "Permission required",
                    "Please allow access to your photo library to select a product image.",
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (result.canceled) return;

            const asset = result.assets?.[0];

            if (!asset?.uri) {
                Alert.alert(
                    "Image selection failed",
                    "Unable to get the selected image.",
                );
                return;
            }

            setSelectedImage(asset.uri);
        } catch (error) {
            console.error(error);
            Alert.alert(
                "Image selection failed",
                "Something went wrong while selecting the image.",
            );
        }
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

    const handleSaveProduct = async () => {
        try {
            if (isSaving) return;

            const vendorId = vendorData?.id;

            if (!vendorId) {
                Alert.alert(
                    "Session required",
                    "Unable to get your account session. Please log in again.",
                );
                return;
            }

            if (!selectedImage) {
                Alert.alert(
                    "Image required",
                    "Please select a product image.",
                );
                return;
            }

            if (!productName.trim()) {
                Alert.alert(
                    "Product name required",
                    "Please enter the product name.",
                );
                return;
            }

            if (!category) {
                Alert.alert(
                    "Category required",
                    "Please select a product category.",
                );
                return;
            }

            if (!price.trim()) {
                Alert.alert(
                    "Price required",
                    "Please enter the product price.",
                );
                return;
            }

            const numericPrice = Number(price);

            if (Number.isNaN(numericPrice) || numericPrice <= 0) {
                Alert.alert(
                    "Invalid price",
                    "Please enter a valid price greater than 0.",
                );
                return;
            }

            if (!unit) {
                Alert.alert(
                    "Unit required",
                    "Please select a unit.",
                );
                return;
            }

            setIsSaving(true);

            const fileNameFromUri = selectedImage.split("/").pop() ||
                `product-image-${Date.now()}.jpg`;
            const sanitizedFileName = fileNameFromUri.replace(
                /[^a-zA-Z0-9._-]/g,
                "_",
            );
            const imagePath =
                `product-images/vendor-${vendorId}/${sanitizedFileName}`;

            const imageResponse = await fetch(selectedImage);
            const imageArrayBuffer = await imageResponse.arrayBuffer();

            const { error: uploadError } = await supabase.storage
                .from("products")
                .upload(imagePath, imageArrayBuffer, {
                    upsert: false,
                    contentType: "image/jpeg",
                });

            if (uploadError) {
                prettyLog(uploadError);
                throw new Error(uploadError.message);
            }

            const { error: insertError } = await supabase
                .from("products")
                .insert({
                    vendor_id: vendorId,
                    name: productName.trim(),
                    category: category,
                    price: numericPrice,
                    unit,
                    image_path: imagePath,
                });

            if (insertError) throw new Error(insertError.message);

            Alert.alert(
                "Product saved",
                "Your product has been saved successfully.",
            );

            setProductName("");
            setCategory("");
            setPrice("");
            setUnit("");
            setSelectedImage(null);

            if (router.canGoBack()) router.back();
        } catch (error) {
            console.error(error);

            Alert.alert(
                "Save failed",
                error instanceof Error
                    ? error.message
                    : "Something went wrong while saving the product.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    return {
        productName,
        category,
        price,
        unit,
        selectedImage,
        categoryOptions,
        unitOptions,
        isSaving,
        handleBack,
        setProductName,
        setPrice,
        handleSelectImage,
        handleSelectCategory,
        handleSelectUnit,
        handleSaveProduct,
    };
};
