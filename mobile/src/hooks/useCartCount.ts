import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";

export const useCartCount = () => {
    const { session } = useAuth();

    const [cartCount, setCartCount] = useState(0);
    const [isCartCountLoading, setIsCartCountLoading] = useState(true);

    const fetchCartCount = useCallback(async () => {
        const userId = session?.user.id;

        try {
            setIsCartCountLoading(true);

            if (!userId) {
                setCartCount(0);
                return;
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
                setCartCount(0);
                return;
            }

            const { count, error: countError } = await supabase
                .from("cart_items")
                .select("id", { count: "exact", head: true })
                .eq("cart_id", cartData.id);

            if (countError) throw new Error(countError.message);

            setCartCount(count ?? 0);
        } catch (error) {
            console.error("Error fetching cart count:", error);
            setCartCount(0);
        } finally {
            setIsCartCountLoading(false);
        }
    }, [session?.user.id]);

    useFocusEffect(
        useCallback(() => {
            fetchCartCount();
        }, [fetchCartCount]),
    );

    return {
        cartCount,
        isCartCountLoading,
        fetchCartCount,
    };
};
