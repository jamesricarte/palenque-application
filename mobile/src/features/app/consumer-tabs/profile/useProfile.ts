import { useMemo } from "react";
import { supabase } from "@/src/config/supabaseClient";
import { useRouter } from "expo-router";

import { useAuth } from "@/src/hooks/useAuth";

export const useProfile = () => {
    const { session } = useAuth();
    const router = useRouter();

    const userName = useMemo(() => {
        // Replace with real user state later (context/store/api)
        return "Mark Joseph";
    }, []);

    const onPressCart = () => {
        // Navigate to cart later
    };

    const onPressViewProfile = () => {
        // Navigate to profile details later
    };

    const onPressMyAddress = () => {
        // Navigate to address screen later
    };

    const onPressBecomeVendor = async () => {
        router.push("/(app)/vendor-application/vendor-application");
    };

    const onPressLogout = async () => {
        await supabase.auth.signOut();
    };

    return {
        userName,
        onPressCart,
        onPressViewProfile,
        onPressMyAddress,
        onPressBecomeVendor,
        onPressLogout,
    };
};
