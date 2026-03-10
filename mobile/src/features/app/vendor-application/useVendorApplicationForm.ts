import { use, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";

type VendorApplicationFormState = {
    location: string;
    description: string;
};

export const useVendorApplicationForm = () => {
    const { session } = useAuth();

    const [form, setForm] = useState<VendorApplicationFormState>({
        location: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleBack = () => {
        router.back();
    };

    const handleChange = (
        field: keyof VendorApplicationFormState,
        value: string,
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async () => {
        if (
            !form.location.trim()
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const userId = session?.user?.id || null;

            if (!userId) throw new Error("User session id is required.");

            // Check if user have existing vendor application
            const { data, error } = await supabase.from(
                "vendor_applications",
            ).select().eq("user_id", userId).in("status", [
                "submitted",
                "approved",
            ]).maybeSingle();

            if (error) throw new Error(error.message);

            if (data) {
                throw new Error("User have already a vendor application.");
            }

            // Insert the new vendor application
            const { error: insertError } = await supabase.from(
                "vendor_applications",
            )
                .insert({
                    user_id: userId,
                    location: form.location,
                    description: form.description,
                });

            if (insertError) throw new Error(insertError.message);

            Alert.alert(
                "Application Submitted",
                "Your vendor application has been submitted successfully.",
            );

            router.push(
                "/(app)/vendor-application/vendor-application-success",
            ),
                setForm({
                    location: "",
                    description: "",
                });
        } catch (error: any) {
            setError(error?.message || error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        loading,
        error,
        handleBack,
        handleChange,
        handleSubmit,
    };
};
