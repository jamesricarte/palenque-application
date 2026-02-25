import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";

import { handleFormChange } from "@/src/utils/formHandler";
import { supabase } from "@/src/config/supabaseClient";

export const useCreatePassword = () => {
    const { phone } = useLocalSearchParams<{ phone?: string }>();

    const minLength = 8;

    const symbolRegex = /[^A-Za-z0-9]/;

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const setPassword = (value: string) =>
        handleFormChange(setFormData, "password", value);
    const setConfirmPassword = (value: string) =>
        handleFormChange(setFormData, "confirmPassword", value);

    const requirements = useMemo(() => {
        const pw = formData.password;

        return {
            minLength: pw.length >= minLength,
            hasLowercase: /[a-z]/.test(pw),
            hasUppercase: /[A-Z]/.test(pw),
            hasDigit: /\d/.test(pw),
            hasSymbol: symbolRegex.test(pw),
            passwordsMatch: !!pw && pw === formData.confirmPassword,
        };
    }, [formData.password, formData.confirmPassword, minLength]);

    const isComplete = useMemo(() => {
        return (
            requirements.minLength &&
            requirements.hasLowercase &&
            requirements.hasUppercase &&
            requirements.hasDigit &&
            requirements.hasSymbol &&
            requirements.passwordsMatch
        );
    }, [requirements]);

    const validate = () => {
        if (!formData.password || !formData.confirmPassword) {
            return "Password fields should not be empty.";
        }
        if (!requirements.minLength) {
            return `Password must be at least ${minLength} characters.`;
        }
        if (!requirements.hasLowercase) {
            return "Password must include at least 1 lowercase letter.";
        }
        if (!requirements.hasUppercase) {
            return "Password must include at least 1 uppercase letter.";
        }
        if (!requirements.hasDigit) {
            return "Password must include at least 1 digit.";
        }
        if (!requirements.hasSymbol) {
            return "Password must include at least 1 symbol.";
        }
        if (!requirements.passwordsMatch) {
            return "Passwords do not match.";
        }
        return "";
    };

    const toggleShowPassword = () => setShowPassword((p) => !p);
    const toggleShowConfirmPassword = () => setShowConfirmPassword((p) => !p);

    const handleConfirm = async () => {
        if (error) setError("");

        const msg = validate();
        if (msg) {
            setError(msg);
            return;
        }

        try {
            setLoading(true);

            const { data, error } = await supabase.auth.signUp({
                email: `${phone}@palenque.dev`,
                password: formData.password,
            });

            if (error) {
                console.error(error);
                throw new Error(error.message);
            }

            if (data && data.user?.id) {
                const id: string = data.user?.id;

                const { error: insertError } = await supabase.from("users")
                    .insert({ user_id: id, status: "active" });

                if (insertError) {
                    console.error("Error inserting new user:", insertError);
                    throw new Error(insertError.message);
                }

                router.push({
                    pathname: "/(auth)/complete-profile",
                    params: { id },
                });
            }
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
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        setPassword,
        setConfirmPassword,

        // visibility toggles
        showPassword,
        showConfirmPassword,
        toggleShowPassword,
        toggleShowConfirmPassword,

        // ui state
        loading,
        error,
        setError,

        // computed
        isComplete,
        requirements,

        // actions
        handleConfirm,
    };
};
