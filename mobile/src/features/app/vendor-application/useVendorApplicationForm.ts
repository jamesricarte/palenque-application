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
    description: string;
};

export const useVendorApplicationForm = () => {
    const { session } = useAuth();

    const [form, setForm] = useState<VendorApplicationFormState>({
        market_id: null,
        description: "",
    });

    const [markets, setMarkets] = useState<MarketOption[]>([]);
    const [marketsLoading, setMarketsLoading] = useState(true);
    const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
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
        setIsMarketDropdownOpen((prev) => !prev);
    };

    const closeMarketDropdown = () => {
        setIsMarketDropdownOpen(false);
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

            // Insert the new vendor application
            const { error: insertError } = await supabase
                .from("vendor_applications")
                .insert({
                    user_id: userId,
                    market_id: form.market_id,
                    description: form.description,
                });

            if (insertError) throw new Error(insertError.message);

            Alert.alert(
                "Application Submitted",
                "Your vendor application has been submitted successfully.",
            );

            router.push("/(app)/vendor-application/vendor-application-success");
            setForm({
                market_id: null,
                description: "",
            });
            closeMarketDropdown();
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
        isMarketDropdownOpen,
        loading,
        error,
        handleBack,
        handleChange,
        handleMarketSelect,
        toggleMarketDropdown,
        closeMarketDropdown,
        handleSubmit,
    };
};
