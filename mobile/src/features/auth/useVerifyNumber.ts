import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    NativeSyntheticEvent,
    TextInput,
    TextInputKeyPressEventData,
} from "react-native";
import axios from "axios";

import { useLocalSearchParams } from "expo-router";

export function useVerifyNumber() {
    const { phone } = useLocalSearchParams<{ phone?: string }>();
    const router = useRouter();

    if (!phone) router.back();

    const countryCallingCode = "+63";

    const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendTimeout, setResendTimeout] = useState<number>(60);

    const inputRefs = useRef<Array<TextInput | null>>([]);

    const otp = useMemo(() => digits.join(""), [digits]);
    const isComplete = otp.length === 6 && !digits.includes("");

    const focusIndex = (i: number) => {
        const el = inputRefs.current[i];
        if (el) el.focus();
    };

    const handleChange = (index: number, value: string) => {
        if (error) setError("");

        // Keep only the last typed character, numeric only
        const last = value.replace(/\D/g, "").slice(-1);

        setDigits((prev) => {
            const next = [...prev];
            next[index] = last;
            return next;
        });

        if (last && index < 5) focusIndex(index + 1);
    };

    const handleKeyPress = (
        index: number,
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    ) => {
        if (e.nativeEvent.key === "Backspace") {
            // If current is empty, jump back and clear previous
            if (!digits[index] && index > 0) {
                setDigits((prev) => {
                    const next = [...prev];
                    next[index - 1] = "";
                    return next;
                });
                focusIndex(index - 1);
            }
        }
    };

    const handleVerify = async () => {
        if (!isComplete) {
            setError("Please enter the 6-digit code.");
            return;
        }

        if (!phone) {
            setError("There is no phone number detected.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "https://bprcrthwboowrexrvplu.supabase.co/functions/v1/verify-otp",
                {
                    phone,
                    otp,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
                    },
                },
            );

            if (response.data.success && response.data.phone) {
                if (!response.data.isUserExists) {
                    router.push({
                        pathname: "/(auth)/create-password",
                        params: { phone: response.data.phone },
                    });
                } else {
                    console.error("User already existed.");
                    router.replace("/(auth)/login");
                }
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

    const handleResend = async () => {
        try {
            setError("");
            setLoading(true);

            const response = await axios.post(
                "https://bprcrthwboowrexrvplu.supabase.co/functions/v1/generate-otp",
                {
                    phone,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
                    },
                },
            );

            if (response.data.success) {
                setResendTimeout(60);
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

    useEffect(() => {
        let interval: any;

        if (resendTimeout > 0) {
            interval = setTimeout(() => {
                setResendTimeout((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }

                    return prev - 1;
                });
            }, 1000);
        }
    }, [resendTimeout]);

    return {
        router,
        countryCallingCode,
        phone,
        digits,
        inputRefs,
        handleChange,
        handleKeyPress,
        error,
        loading,
        handleVerify,
        handleResend,
        resendTimeout,
    };
}
