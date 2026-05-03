import { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { supabase } from "@/src/config/supabaseClient";
import { getInitials } from "@/src/utils/getInitials";

type MarketVendor = {
  id: string;
  name: string;
  initials: string;
  avatar: string | null;
  description: string;
};

type MarketProduct = {
  id: string;
  name: string;
  vendorName: string;
  vendorInitials: string;
  vendorAvatar: string | null;
  price: string;
  image: string | null;
  tag: string;
};

type RankedVendorRpcRow = {
  vendor_id: number | string | null;
  vendor_first_name: string | null;
  vendor_last_name: string | null;
  vendor_profile_image_path: string | null;
  vendor_description: string | null;
};

type RankedProductRpcRow = {
  id: number | string;
  name: string | null;
  category: string | null;
  price: number | string | null;
  unit: string | null;
  image_path: string | null;
  vendor_first_name: string | null;
  vendor_last_name: string | null;
  vendor_profile_image_path: string | null;
};

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

export const usePublicMarketDetails = () => {
  const { marketId } = useLocalSearchParams<{ marketId?: string | string[] }>();

  const [bannerTitle, setBannerTitle] = useState("Public Market");
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [marketStatus, setMarketStatus] = useState("");
  const [topVendors, setTopVendors] = useState<MarketVendor[]>([]);
  const [topProducts, setTopProducts] = useState<MarketProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMarketMissing, setIsMarketMissing] = useState(false);

  const normalizedMarketId = getParamValue(marketId);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleOpenSearch = useCallback(() => {
    router.push("/(app)/search");
  }, []);

  const handleOpenProduct = useCallback((productId: string) => {
    router.push(`/(app)/products/${productId}`);
  }, []);

  const mapVendorRows = useCallback((rows: RankedVendorRpcRow[]) => {
    return rows
      .filter((row) => row.vendor_id !== null)
      .map((row) => {
        const firstName = row.vendor_first_name ?? "Unknown";
        const lastName = row.vendor_last_name ?? "Vendor";
        const avatar = row.vendor_profile_image_path
          ? supabase.storage
            .from("users")
            .getPublicUrl(row.vendor_profile_image_path).data.publicUrl
          : null;

        return {
          id: String(row.vendor_id),
          name: `${firstName} ${lastName}`.trim(),
          initials: getInitials(firstName, lastName),
          avatar,
          description: row.vendor_description?.trim() ||
            "Trusted vendor in this market",
        };
      });
  }, []);

  const mapProductRows = useCallback((rows: RankedProductRpcRow[]) => {
    return rows.map((row) => {
      const firstName = row.vendor_first_name ?? "Unknown";
      const lastName = row.vendor_last_name ?? "Vendor";
      const image = row.image_path
        ? supabase.storage.from("products").getPublicUrl(row.image_path).data
          .publicUrl
        : null;
      const vendorAvatar = row.vendor_profile_image_path
        ? supabase.storage
          .from("users")
          .getPublicUrl(row.vendor_profile_image_path).data.publicUrl
        : null;
      const priceValue = Number(row.price ?? 0);

      return {
        id: String(row.id),
        name: row.name ?? "Unnamed Product",
        vendorName: `${firstName} ${lastName}`.trim(),
        vendorInitials: getInitials(firstName, lastName),
        vendorAvatar,
        price: `₱ ${priceValue.toFixed(2)}/${row.unit ?? "unit"}`,
        image,
        tag: row.category ?? "Others",
      };
    });
  }, []);

  const fetchMarketDetails = useCallback(async () => {
    try {
      setLoading(true);
      setIsMarketMissing(false);

      if (!normalizedMarketId) {
        setIsMarketMissing(true);
        setBannerTitle("Public Market");
        setBannerImage(null);
        setMarketStatus("");
        setTopProducts([]);
        setTopVendors([]);

        return;
      }

      const { data: marketData, error: marketError } = await supabase
        .from("markets")
        .select("id, name, status, image_path")
        .eq("id", normalizedMarketId)
        .maybeSingle();

      if (marketError) throw new Error(marketError.message);

      if (!marketData) {
        setIsMarketMissing(true);
        setBannerTitle("Public Market");
        setBannerImage(null);
        setMarketStatus("");
        setTopProducts([]);
        setTopVendors([]);

        return;
      }

      setBannerTitle(`${marketData.name} Public Market`);
      setMarketStatus(marketData.status);
      setBannerImage(
        marketData.image_path
          ? supabase.storage
            .from("markets")
            .getPublicUrl(marketData.image_path).data.publicUrl
          : null,
      );

      const [productsResult, vendorsResult] = await Promise.all([
        supabase.rpc("get_top_products_by_market", {
          target_market_id: Number(normalizedMarketId),
          result_limit: 8,
        }),
        supabase.rpc("get_top_vendors_by_market", {
          target_market_id: Number(normalizedMarketId),
          result_limit: 6,
        }),
      ]);

      if (productsResult.error) {
        console.error(
          "Error fetching ranked market products:",
          productsResult.error,
        );

        const { data: fallbackProducts, error: fallbackProductsError } =
          await supabase
            .from("products")
            .select(
              `id,
              name,
              category,
              price,
              unit,
              image_path,
              vendors!inner (
                market_id,
                users (
                  first_name,
                  last_name,
                  profile_image_path
                )
              )`,
            )
            .eq("vendors.market_id", normalizedMarketId)
            .eq("status", "active")
            .gt("stock", 0)
            .limit(8);

        if (fallbackProductsError) {
          throw new Error(fallbackProductsError.message);
        }

        setTopProducts(
          (fallbackProducts ?? []).map((product: any) => {
            const firstName = product.vendors?.users?.first_name ?? "Unknown";
            const lastName = product.vendors?.users?.last_name ?? "Vendor";
            const image = product.image_path
              ? supabase.storage
                .from("products")
                .getPublicUrl(product.image_path).data.publicUrl
              : null;
            const vendorAvatar = product.vendors?.users?.profile_image_path
              ? supabase.storage
                .from("users")
                .getPublicUrl(product.vendors.users.profile_image_path).data
                .publicUrl
              : null;

            return {
              id: String(product.id),
              name: product.name,
              vendorName: `${firstName} ${lastName}`.trim(),
              vendorInitials: getInitials(firstName, lastName),
              vendorAvatar,
              price: `₱ ${Number(product.price ?? 0).toFixed(2)}/${product.unit ?? "unit"}`,
              image,
              tag: product.category ?? "Others",
            };
          }),
        );
      } else {
        setTopProducts(
          mapProductRows((productsResult.data ?? []) as RankedProductRpcRow[]),
        );
      }

      if (vendorsResult.error) {
        console.error(
          "Error fetching ranked market vendors:",
          vendorsResult.error,
        );

        const { data: fallbackVendors, error: fallbackVendorsError } =
          await supabase
            .from("vendors")
            .select(
              `id,
              description,
              users (
                first_name,
                last_name,
                profile_image_path
              )`,
            )
            .eq("market_id", normalizedMarketId)
            .eq("vendor_status", "approved")
            .limit(6);

        if (fallbackVendorsError) {
          throw new Error(fallbackVendorsError.message);
        }

        setTopVendors(
          (fallbackVendors ?? []).map((vendor: any) => {
            const firstName = vendor.users?.first_name ?? "Unknown";
            const lastName = vendor.users?.last_name ?? "Vendor";
            const avatar = vendor.users?.profile_image_path
              ? supabase.storage
                .from("users")
                .getPublicUrl(vendor.users.profile_image_path).data.publicUrl
              : null;

            return {
              id: String(vendor.id),
              name: `${firstName} ${lastName}`.trim(),
              initials: getInitials(firstName, lastName),
              avatar,
              description: vendor.description?.trim() ||
                "Trusted vendor in this market",
            };
          }),
        );
      } else {
        setTopVendors(
          mapVendorRows((vendorsResult.data ?? []) as RankedVendorRpcRow[]),
        );
      }
    } catch (error) {
      console.error("Error fetching market details:", error);
      setTopProducts([]);
      setTopVendors([]);
      setIsMarketMissing(true);
    } finally {
      setLoading(false);
    }
  }, [mapProductRows, mapVendorRows, normalizedMarketId]);

  useEffect(() => {
    fetchMarketDetails();
  }, [fetchMarketDetails]);

  return {
    bannerImage,
    bannerTitle,
    handleBack,
    handleOpenProduct,
    handleOpenSearch,
    isMarketMissing,
    loading,
    marketStatus,
    topProducts,
    topVendors,
  };
};
