import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";
import { router, useFocusEffect } from "expo-router";
import { Alert } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getInitials } from "@/src/utils/getInitials";

type CartItem = {
    id: string;
    productId: string;
    name: string;
    category: string;
    quantity: number;
    stock: number;
    price: string;
    priceValue: number;
    subtotal: string;
    subtotalValue: number;
    image: string;
    unitLabel: string;
    isSelected: boolean;
};

type CartGroup = {
    vendorId: string;
    vendorName: string;
    vendorImage: string | null;
    vendorInitials: string;
    totalItems: number;
    subtotal: string;
    subtotalValue: number;
    isAllSelected: boolean;
    items: CartItem[];
};

const getSingleRelation = <T>(value: T | T[] | null | undefined): T | null => {
    if (!value) return null;

    return Array.isArray(value) ? value[0] ?? null : value;
};

export const useCart = () => {
    const { session } = useAuth();

    const [loading, setLoading] = useState(true);
    const [cartGroups, setCartGroups] = useState<CartGroup[]>([]);
    const [isProceedingToCheckout, setIsProceedingToCheckout] = useState(false);
    const selectedItemIds = useRef<Set<string>>(new Set());

    // FETCH CART DATA
    const fetchCart = useCallback(async () => {
        const userId = session?.user.id;

        try {
            if (!userId) {
                throw new Error("You must be logged in to see your cart.");
            }

            const { data: cartData, error: cartError } = await supabase
                .from("carts")
                .select("id")
                .eq("user_id", userId)
                .order("id", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (cartError) throw new Error(cartError.message);

            if (!cartData) {
                setCartGroups([]);
                return;
            }

            const { data: cartItemsData, error: cartItemsError } =
                await supabase
                    .from("cart_items")
                    .select(`
                        id,
                        quantity,
                        unit_price,
                        product_id,
                        products (
                            id,
                            name,
                            category,
                            stock,
                            unit,
                            image_path,
                            vendor_id,
                            vendors (
                                id,
                                user_id,
                                users (
                                    first_name,
                                    last_name
                                )
                            )
                        )
                    `)
                    .eq("cart_id", cartData.id)
                    .order("added_at", { ascending: true });

            if (cartItemsError) throw new Error(cartItemsError.message);

            if (!cartItemsData || cartItemsData.length === 0) {
                setCartGroups([]);
                return;
            }

            const groupedCart = cartItemsData.reduce<Record<string, CartGroup>>(
                (acc, item: any) => {
                    const product = getSingleRelation(item.products);

                    if (!product) return acc;

                    const vendor = getSingleRelation(product.vendors);
                    const vendorUser = getSingleRelation(vendor?.users);

                    const vendorId = String(product.vendor_id);
                    const firstName = vendorUser?.first_name ?? "Unknown";
                    const lastName = vendorUser?.last_name ?? "Vendor";
                    const vendorName = `${firstName} ${lastName}`.trim();

                    const imagePath = product.image_path ?? "";
                    const productImageUrl = imagePath
                        ? supabase.storage.from("products").getPublicUrl(
                            imagePath,
                        ).data.publicUrl
                        : "";

                    const quantity = Number(item.quantity);
                    const stock = Number(product.stock ?? 0);
                    const unitPrice = Number(item.unit_price);
                    const subtotalValue = quantity * unitPrice;

                    if (!acc[vendorId]) {
                        acc[vendorId] = {
                            vendorId,
                            vendorName,
                            vendorImage: null,
                            vendorInitials: getInitials(firstName, lastName),
                            totalItems: 0,
                            subtotal: "₱ 0.00",
                            subtotalValue: 0,
                            isAllSelected: false,
                            items: [],
                        };
                    }

                    acc[vendorId].items.push({
                        id: String(item.id),
                        productId: String(product.id ?? item.product_id),
                        name: product.name,
                        category: product.category,
                        quantity,
                        stock,
                        price: `₱ ${unitPrice.toFixed(2)}`,
                        priceValue: unitPrice,
                        subtotal: `₱ ${subtotalValue.toFixed(2)}`,
                        subtotalValue,
                        image: productImageUrl,
                        unitLabel: `Per ${product.unit}`,
                        isSelected: selectedItemIds.current.has(
                            String(item.id),
                        ),
                    });

                    acc[vendorId].totalItems += 1;
                    acc[vendorId].subtotalValue += subtotalValue;
                    acc[vendorId].subtotal = `₱ ${
                        acc[vendorId].subtotalValue.toFixed(2)
                    }`;

                    return acc;
                },
                {},
            );

            setCartGroups(
                Object.values(groupedCart).map((group) => ({
                    ...group,
                    isAllSelected: group.items.length > 0 &&
                        group.items.every((item) => item.isSelected),
                })),
            );
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCartGroups([]);
        } finally {
            setLoading(false);
        }
    }, [session?.user.id]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        selectedItemIds.current = new Set(
            cartGroups.flatMap((group) =>
                group.items
                    .filter((item) => item.isSelected)
                    .map((item) => item.id)
            ),
        );
    }, [cartGroups]);

    const syncItemQuantity = useCallback(
        async (itemId: string, quantity: number) => {
            const { error } = await supabase
                .from("cart_items")
                .update({
                    quantity,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", itemId);

            if (error) throw new Error(error.message);
        },
        [],
    );

    const toggleVendorSelection = useCallback((vendorId: string) => {
        setCartGroups((prev) =>
            prev.map((group) => {
                if (group.vendorId !== vendorId) return group;

                const nextSelectedState = !group.items.every((item) =>
                    item.isSelected
                );

                const updatedItems = group.items.map((item) => ({
                    ...item,
                    isSelected: nextSelectedState,
                }));

                return {
                    ...group,
                    isAllSelected: nextSelectedState,
                    items: updatedItems,
                };
            })
        );
    }, []);

    const toggleItemSelection = useCallback(
        (vendorId: string, itemId: string) => {
            setCartGroups((prev) =>
                prev.map((group) => {
                    if (group.vendorId !== vendorId) return group;

                    const updatedItems = group.items.map((item) =>
                        item.id === itemId
                            ? { ...item, isSelected: !item.isSelected }
                            : item
                    );

                    return {
                        ...group,
                        isAllSelected: updatedItems.every((item) =>
                            item.isSelected
                        ),
                        items: updatedItems,
                    };
                })
            );
        },
        [],
    );

    const decreaseQuantity = useCallback(async (itemId: string) => {
        const currentItem = cartGroups
            .flatMap((group) => group.items)
            .find((item) => item.id === itemId);

        if (!currentItem || currentItem.quantity <= 1) return;

        const nextQuantity = currentItem.quantity - 1;

        try {
            setCartGroups((prev) =>
                prev.map((group) => {
                    const updatedItems = group.items.map((item) => {
                        if (item.id !== itemId) return item;

                        const nextSubtotalValue = nextQuantity *
                            item.priceValue;

                        return {
                            ...item,
                            quantity: nextQuantity,
                            subtotalValue: nextSubtotalValue,
                            subtotal: `₱ ${nextSubtotalValue.toFixed(2)}`,
                        };
                    });

                    const nextGroupSubtotalValue = updatedItems.reduce(
                        (total, item) => total + item.subtotalValue,
                        0,
                    );

                    return {
                        ...group,
                        subtotalValue: nextGroupSubtotalValue,
                        subtotal: `₱ ${nextGroupSubtotalValue.toFixed(2)}`,
                        items: updatedItems,
                    };
                })
            );

            await syncItemQuantity(itemId, nextQuantity);
        } catch (error) {
            console.error("Error decreasing quantity:", error);
            Alert.alert("Error", "Failed to update quantity.");
        }
    }, [cartGroups, syncItemQuantity]);

    const increaseQuantity = useCallback(async (itemId: string) => {
        const currentItem = cartGroups
            .flatMap((group) => group.items)
            .find((item) => item.id === itemId);

        if (!currentItem) return;

        const nextQuantity = currentItem.quantity + 1;

        try {
            setCartGroups((prev) =>
                prev.map((group) => {
                    const updatedItems = group.items.map((item) => {
                        if (item.id !== itemId) return item;

                        const nextSubtotalValue = nextQuantity *
                            item.priceValue;

                        return {
                            ...item,
                            quantity: nextQuantity,
                            subtotalValue: nextSubtotalValue,
                            subtotal: `₱ ${nextSubtotalValue.toFixed(2)}`,
                        };
                    });

                    const nextGroupSubtotalValue = updatedItems.reduce(
                        (total, item) => total + item.subtotalValue,
                        0,
                    );

                    return {
                        ...group,
                        subtotalValue: nextGroupSubtotalValue,
                        subtotal: `₱ ${nextGroupSubtotalValue.toFixed(2)}`,
                        items: updatedItems,
                    };
                })
            );

            await syncItemQuantity(itemId, nextQuantity);
        } catch (error) {
            console.error("Error increasing quantity:", error);
            Alert.alert("Error", "Failed to update quantity.");
        }
    }, [cartGroups, syncItemQuantity]);

    const deleteCartItem = useCallback(
        async (vendorId: string, itemId: string) => {
            try {
                const { error } = await supabase
                    .from("cart_items")
                    .delete()
                    .eq("id", itemId);

                if (error) throw new Error(error.message);

                setCartGroups((prev) =>
                    prev
                        .map((group) => {
                            if (group.vendorId !== vendorId) return group;

                            const updatedItems = group.items.filter((item) =>
                                item.id !== itemId
                            );

                            const nextGroupSubtotalValue = updatedItems.reduce(
                                (total, item) => total + item.subtotalValue,
                                0,
                            );

                            return {
                                ...group,
                                totalItems: updatedItems.length,
                                subtotalValue: nextGroupSubtotalValue,
                                subtotal: `₱ ${
                                    nextGroupSubtotalValue.toFixed(2)
                                }`,
                                isAllSelected: updatedItems.length > 0 &&
                                    updatedItems.every((item) =>
                                        item.isSelected
                                    ),
                                items: updatedItems,
                            };
                        })
                        .filter((group) => group.items.length > 0)
                );
            } catch (error) {
                console.error("Error deleting cart item:", error);
                Alert.alert("Error", "Failed to delete item.");
            }
        },
        [],
    );

    const cartCount = useMemo(() => {
        return cartGroups.reduce(
            (total, group) => total + group.items.length,
            0,
        );
    }, [cartGroups]);

    const selectedSubtotal = useMemo(() => {
        const subtotalValue = cartGroups.reduce((total, group) => {
            const groupSelectedSubtotal = group.items.reduce(
                (itemTotal, item) => {
                    if (!item.isSelected) return itemTotal;

                    return itemTotal + item.subtotalValue;
                },
                0,
            );

            return total + groupSelectedSubtotal;
        }, 0);

        return `₱ ${subtotalValue.toFixed(2)}`;
    }, [cartGroups]);

    const selectedCheckoutItems = useMemo(() => {
        return cartGroups.flatMap((group) =>
            group.items
                .filter((item) => item.isSelected)
                .map((item) => ({
                    cartItemId: item.id,
                    productId: item.productId,
                    vendorId: group.vendorId,
                    vendorName: group.vendorName,
                    vendorImage: null,
                    vendorInitials: group.vendorInitials,
                    productName: item.name,
                    quantity: item.quantity,
                    unitPrice: item.priceValue,
                    subtotal: item.subtotalValue,
                    image: item.image,
                }))
        );
    }, [cartGroups]);

    const handleProceedToCheckout = useCallback(async () => {
        if (selectedCheckoutItems.length === 0) {
            Alert.alert(
                "No selected items",
                "Please select at least one item.",
            );
            return;
        }

        try {
            setIsProceedingToCheckout(true);

            const productIds = selectedCheckoutItems.map((item) =>
                Number(item.productId)
            );

            const { data: latestProducts, error: latestProductsError } =
                await supabase
                    .from("products")
                    .select("id, stock")
                    .in("id", productIds);

            if (latestProductsError) {
                throw new Error(latestProductsError.message);
            }

            const latestStockByProductId = new Map(
                (latestProducts ?? []).map((product) => [
                    String(product.id),
                    Number(product.stock ?? 0),
                ]),
            );

            const hasInsufficientStock = selectedCheckoutItems.some((item) => {
                const currentStock = latestStockByProductId.get(item.productId);

                return currentStock === undefined ||
                    item.quantity > currentStock;
            });

            if (hasInsufficientStock) {
                Alert.alert(
                    "Insufficient Stock",
                    "One or more selected items no longer have enough stock for the quantity in your cart.",
                );
                await fetchCart();
                return;
            }

            router.push({
                pathname: "/checkout",
                params: {
                    selectedItems: JSON.stringify(selectedCheckoutItems),
                },
            });
        } catch (error) {
            console.error("Error proceeding to checkout:", error);
            Alert.alert("Error", "Failed to proceed to checkout.");
        } finally {
            setIsProceedingToCheckout(false);
        }
    }, [fetchCart, selectedCheckoutItems]);

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    const handleBrowseProducts = useCallback(() => {
        router.back();
    }, []);

    const handleDeleteCartItem = useCallback(
        (vendorId: string, itemId: string, itemName: string) => {
            Alert.alert(
                "Confirm Delete",
                `Are you sure you want to delete item ${itemName}?`,
                [
                    { text: "Cancel" },
                    {
                        text: "Ok",
                        onPress: () => {
                            deleteCartItem(vendorId, itemId);
                        },
                    },
                ],
            );
        },
        [],
    );

    return {
        loading,
        cartGroups,
        cartCount,
        selectedSubtotal,
        isProceedingToCheckout,
        handleBack,
        handleBrowseProducts,
        toggleVendorSelection,
        toggleItemSelection,
        decreaseQuantity,
        increaseQuantity,
        handleDeleteCartItem,
        handleProceedToCheckout,
    };
};
