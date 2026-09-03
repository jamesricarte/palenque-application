import { useState } from "react";
import axios from "axios";
import { router } from "expo-router";
import { supabase } from "@/src/config/supabaseClient";

export function useRegister() {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const countryCallingCode: string = "+63";

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
        if (!/^\d+$/.test(p)) {
            throw new ValidationError(
                "The phone number must contain digits only.",
            );
        }
        if (!/^\+\d{1,3}$/.test(countryCallingCode)) {
            throw new ValidationError("Invalid country calling code.");
        }
        if (p.startsWith("0")) {
            p = p.replace(/^0/, "");
        }
        if (p.length !== 10) throw new ValidationError("Invalid phone number.");

        return `${countryCallingCode}${p}`;
    }

    const signUpWithPhone = async () => {
        try {
            if (error) setError("");
            setLoading(true);

            const fullPhone = validateAndBuildPhone({
                phone,
                countryCallingCode,
            });

            const { data, error: phoneCheckErr } = await supabase.from("users")
                .select().eq("phone", fullPhone).maybeSingle();

            if (phoneCheckErr) throw new Error(phoneCheckErr.message);

            if (data) {
                throw new Error("User already existed.");
            }

            const response = await axios.post(
                "https://bprcrthwboowrexrvplu.supabase.co/functions/v1/generate-otp",
                {
                    phone: fullPhone,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
                    },
                },
            );

            if (response.data.success && response.data.phone) {
                router.push({
                    pathname: "/(auth)/verify-number",
                    params: { phone: response.data.phone },
                });
            }
        } catch (error: any) {
            const message = error?.response?.data?.error ||
                error?.response?.data || error?.message ||
                "Unknown error";

            setError(message);
            console.error(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        countryCallingCode,
        phone,
        setPhone,
        loading,
        signUpWithPhone,
        error,
    };
}
