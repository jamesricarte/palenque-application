import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

const orderTabs = ["New", "Confirmed", "Preparing", "Ready", "Completed", "Cancelled"];

type VendorOrderStatus =
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";

type VendorOrderItem = {
    id: string;
    name: string;
    priceLabel: string;
    unit: string;
    quantity: number;
    image: string;
};

type VendorOrderCard = {
    id: string;
    orderNumber: string;
    customerName: string;
    status: VendorOrderStatus;
    totalAmount: string;
    createdAt: string;
    paymentMethod: string;
    orderItems: VendorOrderItem[];
};

const getSingleRelation = <T>(value: T | T[] | null | undefined): T | null => {
    if (!value) return null;

    return Array.isArray(value) ? value[0] ?? null : value;
};

const formatCurrency = (value: number) => `₱ ${value.toFixed(2)}`;

const formatPaymentMethod = (value: string | null | undefined) => {
    if (value === "cash_on_delivery") return "Cash on Delivery";
    if (value === "e_payment") return "E-Payment";

    return "Unknown";
};

const formatCreatedAt = (value: string | null | undefined) => {
    if (!value) return "Unknown date";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Unknown date";

    const dateLabel = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const timeLabel = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });

    return `${dateLabel}, ${timeLabel}`;
};

export const useVendorOrders = () => {
    const [activeTab, setActiveTab] = useState("New");
    const [orders, setOrders] = useState<VendorOrderCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingOrderId, setProcessingOrderId] = useState<string | null>(
        null,
    );
    const { vendorData } = useAuth();

    const handleBack = () => {
        if (router.canGoBack()) router.back();
    };

    const fetchVendorOrders = useCallback(async () => {
        const vendorId = vendorData?.id;

        try {
            setLoading(true);

            if (!vendorId) {
                setOrders([]);
                return;
            }

            const { data, error } = await supabase
                .from("vendor_orders")
                .select(`
                    id,
                    status,
                    subtotal,
                    order_id,
                    orders (
                        id,
                        order_number,
                        total_amount,
                        payment_method,
                        created_at,
                        users (
                            first_name,
                            last_name
                        )
                    ),
                    order_items (
                        id,
                        quantity,
                        product_name,
                        unit,
                        unit_price,
                        products (
                            id,
                            image_path
                        )
                    )
                `)
                .eq("vendor_id", vendorId)
                .order("id", { ascending: false });

            if (error) throw new Error(error.message);

            const mappedOrders = (data ?? []).map((vendorOrder: any) => {
                const order = getSingleRelation(vendorOrder?.orders);
                const customer = getSingleRelation(order?.users);
                const firstName = customer?.first_name ?? "Unknown";
                const lastName = customer?.last_name ?? "Customer";
                const customerName = `${firstName} ${lastName}`.trim();
                const orderItems = (Array.isArray(vendorOrder?.order_items)
                    ? vendorOrder.order_items
                    : []).map((item: any) => {
                    const product = getSingleRelation(item?.products);
                    const imagePath = product?.image_path ?? "";
                    const imageUrl = imagePath
                        ? supabase.storage.from("products")
                            .getPublicUrl(
                                imagePath,
                            ).data.publicUrl
                        : "";

                    return {
                        id: String(item.id),
                        name: item.product_name ?? "Unknown Product",
                        priceLabel: formatCurrency(
                            Number(item.unit_price ?? 0),
                        ),
                        unit: `Per ${item.unit ?? ""}`.trim(),
                        quantity: Number(item.quantity ?? 0),
                        image: imageUrl,
                    };
                });

                return {
                    id: String(vendorOrder.id),
                    orderNumber: order?.order_number ??
                        `ORD-${vendorOrder.order_id}`,
                    customerName: customerName || "Unknown Customer",
                    status: (vendorOrder?.status ?? "pending") as VendorOrderStatus,
                    totalAmount: formatCurrency(
                        Number(vendorOrder?.subtotal ?? order?.total_amount ?? 0),
                    ),
                    createdAt: formatCreatedAt(order?.created_at),
                    paymentMethod: formatPaymentMethod(order?.payment_method),
                    orderItems,
                };
            });

            setOrders(mappedOrders);
        } catch (error) {
            console.error("Error fetching vendor orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [vendorData?.id]);

    useFocusEffect(
        useCallback(() => {
            fetchVendorOrders();
        }, [fetchVendorOrders]),
    );

    const updateOrderStatus = useCallback(
        async (
            orderId: string,
            nextStatus: VendorOrderStatus,
            successTitle: string,
            successMessage: string,
        ) => {
            try {
                setProcessingOrderId(orderId);

                const { error } = await supabase
                    .from("vendor_orders")
                    .update({ status: nextStatus })
                    .eq("id", orderId);

                if (error) throw new Error(error.message);

                Alert.alert(successTitle, successMessage);
                await fetchVendorOrders();
            } catch (error: any) {
                console.error("Error updating vendor order status:", error);
                Alert.alert(
                    "Error",
                    error?.message || "Failed to update order status.",
                );
            } finally {
                setProcessingOrderId(null);
            }
        },
        [fetchVendorOrders],
    );

    const handleAcceptOrder = useCallback((orderId: string) => {
        Alert.alert(
            "Accept Order",
            "Are you sure you want to accept this order?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Accept",
                    onPress: () =>
                        updateOrderStatus(
                            orderId,
                            "confirmed",
                            "Order Accepted",
                            "The order has been confirmed.",
                        ),
                },
            ],
        );
    }, [updateOrderStatus]);

    const handleDeclineOrder = useCallback((orderId: string) => {
        Alert.alert(
            "Decline Order",
            "Are you sure you want to decline this order?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Decline",
                    style: "destructive",
                    onPress: () =>
                        updateOrderStatus(
                            orderId,
                            "cancelled",
                            "Order Declined",
                            "The order has been declined.",
                        ),
                },
            ],
        );
    }, [updateOrderStatus]);

    const handleAdvanceOrderStatus = useCallback(
        (orderId: string, currentStatus: VendorOrderStatus) => {
            if (currentStatus === "confirmed") {
                Alert.alert(
                    "Start Preparing",
                    "Are you sure you want to start preparing this order?",
                    [
                        {
                            text: "Cancel",
                            style: "cancel",
                        },
                        {
                            text: "Confirm",
                            onPress: () =>
                                updateOrderStatus(
                                    orderId,
                                    "preparing",
                                    "Order Updated",
                                    "The order is now being prepared.",
                                ),
                        },
                    ],
                );

                return;
            }

            if (currentStatus === "preparing") {
                Alert.alert(
                    "Done Preparing",
                    "Are you sure this order is ready?",
                    [
                        {
                            text: "Cancel",
                            style: "cancel",
                        },
                        {
                            text: "Confirm",
                            onPress: () =>
                                updateOrderStatus(
                                    orderId,
                                    "ready",
                                    "Order Updated",
                                    "The order has been marked as ready.",
                                ),
                        },
                    ],
                );

                return;
            }

            if (currentStatus === "ready") {
                Alert.alert(
                    "Complete Order",
                    "Are you sure you want to mark this order as completed?",
                    [
                        {
                            text: "Cancel",
                            style: "cancel",
                        },
                        {
                            text: "Confirm",
                            onPress: () =>
                                updateOrderStatus(
                                    orderId,
                                    "completed",
                                    "Order Completed",
                                    "The order has been marked as completed.",
                                ),
                        },
                    ],
                );
            }
        },
        [updateOrderStatus],
    );

    const filteredOrders = useMemo(() => {
        if (activeTab === "New") {
            return orders.filter((order) => order.status === "pending");
        }

        if (activeTab === "Preparing") {
            return orders.filter((order) => order.status === "preparing");
        }

        if (activeTab === "Confirmed") {
            return orders.filter((order) => order.status === "confirmed");
        }

        if (activeTab === "Ready") {
            return orders.filter((order) => order.status === "ready");
        }

        if (activeTab === "Completed") {
            return orders.filter((order) => order.status === "completed");
        }

        if (activeTab === "Cancelled") {
            return orders.filter((order) => order.status === "cancelled");
        }

        return orders;
    }, [activeTab, orders]);

    return {
        activeTab,
        setActiveTab,
        orderTabs,
        orders: filteredOrders,
        loading,
        processingOrderId,
        handleBack,
        handleAcceptOrder,
        handleDeclineOrder,
        handleAdvanceOrderStatus,
    };
};
