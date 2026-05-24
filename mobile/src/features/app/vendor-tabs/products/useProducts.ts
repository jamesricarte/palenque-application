import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";
import { useEffect, useMemo, useState } from "react";

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const vendorId = vendorData?.id;

            try {
                setLoading(true);

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

                            const categoryKey = product.category
                                .toLowerCase();

                            return {
                                id: String(product.id),
                                name: product.name,
                                category: product.category,
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
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const categories = useMemo<Category[]>(
        () => [
            { id: "all", label: "All" },
            { id: "meat", label: "Meat" },
            { id: "seafood", label: "Seafood" },
            { id: "poultry", label: "Poultry" },
            { id: "fruits", label: "Fruits" },
            { id: "vegetable", label: "Vegetables" },
            { id: "others", label: "Others" },
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
        loading,
        toggleAvailability,
    };
};
