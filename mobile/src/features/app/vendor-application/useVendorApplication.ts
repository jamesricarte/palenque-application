import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import VendorApplicationImage from "@/src/assets/VendorApplication.jpg";

import { useAuth } from "@/src/hooks/useAuth";
import { supabase } from "@/src/config/supabaseClient";

type ExistingApplication = {
  id: number;
  market_id: number | null;
  description: string | null;
  status: string;
  market_name: string | null;
};

export const useVendorApplication = () => {
  const { session } = useAuth();

  const [existingApplication, setExistingApplication] =
    useState<ExistingApplication | null>(null);
  const [loading, setLoading] = useState(true);

  const checkExistingApplication = async () => {
    try {
      const userId = session?.user?.id || null;

      if (!userId) throw new Error("User session id is required.");

      const { data, error } = await supabase
        .from("vendor_applications")
        .select("id, market_id, description, status")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw new Error(error.message);

      if (!data) {
        setExistingApplication(null);
        return;
      }

      let marketName: string | null = null;

      if (data.market_id) {
        const { data: market, error: marketError } = await supabase
          .from("markets")
          .select("name")
          .eq("id", data.market_id)
          .maybeSingle();

        if (marketError) throw new Error(marketError.message);

        marketName = market?.name ?? null;
      }

      setExistingApplication({
        ...data,
        market_name: marketName,
      });
    } catch (error) {
      console.error(error);
      setExistingApplication(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkExistingApplication();
  }, [session?.user?.id]);

  const heroImageSource = useMemo(() => {
    return VendorApplicationImage;
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(app)/(consumer-tabs)/profile");
  };

  const handleStartApplication = () => {
    router.push("/(app)/vendor-application/vendor-application-form");
  };

  return {
    heroImageSource,
    handleBack,
    handleStartApplication,
    existingApplication,
    loading,
  };
};
