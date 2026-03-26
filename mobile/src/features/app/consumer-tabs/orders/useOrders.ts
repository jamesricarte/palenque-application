import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";
import { getInitials } from "@/src/utils/getInitials";

const orderTabs = [
    "All",
    "Pending",
    "Preparing",
    "On the Way",
    "Completed",
    "Cancelled",
];

type OrderStatus =
    | "pending"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";

type OrderItem = {
    id: string;
    name: string;
    priceLabel: string;
    unit: string;
    quantity: number;
    image: string;
};

type VendorOrder = {
    id: string;
    vendorName: string;
    vendorImage: string | null;
    vendorInitials: string;
    items: OrderItem[];
};

type OrderCard = {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: string;
    totalItems: number;
    createdAt: string;
    paymentMethod: string;
    vendorOrders: VendorOrder[];
};

const getSingleRelation = <T>(value: T | T[] | null | undefined): T | null => {
    if (!value) return null;

    return Array.isArray(value) ? value[0] ?? null : value;
};

const statusPriority: Record<OrderStatus, number> = {
    pending: 1,
    preparing: 2,
    ready: 3,
    completed: 4,
    cancelled: 5,
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

const getSlowestStatus = (
    statuses: Array<string | null | undefined>,
): OrderStatus => {
    const sanitizedStatuses = statuses.filter(
        (status): status is OrderStatus =>
            status === "pending" ||
            status === "preparing" ||
            status === "ready" ||
            status === "completed" ||
            status === "cancelled",
    );

    if (sanitizedStatuses.length === 0) return "pending";

    if (sanitizedStatuses.every((status) => status === "cancelled")) {
        return "cancelled";
    }

    const activeStatuses = sanitizedStatuses.filter((status) =>
        status !== "cancelled"
    );

    return activeStatuses.reduce<OrderStatus>(
        (slowest, current) =>
            statusPriority[current] < statusPriority[slowest]
                ? current
                : slowest,
        activeStatuses[0] ?? "pending",
    );
};

export const useOrders = () => {
    const { session } = useAuth();

    const [activeTab, setActiveTab] = useState("All");
    const [orders, setOrders] = useState<OrderCard[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        const userId = session?.user.id;

        try {
            if (!userId) {
                setOrders([]);
                return;
            }

            const { data, error } = await supabase
                .from("orders")
                .select(`
                    id,
                    order_number,
                    total_amount,
                    payment_method,
                    created_at,
                    vendor_orders (
                        id,
                        status,
                        vendor_id,
                        vendors (
                            id,
                            user_id,
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
                    )
                `)
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (error) throw new Error(error.message);

            const mappedOrders = (data ?? []).map((order: any) => {
                const vendorOrders = (Array.isArray(order.vendor_orders)
                    ? order.vendor_orders
                    : []).map((vendorOrder: any) => {
                        const vendor = getSingleRelation(vendorOrder?.vendors);
                        const vendorUser = getSingleRelation(vendor?.users);
                        const firstName = vendorUser?.first_name ?? "Unknown";
                        const lastName = vendorUser?.last_name ?? "Vendor";
                        const vendorName = `${firstName} ${lastName}`.trim();

                        return {
                            id: String(vendorOrder.id),
                            vendorName: vendorName || "Unknown Vendor",
                            vendorImage: null,
                            vendorInitials: getInitials(firstName, lastName),
                            items: (Array.isArray(vendorOrder?.order_items)
                                ? vendorOrder.order_items
                                : []).map((item: any) => {
                                    const product = getSingleRelation(
                                        item?.products,
                                    );
                                    const imagePath = product?.image_path ?? "";
                                    const imageUrl = imagePath
                                        ? supabase.storage.from("products")
                                            .getPublicUrl(
                                                imagePath,
                                            ).data.publicUrl
                                        : "";

                                    return {
                                        id: String(item.id),
                                        name: item.product_name ??
                                            "Unknown Product",
                                        priceLabel: formatCurrency(
                                            Number(item.unit_price ?? 0),
                                        ),
                                        unit: `Per ${item.unit ?? ""}`.trim(),
                                        quantity: Number(item.quantity ?? 0),
                                        image: imageUrl,
                                    };
                                }),
                        };
                    });

                const totalItems = vendorOrders.reduce(
                    (sum: number, vendorOrder: VendorOrder) =>
                        sum +
                        vendorOrder.items.reduce(
                            (itemSum: number, item: OrderItem) =>
                                itemSum + item.quantity,
                            0,
                        ),
                    0,
                );

                return {
                    id: String(order.id),
                    orderNumber: order.order_number ?? `ORD-${order.id}`,
                    status: getSlowestStatus(
                        (Array.isArray(order.vendor_orders)
                            ? order.vendor_orders
                            : []).map((vendorOrder: any) =>
                                vendorOrder?.status
                            ),
                    ),
                    totalAmount: formatCurrency(
                        Number(order.total_amount ?? 0),
                    ),
                    totalItems,
                    createdAt: formatCreatedAt(order.created_at),
                    paymentMethod: formatPaymentMethod(order.payment_method),
                    vendorOrders,
                };
            });

            setOrders(mappedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [session?.user.id]);

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [fetchOrders]),
    );

    const filteredOrders = useMemo(() => {
        if (activeTab === "All") return orders;
        if (activeTab === "On the Way") {
            return orders.filter((order) => order.status === "ready");
        }

        return orders.filter((order) =>
            order.status.toLowerCase() === activeTab.toLowerCase()
        );
    }, [activeTab, orders]);

    return {
        activeTab,
        setActiveTab,
        orderTabs,
        orders: filteredOrders,
        loading,
    };
};
