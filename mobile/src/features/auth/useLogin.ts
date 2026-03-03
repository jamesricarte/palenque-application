import { useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/src/config/supabaseClient";

export function useLogin() {
    const router = useRouter();

    const countryCallingCode: string = "+63";

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    class ValidationError extends Error {
        name: string = "ValidationError";
        constructor(message: string) {
            super(message);
        }
    }

    function validateAndBuildPhone({
        phone,
        countryCallingCode,
    }: {
        phone: string;
        countryCallingCode: string;
    }) {
        let p = phone?.trim();

        if (!p) {
            throw new ValidationError("The phone number should not be empty.");
        }
        if (!/^[\d]+$/.test(p)) {
            throw new ValidationError(
                "The phone number must contain digits only.",
            );
        }
        if (!/^\+\d{1,3}$/.test(countryCallingCode)) {
            throw new ValidationError("Invalid country calling code.");
        }

        // If user typed "09xxxxxxxxx", remove leading zeros
        if (p.startsWith("0")) {
            p = p.replace(/^0+/, "");
            setPhone(p);
        }

        // PH numbers without country code are usually 10 digits (9xxxxxxxxx)
        if (p.length !== 10) {
            throw new ValidationError("Invalid phone number.");
        }

        return `${countryCallingCode}${p}`;
    }

    const signInWithPassword = async () => {
        try {
            if (error) setError("");
            setLoading(true);

            const fullPhone = validateAndBuildPhone({
                phone,
                countryCallingCode,
            });

            if (!password?.trim()) {
                throw new ValidationError("The password should not be empty.");
            }

            const email = `${fullPhone}@palenque.dev`;

            const { data, error: signInErr } = await supabase.auth
                .signInWithPassword({
                    email,
                    password,
                });

            if (signInErr) throw new Error(signInErr.message);

            if (data?.session) {
                if (router.canDismiss?.()) {
                    router.dismissAll();
                }
                router.replace("/(app)/(consumer-tabs)/home");
            }
        } catch (error: any) {
            const message = error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                "Unknown error";

            setError(message);
            console.error(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        router,
        countryCallingCode,
        phone,
        setPhone,
        password,
        setPassword,
        error,
        loading,
        signInWithPassword,
    };
}
