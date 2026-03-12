import { useCallback, useMemo, useState } from "react";
import { supabase } from "@/src/config/supabaseClient";
import { useFocusEffect, useRouter } from "expo-router";

import { useAuth } from "@/src/hooks/useAuth";

export const useProfile = () => {
    const { session, user, logout } = useAuth();

    const router = useRouter();

    const [hasApprovedVendorApplication, setHasApprovedVendorApplication] =
        useState(false);

    const userName = useMemo(() => {
        return `${user?.first_name} ${user?.last_name}`;
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            const checkVendorApplication = async () => {
                try {
                    const userId = session?.user.id;

                    if (!userId) {
                        setHasApprovedVendorApplication(false);
                        return;
                    }

                    const { data, error } = await supabase
                        .from("vendor_applications")
                        .select("status")
                        .eq("user_id", userId)
                        .maybeSingle();

                    if (error) throw new Error(error.message);

                    setHasApprovedVendorApplication(
                        data?.status === "approved",
                    );
                } catch (error) {
                    console.error(error);
                    setHasApprovedVendorApplication(false);
                }
            };

            checkVendorApplication();
        }, [session?.user?.id, user]),
    );

    const onPressCart = () => {
        router.push("/(app)/cart");
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

    const onPressVendorDashboard = async () => {
        router.push("/(app)/(vendor-tabs)/home");
    };

    const onPressLogout = async () => {
        logout();
    };

    return {
        userName,
        hasApprovedVendorApplication,
        onPressCart,
        onPressViewProfile,
        onPressMyAddress,
        onPressBecomeVendor,
        onPressVendorDashboard,
        onPressLogout,
    };
};
