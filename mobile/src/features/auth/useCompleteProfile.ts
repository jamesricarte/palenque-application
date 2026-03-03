import { useMemo, useState } from "react";
import { supabase } from "@/src/config/supabaseClient";
import { router, useLocalSearchParams } from "expo-router";
import { handleFormChange } from "@/src/utils/formHandler";

export const useCompleteProfile = () => {
    const { id } = useLocalSearchParams<{ id?: string }>();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        deliveryAddress: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const setFirstName = (value: string) =>
        handleFormChange(setFormData, "firstName", value);
    const setLastName = (value: string) =>
        handleFormChange(setFormData, "lastName", value);
    const setEmail = (value: string) =>
        handleFormChange(setFormData, "email", value);
    const setDeliveryAddress = (value: string) =>
        handleFormChange(setFormData, "deliveryAddress", value);

    const isComplete = useMemo(() => {
        return (
            formData.firstName.trim().length > 0 &&
            formData.lastName.trim().length > 0 &&
            formData.deliveryAddress.trim().length > 0
        );
    }, [formData.firstName, formData.lastName, formData.deliveryAddress]);

    const isValidEmail = (val: string) => {
        // Simple practical email check (good enough for forms)
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    };

    const validate = () => {
        if (!formData.firstName.trim()) return "First name is required.";
        if (!formData.lastName.trim()) return "Last name is required.";
        if (!formData.deliveryAddress.trim()) {
            return "Delivery address is required.";
        }
        if (formData.email.trim() && !isValidEmail(formData.email)) {
            return "Please enter a valid email address.";
        }
        return "";
    };

    const handleSave = async () => {
        if (error) setError("");

        const msg = validate();
        if (msg) {
            setError(msg);
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabase.from("users").update({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email || null,
                delivery_address: formData.deliveryAddress,
            }).eq("user_id", id);

            if (error) {
                throw new Error(error.message);
            }

            if (router.canDismiss?.()) {
                router.dismissAll();
            }
            router.replace("/(app)/(consumer-tabs)/home");
        } catch (error: any) {
            const message = error?.response?.data?.error ||
                error?.response?.data || error?.message || error ||
                "Unknown error";

            setError(message);
            console.error(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        // fields
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        deliveryAddress: formData.deliveryAddress,
        setFirstName,
        setLastName,
        setEmail,
        setDeliveryAddress,

        // ui state
        loading,
        error,
        setError,

        // computed
        isComplete,

        // actions
        handleSave,
    };
};
