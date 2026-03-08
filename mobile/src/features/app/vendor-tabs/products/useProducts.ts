import { useMemo, useState } from "react";

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
    const categories = useMemo<Category[]>(
        () => [
            { id: "all", label: "All" },
            { id: "meat", label: "Meat" },
            { id: "seafood", label: "Seafood" },
        ],
        [],
    );

    const [selectedCategory, setSelectedCategory] = useState("all");

    const [products, setProducts] = useState<Product[]>([
        {
            id: "1",
            name: "Yellowfin Tuna",
            category: "Seafood",
            categoryKey: "seafood",
            price: "₱ 120.00/1kg",
            available: true,
            image:
                "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=1200&q=80",
        },
        {
            id: "2",
            name: "Pork Belly",
            category: "Meat",
            categoryKey: "meat",
            price: "₱ 200.00/1kg",
            available: false,
            image:
                "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80",
        },
    ]);

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
