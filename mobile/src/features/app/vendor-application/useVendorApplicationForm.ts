import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";

type MarketOption = {
    id: number;
    name: string;
    status: "open" | "closed";
};

type VendorApplicationFormState = {
    market_id: number | null;
    birth_date: Date | null;
};

export const useVendorApplicationForm = () => {
    const { session, user } = useAuth();

    const [form, setForm] = useState<VendorApplicationFormState>({
        market_id: null,
        birth_date: null,
    });

    const [markets, setMarkets] = useState<MarketOption[]>([]);
    const [marketsLoading, setMarketsLoading] = useState(true);
    const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
    const [isBirthDatePickerOpen, setIsBirthDatePickerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                setMarketsLoading(true);

                const { data, error } = await supabase
                    .from("markets")
                    .select("id, name, status")
                    .order("name", { ascending: true });

                if (error) throw new Error(error.message);

                const normalizedMarkets = (data ?? []).map((market) => ({
                    id: market.id,
                    name: market.name,
                    status: market.status,
                })) as MarketOption[];

                setMarkets(normalizedMarkets);
            } catch (fetchError: any) {
                setError(fetchError?.message || "Failed to load markets.");
            } finally {
                setMarketsLoading(false);
            }
        };

        fetchMarkets();
    }, []);

    const selectedMarket = useMemo(() => {
        return markets.find((market) => market.id === form.market_id) ?? null;
    }, [form.market_id, markets]);

    const userFullName = useMemo(() => {
        return [user?.first_name, user?.last_name].filter(Boolean).join(" ");
    }, [user?.first_name, user?.last_name]);

    const userPhone = user?.phone ?? "";

    const formattedBirthDate = useMemo(() => {
        if (!form.birth_date) {
            return "";
        }

        return form.birth_date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });
    }, [form.birth_date]);

    const handleBack = () => {
        router.back();
    };

    const handleChange = <K extends keyof VendorApplicationFormState>(
        field: K,
        value: VendorApplicationFormState[K],
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (error) {
            setError("");
        }
    };

    const toggleMarketDropdown = () => {
        setIsBirthDatePickerOpen(false);
        setIsMarketDropdownOpen((prev) => !prev);
    };

    const closeMarketDropdown = () => {
        setIsMarketDropdownOpen(false);
    };

    const openBirthDatePicker = () => {
        closeMarketDropdown();
        setIsBirthDatePickerOpen(true);
    };

    const closeBirthDatePicker = () => {
        setIsBirthDatePickerOpen(false);
    };

    const handleBirthDateChange = (value: Date) => {
        handleChange("birth_date", value);
    };

    const handleMarketSelect = (marketId: number) => {
        handleChange("market_id", marketId);
        closeMarketDropdown();
    };

    const handleSubmit = async () => {
        if (!form.market_id) {
            setError("Please select a market.");
            return;
        }

        if (!form.birth_date) {
            setError("Please select your birthdate.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const userId = session?.user?.id || null;

            if (!userId) throw new Error("User session id is required.");

            // Check if user have existing vendor application
            const { data, error } = await supabase
                .from("vendor_applications")
                .select()
                .eq("user_id", userId)
                .in("status", ["submitted", "approved"])
                .maybeSingle();

            if (error) throw new Error(error.message);

            if (data) {
                throw new Error("User have already a vendor application.");
            }

            const birthDateValue = [
                form.birth_date.getFullYear(),
                String(form.birth_date.getMonth() + 1).padStart(2, "0"),
                String(form.birth_date.getDate()).padStart(2, "0"),
            ].join("-");

            const { error: updateUserError } = await supabase
                .from("users")
                .update({
                    birth_date: birthDateValue,
                } as any)
                .eq("user_id", userId);

            if (updateUserError) throw new Error(updateUserError.message);

            // Insert the new vendor application
            const { error: insertError } = await supabase
                .from("vendor_applications")
                .insert({
                    user_id: userId,
                    market_id: form.market_id,
                    description: null,
                });

            if (insertError) throw new Error(insertError.message);

            Alert.alert(
                "Application Submitted",
                "Your vendor application has been submitted successfully.",
            );

            router.push("/(app)/vendor-application/vendor-application-success");
            setForm({
                market_id: null,
                birth_date: null,
            });
            closeMarketDropdown();
            closeBirthDatePicker();
        } catch (error: any) {
            setError(error?.message || error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        markets,
        marketsLoading,
        selectedMarket,
        userFullName,
        userPhone,
        formattedBirthDate,
        isMarketDropdownOpen,
        isBirthDatePickerOpen,
        loading,
        error,
        handleBack,
        handleChange,
        handleBirthDateChange,
        handleMarketSelect,
        toggleMarketDropdown,
        closeMarketDropdown,
        openBirthDatePicker,
        closeBirthDatePicker,
        handleSubmit,
    };
};
