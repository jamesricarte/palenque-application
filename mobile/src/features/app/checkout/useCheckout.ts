import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

type CheckoutItem = {
    cartItemId?: string;
    productId: string;
    vendorId: string;
    vendorName: string;
    vendorImage: string | null;
    vendorInitials: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    image: string;
};

type VendorGroup = {
    vendorId: string;
    vendorName: string;
    vendorImage: string | null;
    vendorInitials: string;
    items: CheckoutItem[];
};

type UserAddress = {
    id: number;
    owner_id: string;
    owner_type: "user" | "vendor";
    street_address: string;
    barangay: string;
    city: string;
    province: string;
    postal_code: string | null;
    is_default: boolean;
    addressLabel: string | null;
};

export const useCheckout = () => {
    const { session, user, isLoading: isAuthLoading } = useAuth();
    const { selectedItems } = useLocalSearchParams<{ selectedItems: string }>();
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(
        null,
    );
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const parsedItems: CheckoutItem[] = selectedItems
        ? JSON.parse(selectedItems)
        : [];

    // GROUP BY VENDOR
    const vendorGroups: VendorGroup[] = useMemo(() => {
        const groups: Record<string, VendorGroup> = {};

        parsedItems.forEach((item) => {
            if (!groups[item.vendorId]) {
                groups[item.vendorId] = {
                    vendorId: item.vendorId,
                    vendorName: item.vendorName,
                    vendorImage: null,
                    vendorInitials: item.vendorInitials,
                    items: [],
                };
            }

            groups[item.vendorId].items.push(item);
        });

        return Object.values(groups);
    }, [parsedItems]);

    const subtotalValue = useMemo(() => {
        return parsedItems.reduce((total, item) => total + item.subtotal, 0);
    }, [parsedItems]);

    const deliveryFeeValue = 50;

    const totalValue = subtotalValue + deliveryFeeValue;

    const subtotal = `₱ ${subtotalValue.toFixed(2)}`;
    const deliveryFee = `₱ ${deliveryFeeValue.toFixed(2)}`;
    const totalAmount = `₱ ${totalValue.toFixed(2)}`;

    const handleBack = () => {
        router.back();
    };

    const fetchAddresses = useCallback(async () => {
        const userId = session?.user.id;

        try {
            setLoading(true);

            if (!userId) {
                setAddresses([]);
                setSelectedAddress(null);
                return;
            }

            const { data, error } = await supabase
                .from("addresses")
                .select(`
                    id,
                    owner_id,
                    owner_type,
                    street_address,
                    barangay,
                    city,
                    province,
                    postal_code,
                    is_default,
                    address_types (
                        display_name
                    )
                `)
                .eq("owner_type", "user")
                .eq("owner_id", userId)
                .order("is_default", { ascending: false })
                .order("created_at", { ascending: false });

            if (error) throw new Error(error.message);

            const formattedAddresses = (data ?? []).map((address: any) => ({
                id: Number(address.id),
                owner_id: address.owner_id,
                owner_type: address.owner_type,
                street_address: address.street_address,
                barangay: address.barangay,
                city: address.city,
                province: address.province,
                postal_code: address.postal_code,
                is_default: Boolean(address.is_default),
                addressLabel:
                    (Array.isArray(address.address_types)
                        ? address.address_types[0]?.display_name
                        : address.address_types?.display_name) ?? null,
            }));

            setAddresses(formattedAddresses);
            setSelectedAddress((prev) => {
                if (!formattedAddresses.length) return null;

                const matchedAddress = formattedAddresses.find((address) =>
                    address.id === prev?.id
                );

                if (matchedAddress) return matchedAddress;

                return formattedAddresses.find((address) => address.is_default) ??
                    formattedAddresses[0];
            });
        } catch (error) {
            console.error("Error fetching addresses:", error);
            setAddresses([]);
            setSelectedAddress(null);
        } finally {
            setLoading(false);
        }
    }, [session?.user.id]);

    useEffect(() => {
        if (isAuthLoading) return;

        fetchAddresses();
    }, [fetchAddresses, isAuthLoading]);

    const openAddressModal = useCallback(() => {
        setIsAddressModalVisible(true);
    }, []);

    const closeAddressModal = useCallback(() => {
        setIsAddressModalVisible(false);
    }, []);

    const handleSelectAddress = useCallback((address: UserAddress) => {
        setSelectedAddress(address);
        setIsAddressModalVisible(false);
    }, []);

    const handlePlaceOrder = useCallback(async () => {
        const userId = session?.user.id;

        try {
            setIsPlacingOrder(true);

            if (!userId) {
                throw new Error("You must be logged in to place an order.");
            }

            if (!selectedAddress) {
                throw new Error("Please select a delivery address first.");
            }

            if (parsedItems.length === 0) {
                throw new Error("No items found for checkout.");
            }

            const orderNumber =
                `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const { data: createdOrder, error: createOrderError } =
                await supabase
                    .from("orders")
                    .insert({
                        user_id: userId,
                        order_number: orderNumber,
                        total_amount: totalValue,
                        shipping_address_id: selectedAddress.id,
                        payment_method: "cash_on_delivery",
                        payment_status: "pending",
                        status: "pending_payment",
                    })
                    .select("id")
                    .maybeSingle();

            if (createOrderError) {
                throw new Error(createOrderError.message);
            }

            if (!createdOrder?.id) {
                throw new Error("Failed to create order.");
            }

            for (const group of vendorGroups) {
                const vendorId = Number(group.vendorId);

                if (Number.isNaN(vendorId)) {
                    throw new Error("A vendor reference is missing for one of the items.");
                }

                const vendorSubtotal = group.items.reduce(
                    (sum, item) => sum + item.subtotal,
                    0,
                );

                const { data: createdVendorOrder, error: createVendorOrderError } =
                    await supabase
                        .from("vendor_orders")
                        .insert({
                            order_id: createdOrder.id,
                            vendor_id: vendorId,
                            status: "pending",
                            subtotal: vendorSubtotal,
                        })
                        .select("id")
                        .maybeSingle();

                if (createVendorOrderError) {
                    throw new Error(createVendorOrderError.message);
                }

                if (!createdVendorOrder?.id) {
                    throw new Error("Failed to create vendor order.");
                }

                const orderItemsPayload = group.items.map((item) => ({
                    product_id: Number(item.productId),
                    vendor_order_id: createdVendorOrder.id,
                    product_name: item.productName,
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
                }));

                if (
                    orderItemsPayload.some((item) => Number.isNaN(item.product_id))
                ) {
                    throw new Error("A product reference is missing for one of the items.");
                }

                const { error: createOrderItemsError } = await supabase
                    .from("order_items")
                    .insert(orderItemsPayload);

                if (createOrderItemsError) {
                    throw new Error(createOrderItemsError.message);
                }
            }

            const cartItemIds = parsedItems
                .map((item) => item.cartItemId)
                .filter((value): value is string => Boolean(value))
                .map((value) => Number(value));

            if (cartItemIds.length > 0) {
                const { error: deleteCartItemsError } = await supabase
                    .from("cart_items")
                    .delete()
                    .in("id", cartItemIds);

                if (deleteCartItemsError) {
                    throw new Error(deleteCartItemsError.message);
                }
            }

            router.replace({
                pathname: "/(app)/orders/order-confirmation",
                params: {
                    orderNumber,
                    vendorName: vendorGroups.map((group) => group.vendorName)
                        .join(", "),
                    paymentMethod: "cash_on_delivery",
                    totalAmount,
                },
            });
        } catch (error: any) {
            const message = error?.message || "Failed to place order.";

            console.error("Error placing order:", error);
            Alert.alert("Error", message);
        } finally {
            setIsPlacingOrder(false);
        }
    }, [
        parsedItems,
        selectedAddress,
        session?.user.id,
        totalValue,
        vendorGroups,
    ]);

    return {
        loading: loading || isAuthLoading,
        addresses,
        selectedAddress,
        isAddressModalVisible,
        isPlacingOrder,
        user,
        vendorGroups,
        subtotal,
        deliveryFee,
        totalAmount,
        handleBack,
        openAddressModal,
        closeAddressModal,
        handleSelectAddress,
        handlePlaceOrder,
    };
};
