import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";
import { getInitials } from "@/src/utils/getInitials";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";

type VendorOrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

type OrderDetailsItem = {
  id: string;
  name: string;
  unitLabel: string;
  priceLabel: string;
  quantity: number;
  image: string;
};

type OrderDetailsVendorGroup = {
  id: string;
  vendorName: string;
  vendorInitials: string;
  items: OrderDetailsItem[];
};

type DeliveryAddress = {
  fullName: string;
  streetAddress: string;
  locality: string;
  phone: string;
};

export type OrderDetailsData = {
  id: string;
  orderNumber: string;
  createdAtLabel: string;
  status: VendorOrderStatus;
  statusMessage: string;
  deliveryAddress: DeliveryAddress;
  vendorGroups: OrderDetailsVendorGroup[];
  subtotalLabel: string;
  deliveryFeeLabel: string;
  totalAmountLabel: string;
  paymentMethodLabel: string;
};

const statusPriority: Record<VendorOrderStatus, number> = {
  pending: 1,
  confirmed: 2,
  preparing: 3,
  ready: 4,
  completed: 5,
  cancelled: 6,
};

const getSingleRelation = <T>(value: T | T[] | null | undefined): T | null => {
  if (!value) return null;

  return Array.isArray(value) ? value[0] ?? null : value;
};

const formatCurrency = (value: number) => `₱ ${value.toFixed(2)}`;

const formatDateTime = (value: string | null | undefined) => {
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

const formatPaymentMethod = (value: string | null | undefined) => {
  if (value === "cash_on_delivery") return "Cash on Delivery";
  if (value === "e_payment") return "E-Payment";

  return "Unknown";
};

const getSlowestStatus = (
  statuses: Array<string | null | undefined>,
): VendorOrderStatus => {
  const sanitizedStatuses = statuses.filter(
    (status): status is VendorOrderStatus =>
      status === "pending" ||
      status === "confirmed" ||
      status === "preparing" ||
      status === "ready" ||
      status === "completed" ||
      status === "cancelled",
  );

  if (sanitizedStatuses.length === 0) return "pending";

  if (sanitizedStatuses.every((status) => status === "cancelled")) {
    return "cancelled";
  }

  const activeStatuses = sanitizedStatuses.filter(
    (status) => status !== "cancelled",
  );

  return activeStatuses.reduce<VendorOrderStatus>(
    (slowest, current) =>
      statusPriority[current] < statusPriority[slowest] ? current : slowest,
    activeStatuses[0] ?? "pending",
  );
};

const getStatusMessage = (status: VendorOrderStatus) => {
  if (status === "pending") return "Vendor is waiting to confirm your order.";
  if (status === "confirmed") return "Vendor has confirmed your order.";
  if (status === "preparing") {
    return "Vendor is currently preparing your order.";
  }
  if (status === "ready") return "Your order is on the way.";
  if (status === "completed") return "Your order has been completed.";

  return "This order has been cancelled.";
};

const getOrderIdParam = (value?: string | string[]) => {
  if (Array.isArray(value)) return value[0] ?? "";

  return value ?? "";
};

export const useOrderDetails = () => {
  const { orderId } = useLocalSearchParams<{ orderId?: string | string[] }>();
  const { session, user } = useAuth();

  const [orderDetails, setOrderDetails] = useState<OrderDetailsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const normalizedOrderId = getOrderIdParam(orderId);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(app)/(consumer-tabs)/orders");
  }, []);

  const fetchOrderDetails = useCallback(async () => {
    const userId = session?.user.id;

    try {
      setLoading(true);
      setErrorMessage("");

      if (!userId || !normalizedOrderId) {
        setOrderDetails(null);
        setErrorMessage("Order not found.");
        return;
      }

      const { data: order, error } = await supabase
        .from("orders")
        .select(
          `
            id,
            order_number,
            total_amount,
            payment_method,
            created_at,
            shipping_address_id,
            vendor_orders (
              id,
              status,
              subtotal,
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
          `,
        )
        .eq("id", normalizedOrderId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw new Error(error.message);

      if (!order) {
        setOrderDetails(null);
        setErrorMessage("Order not found.");
        return;
      }

      let addressData: any = null;

      if (order.shipping_address_id) {
        const { data: address, error: addressError } = await supabase
          .from("addresses")
          .select("street_address, barangay, city, province, postal_code")
          .eq("id", order.shipping_address_id)
          .maybeSingle();

        if (addressError) throw new Error(addressError.message);

        addressData = address;
      }

      const vendorOrders = Array.isArray(order.vendor_orders)
        ? order.vendor_orders
        : [];

      const vendorGroups: OrderDetailsVendorGroup[] = vendorOrders.map(
        (vendorOrder: any) => {
          const vendor = getSingleRelation(vendorOrder?.vendors);
          const vendorUser = getSingleRelation(vendor?.users);
          const firstName = vendorUser?.first_name ?? "Unknown";
          const lastName = vendorUser?.last_name ?? "Vendor";
          const vendorName = `${firstName} ${lastName}`.trim() || "Vendor";

          return {
            id: String(vendorOrder.id),
            vendorName,
            vendorInitials: getInitials(firstName, lastName),
            items: (Array.isArray(vendorOrder?.order_items)
              ? vendorOrder.order_items
              : []).map((item: any) => {
                const product = getSingleRelation(item?.products);
                const imagePath = product?.image_path ?? "";
                const imageUrl = imagePath
                  ? supabase.storage.from("products").getPublicUrl(imagePath)
                    .data
                    .publicUrl
                  : "";

                return {
                  id: String(item.id),
                  name: item.product_name ?? "Unknown Product",
                  unitLabel: `Per ${item.unit ?? ""}`.trim(),
                  priceLabel: formatCurrency(Number(item.unit_price ?? 0)),
                  quantity: Number(item.quantity ?? 0),
                  image: imageUrl,
                };
              }),
          };
        },
      );

      const subtotalValue = vendorOrders.reduce(
        (sum: number, vendorOrder: any) =>
          sum + Number(vendorOrder?.subtotal ?? 0),
        0,
      );
      const totalValue = Number(order.total_amount ?? 0);
      const deliveryFeeValue = Math.max(totalValue - subtotalValue, 0);
      const status = getSlowestStatus(
        vendorOrders.map((item: any) =>
          item?.status
        ),
      );
      const fullName =
        `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
        "Recipient";
      const localityParts = [
        addressData?.barangay,
        addressData?.city,
        addressData?.province,
        addressData?.postal_code,
      ].filter(Boolean);

      setOrderDetails({
        id: String(order.id),
        orderNumber: order.order_number ?? `ORD-${order.id}`,
        createdAtLabel: formatDateTime(order.created_at),
        status,
        statusMessage: getStatusMessage(status),
        deliveryAddress: {
          fullName,
          streetAddress: addressData?.street_address ?? "No address found",
          locality: localityParts.join(", "),
          phone: user?.phone ?? "No phone number",
        },
        vendorGroups,
        subtotalLabel: formatCurrency(subtotalValue),
        deliveryFeeLabel: formatCurrency(deliveryFeeValue),
        totalAmountLabel: formatCurrency(totalValue),
        paymentMethodLabel: formatPaymentMethod(order.payment_method),
      });
    } catch (fetchError: any) {
      console.error("Error fetching order details:", fetchError);
      setOrderDetails(null);
      setErrorMessage(fetchError?.message || "Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  }, [
    normalizedOrderId,
    session?.user.id,
    user?.first_name,
    user?.last_name,
    user?.phone,
  ]);

  useFocusEffect(
    useCallback(() => {
      fetchOrderDetails();
    }, [fetchOrderDetails]),
  );

  return {
    orderId: normalizedOrderId,
    orderDetails,
    loading,
    errorMessage,
    handleBack,
    refetchOrderDetails: fetchOrderDetails,
  };
};
