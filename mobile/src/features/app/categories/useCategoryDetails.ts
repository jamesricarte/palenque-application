import { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { supabase } from "@/src/config/supabaseClient";
import { getInitials } from "@/src/utils/getInitials";

type CategoryVendor = {
  id: string;
  name: string;
  initials: string;
  avatar: string | null;
  description: string;
  marketName: string;
};

type CategoryProduct = {
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
  market_name: string | null;
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

export const useCategoryDetails = () => {
  const { categoryName } = useLocalSearchParams<{
    categoryName?: string | string[];
  }>();

  const [bannerTitle, setBannerTitle] = useState("Category");
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [topVendors, setTopVendors] = useState<CategoryVendor[]>([]);
  const [topProducts, setTopProducts] = useState<CategoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryMissing, setIsCategoryMissing] = useState(false);

  const normalizedCategoryName = getParamValue(categoryName);

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
            `Trusted ${normalizedCategoryName || "market"} vendor`,
          marketName: row.market_name
            ? `${row.market_name} Public Market`
            : "Public Market",
        };
      });
  }, [normalizedCategoryName]);

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
        tag: row.category ?? normalizedCategoryName ?? "Others",
      };
    });
  }, [normalizedCategoryName]);

  const fetchCategoryDetails = useCallback(async () => {
    try {
      setLoading(true);
      setIsCategoryMissing(false);

      if (!normalizedCategoryName) {
        setIsCategoryMissing(true);
        setBannerTitle("Category");
        setBannerImage(null);
        setTopProducts([]);
        setTopVendors([]);

        return;
      }

      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("name, image_path")
        .eq("name", normalizedCategoryName)
        .maybeSingle();

      if (categoryError) throw new Error(categoryError.message);

      if (!categoryData) {
        setIsCategoryMissing(true);
        setBannerTitle(normalizedCategoryName);
        setBannerImage(null);
        setTopProducts([]);
        setTopVendors([]);

        return;
      }

      setBannerTitle(categoryData.name);

      setBannerImage(
        categoryData.image_path
          ? supabase.storage
            .from("categories")
            .getPublicUrl(categoryData.image_path).data.publicUrl
          : null,
      );

      const [productsResult, vendorsResult] = await Promise.all([
        supabase.rpc("get_top_products_by_category", {
          category_name: categoryData.name,
          result_limit: 8,
        }),
        supabase.rpc("get_top_vendors_by_category", {
          category_name: categoryData.name,
          result_limit: 6,
        }),
      ]);

      if (productsResult.error) {
        console.error(
          "Error fetching ranked category products:",
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
              vendors (
                users (
                  first_name,
                  last_name,
                  profile_image_path
                )
              )`,
            )
            .eq("category", categoryData.name)
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
              price: `₱ ${Number(product.price ?? 0).toFixed(2)}/${
                product.unit ?? "unit"
              }`,
              image,
              tag: product.category ?? categoryData.name,
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
          "Error fetching ranked category vendors:",
          vendorsResult.error,
        );

        const { data: categoryProducts, error: categoryProductsError } =
          await supabase
            .from("products")
            .select("vendor_id")
            .eq("category", categoryData.name)
            .eq("status", "active")
            .gt("stock", 0);

        if (categoryProductsError) {
          throw new Error(categoryProductsError.message);
        }

        const vendorIds = Array.from(
          new Set(
            (categoryProducts ?? [])
              .map((product: any) => product.vendor_id)
              .filter((vendorId: number | null) => vendorId !== null),
          ),
        );

        if (vendorIds.length === 0) {
          setTopVendors([]);
        } else {
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
                ),
                markets (
                  name
                )`,
              )
              .in("id", vendorIds)
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
                  `Trusted ${categoryData.name} vendor`,
                marketName: vendor.markets?.name
                  ? `${vendor.markets.name} Public Market`
                  : "Public Market",
              };
            }),
          );
        }
      } else {
        setTopVendors(
          mapVendorRows((vendorsResult.data ?? []) as RankedVendorRpcRow[]),
        );
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
      setTopProducts([]);
      setTopVendors([]);
      setIsCategoryMissing(true);
    } finally {
      setLoading(false);
    }
  }, [mapProductRows, mapVendorRows, normalizedCategoryName]);

  useEffect(() => {
    fetchCategoryDetails();
  }, [fetchCategoryDetails]);

  return {
    bannerImage,
    bannerTitle,
    handleBack,
    handleOpenProduct,
    handleOpenSearch,
    isCategoryMissing,
    loading,
    topProducts,
    topVendors,
  };
};
