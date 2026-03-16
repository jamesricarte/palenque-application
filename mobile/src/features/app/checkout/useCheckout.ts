import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

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

export const useCheckout = () => {
    const { selectedItems } = useLocalSearchParams<{ selectedItems: string }>();

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

    const handlePlaceOrder = () => {
        prettyLog("PLACE ORDER:", parsedItems);
    };

    return {
        vendorGroups,
        subtotal,
        deliveryFee,
        totalAmount,
        handleBack,
        handlePlaceOrder,
    };
};
