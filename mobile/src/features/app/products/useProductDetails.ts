import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";
import { getInitials } from "@/src/utils/getInitials";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

type ProductDetails = {
    id: string;
    name: string;
    category: string;
    price: string;
    priceValue: number;
    unit: string;
    image: string;
    vendorId: string | null;
    vendorName: string;
    vendorImage: string | null;
    vendorInitials: string;
};

type ModalAction = "cart" | "buy" | null;

export const useProductDetails = (fetchCartCount: () => void) => {
    const { productId } = useLocalSearchParams<{ productId: string }>();
    const { session } = useAuth();

    const [product, setProduct] = useState<ProductDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);
    const [modalAction, setModalAction] = useState<ModalAction>(null);
    const [isConfirming, setIsConfirming] = useState<boolean>(false);

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    const fetchProductDetails = useCallback(async () => {
        try {
            setLoading(true);

            if (!productId) throw new Error("Product id is required.");

            const { data: productData, error: productError } = await supabase
                .from("products")
                .select()
                .eq("id", productId)
                .maybeSingle();

            if (productError) throw new Error(productError.message);

            if (!productData) throw new Error("Product does not exist.");

            const { data: vendorData, error: vendorError } = await supabase
                .from("vendors")
                .select("id, user_id")
                .eq("id", productData.vendor_id)
                .maybeSingle();

            if (vendorError) throw new Error(vendorError.message);

            let vendorInfo: {
                id: string | null;
                firstName: string;
                lastName: string;
            } = {
                id: vendorData?.id || null,
                firstName: "Unknown",
                lastName: "Vendor",
            };

            if (vendorData?.user_id) {
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("first_name, last_name")
                    .eq("user_id", vendorData.user_id)
                    .maybeSingle();

                if (userError) throw new Error(userError.message);

                if (userData?.first_name || userData?.last_name) {
                    vendorInfo = {
                        id: vendorData.id || null,
                        firstName: userData.first_name,
                        lastName: userData.last_name,
                    };
                }
            }

            const { data: imageData } = supabase.storage
                .from("products")
                .getPublicUrl(productData.image_path);

            setProduct({
                id: String(productData.id),
                name: productData.name,
                category: productData.category,
                price: `₱ ${productData.price}/${productData.unit}`,
                priceValue: Number(productData.price),
                unit: productData.unit,
                image: imageData.publicUrl,
                vendorId: vendorInfo.id,
                vendorName: `${vendorInfo.firstName} ${vendorInfo.lastName}`,
                vendorImage: null,
                vendorInitials: getInitials(
                    vendorInfo.firstName,
                    vendorInfo.lastName,
                ),
            });
        } catch (error) {
            console.error("Error fetching product details:", error);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails]);

    const openQuantityModal = useCallback(
        (action: Exclude<ModalAction, null>) => {
            setModalAction(action);
            setQuantity(1);
            setIsQuantityModalVisible(true);
        },
        [],
    );

    const closeQuantityModal = useCallback(() => {
        setIsQuantityModalVisible(false);
        setModalAction(null);
    }, []);

    const increaseQuantity = useCallback(() => {
        setQuantity((prev) => prev + 1);
    }, []);

    const decreaseQuantity = useCallback(() => {
        setQuantity((prev) => {
            if (prev <= 1) return 1;

            return prev - 1;
        });
    }, []);

    const subtotal = useMemo(() => {
        const priceValue = product?.priceValue ?? 0;

        return `₱ ${(priceValue * quantity).toFixed(2)}`;
    }, [product, quantity]);

    const handleAddToCart = useCallback(async () => {
        const userId = session?.user.id;

        try {
            setIsConfirming(true);

            if (!product) throw new Error("Product details are required.");

            if (!userId) {
                throw new Error("You must be logged in to add to cart.");
            }

            const { data: existingCart, error: existingCartError } =
                await supabase
                    .from("carts")
                    .select("id")
                    .eq("user_id", userId)
                    .maybeSingle();

            if (existingCartError) throw new Error(existingCartError.message);

            let cartId = existingCart?.id;

            if (!cartId) {
                const { data: newCart, error: createCartError } = await supabase
                    .from("carts")
                    .insert({
                        user_id: userId,
                    })
                    .select("id")
                    .maybeSingle();

                if (createCartError) throw new Error(createCartError.message);

                if (!newCart) throw new Error("Failed to create cart.");

                cartId = newCart.id;
            }

            const { data: existingCartItem, error: existingCartItemError } =
                await supabase
                    .from("cart_items")
                    .select("id, quantity")
                    .eq("cart_id", cartId)
                    .eq("product_id", Number(product.id))
                    .maybeSingle();

            if (existingCartItemError) {
                throw new Error(existingCartItemError.message);
            }

            if (existingCartItem) {
                const { error: updateCartItemError } = await supabase
                    .from("cart_items")
                    .update({
                        quantity: existingCartItem.quantity + quantity,
                        unit_price: product.priceValue,
                    })
                    .eq("id", existingCartItem.id);

                if (updateCartItemError) {
                    throw new Error(updateCartItemError.message);
                }
            } else {
                const { error: insertCartItemError } = await supabase
                    .from("cart_items")
                    .insert({
                        cart_id: cartId,
                        product_id: Number(product.id),
                        quantity,
                        unit_price: product.priceValue,
                    });

                if (insertCartItemError) {
                    throw new Error(insertCartItemError.message);
                }
            }

            fetchCartCount();
            closeQuantityModal();
            Alert.alert("Success", "Product added to cart.");
        } catch (error) {
            console.error("Error adding product to cart:", error);
            Alert.alert("Error", "Failed to add product to cart.");
        } finally {
            setIsConfirming(false);
        }
    }, [closeQuantityModal, product, quantity]);

    const handleConfirmQuantityAction = useCallback(async () => {
        if (modalAction === "buy") {
            if (!product) return;

            const checkoutItem = [
                {
                    productId: product.id,
                    vendorId: product.vendorId,
                    vendorName: product.vendorName,
                    vendorImage: null,
                    vendorInitials: product.vendorInitials,
                    productName: product.name,
                    quantity,
                    unitPrice: product.priceValue,
                    subtotal: product.priceValue * quantity,
                    image: product.image,
                },
            ];

            closeQuantityModal();

            router.push({
                pathname: "/(app)/checkout",
                params: {
                    selectedItems: JSON.stringify(checkoutItem),
                },
            });

            return;
        }

        if (modalAction === "cart") {
            await handleAddToCart();
            return;
        }
    }, [closeQuantityModal, handleAddToCart, modalAction]);

    return {
        product,
        loading,
        quantity,
        subtotal,
        isQuantityModalVisible,
        modalAction,
        handleBack,
        openQuantityModal,
        closeQuantityModal,
        increaseQuantity,
        decreaseQuantity,
        handleConfirmQuantityAction,
        isConfirming,
    };
};
