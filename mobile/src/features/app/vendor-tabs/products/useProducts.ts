import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

type Category = {
    id: string;
    label: string;
};

type Product = {
    id: string;
    name: string;
    category: string;
    categoryKey: string;
    price: string;
    available: boolean;
    image: string;
};

export const useProducts = () => {
    const { vendorData } = useAuth();

    const [products, setProducts] = useState<Product[]>([]);

    useFocusEffect(
        useCallback(() => {
            const fetchProducts = async () => {
                const vendorId = vendorData?.id;

                try {
                    if (!vendorId) throw new Error("User id is required");

                    const { data, error } = await supabase.from("products")
                        .select().eq("vendor_id", vendorId);

                    if (error) throw new Error(error.message);

                    if (data) {
                        setProducts(
                            data.map((product) => {
                                const { data: imageData } = supabase.storage
                                    .from("products")
                                    .getPublicUrl(product.image_path);

                                const categoryKey = product.categories
                                    .toLowerCase();

                                return {
                                    id: String(product.id),
                                    name: product.name,
                                    category: product.categories,
                                    categoryKey: categoryKey,
                                    price: `₱ ${product.price}/${product.unit}`,
                                    image: imageData.publicUrl,
                                    available: true,
                                };
                            }),
                        );
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            fetchProducts();
        }, []),
    );

    const categories = useMemo<Category[]>(
        () => [
            { id: "all", label: "All" },
            { id: "meat", label: "Meat" },
            { id: "seafood", label: "Seafood" },
        ],
        [],
    );

    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredProducts = useMemo(() => {
        if (selectedCategory === "all") return products;

        return products.filter(
            (product) => product.categoryKey === selectedCategory,
        );
    }, [products, selectedCategory]);

    const toggleAvailability = (productId: string) => {
        setProducts((prev) =>
            prev.map((product) =>
                product.id === productId
                    ? { ...product, available: !product.available }
                    : product
            )
        );
    };

    return {
        categories,
        selectedCategory,
        setSelectedCategory,
        products,
        filteredProducts,
        toggleAvailability,
    };
};
