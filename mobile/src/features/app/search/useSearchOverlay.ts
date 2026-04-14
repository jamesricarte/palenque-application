import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router, useLocalSearchParams } from "expo-router";

import { supabase } from "@/src/config/supabaseClient";
import { getInitials } from "@/src/utils/getInitials";
import { Keyboard } from "react-native";

type SearchSortOption = "newest" | "price_low" | "price_high";

type SearchProductRpcRow = {
  id: number | string;
  name: string | null;
  categories: string | null;
  price: number | string | null;
  unit: string | null;
  image_path: string | null;
  vendor_first_name: string | null;
  vendor_last_name: string | null;
  vendor_profile_image_path: string | null;
};

type SearchSuggestionRpcRow = {
  suggestion: string | null;
};

type SearchProduct = {
  id: string;
  name: string;
  vendorName: string;
  vendorInitials: string;
  vendorAvatar: string | null;
  category: string;
  price: string;
  image: string | null;
};

const RECENT_SEARCHES_KEY = "consumer_recent_searches";
const MAX_RECENT_SEARCHES = 6;
const SUGGESTION_LIMIT = 8;
const SEARCH_RESULT_LIMIT = 50;
const SUGGESTION_DEBOUNCE_DELAY = 250;

const parseRecentSearches = (value: string | null) => {
  if (!value) return [];

  try {
    const parsedValue = JSON.parse(value);

    if (!Array.isArray(parsedValue)) return [];

    return parsedValue.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    );
  } catch (error) {
    console.error("Error parsing recent searches:", error);

    return [];
  }
};

const getSearchParamValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

export const useSearchOverlay = () => {
  const { q } = useLocalSearchParams<{ q?: string | string[] }>();
  const hasInitializedFromParams = useRef(false);

  const [searchText, setSearchText] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [selectedSort, setSelectedSort] = useState<SearchSortOption>("newest");
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const saveRecentSearches = useCallback(async (value: string[]) => {
    try {
      await SecureStore.setItemAsync(
        RECENT_SEARCHES_KEY,
        JSON.stringify(value),
      );
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  }, []);

  const loadRecentSearches = useCallback(async () => {
    try {
      const storedValue = await SecureStore.getItemAsync(RECENT_SEARCHES_KEY);

      setRecentSearches(parseRecentSearches(storedValue));
    } catch (error) {
      console.error("Error loading recent searches:", error);
      setRecentSearches([]);
    }
  }, []);

  const persistRecentSearch = useCallback(
    async (query: string) => {
      const normalizedQuery = query.trim();

      if (!normalizedQuery) return;

      setRecentSearches((prev) => {
        const nextRecentSearches = [
          normalizedQuery,
          ...prev.filter(
            (item) => item.toLowerCase() !== normalizedQuery.toLowerCase(),
          ),
        ].slice(0, MAX_RECENT_SEARCHES);

        void saveRecentSearches(nextRecentSearches);

        return nextRecentSearches;
      });
    },
    [saveRecentSearches],
  );

  const removeRecentSearch = useCallback(
    async (query: string) => {
      setRecentSearches((prev) => {
        const nextRecentSearches = prev.filter((item) => item !== query);

        void saveRecentSearches(nextRecentSearches);

        return nextRecentSearches;
      });
    },
    [saveRecentSearches],
  );

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const mapSearchResults = useCallback((rows: SearchProductRpcRow[]) => {
    return rows.map((product) => {
      const firstName = product.vendor_first_name ?? "Unknown";
      const lastName = product.vendor_last_name ?? "Vendor";
      const image = product.image_path
        ? supabase.storage.from("products").getPublicUrl(product.image_path)
          .data.publicUrl
        : null;
      const vendorAvatar = product.vendor_profile_image_path
        ? supabase.storage
          .from("users")
          .getPublicUrl(product.vendor_profile_image_path).data.publicUrl
        : null;
      const priceValue = Number(product.price ?? 0);

      return {
        id: String(product.id),
        name: product.name ?? "Unnamed Product",
        vendorName: `${firstName} ${lastName}`.trim(),
        vendorInitials: getInitials(firstName, lastName),
        vendorAvatar,
        category: product.categories ?? "Others",
        price: `₱ ${priceValue.toFixed(2)}/${product.unit ?? "unit"}`,
        image,
      };
    });
  }, []);

  const performSearch = useCallback(
    async (query: string, sortOption: SearchSortOption = selectedSort) => {
      const normalizedQuery = query.trim();

      setSearchText(normalizedQuery);

      if (!normalizedQuery) {
        setCommittedQuery("");
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      try {
        setIsSearchLoading(true);
        setSearchSuggestions([]);
        setCommittedQuery(normalizedQuery);
        setSelectedSort(sortOption);
        setShowResults(true);

        const { data, error } = await supabase.rpc("search_products", {
          search_query: normalizedQuery,
          sort_option: sortOption,
          result_limit: SEARCH_RESULT_LIMIT,
        });

        if (error) throw new Error(error.message);

        const mappedResults = mapSearchResults(
          (data ?? []) as SearchProductRpcRow[],
        );

        setSearchResults(mappedResults);
        await persistRecentSearch(normalizedQuery);
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    },
    [mapSearchResults, persistRecentSearch, selectedSort],
  );

  const fetchSearchSuggestions = useCallback(async (query: string) => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setSearchSuggestions([]);
      return;
    }

    try {
      setIsSuggestionsLoading(true);

      const { data, error } = await supabase.rpc("search_product_suggestions", {
        search_query: normalizedQuery,
        suggestion_limit: SUGGESTION_LIMIT,
      });

      if (error) throw new Error(error.message);

      const suggestions = ((data ?? []) as SearchSuggestionRpcRow[])
        .map((item) => item.suggestion?.trim() ?? "")
        .filter(
          (item, index, array) =>
            item.length > 0 && array.indexOf(item) === index,
        );

      setSearchSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSearchSuggestions([]);
    } finally {
      setIsSuggestionsLoading(false);
    }
  }, []);

  const handleSearchTextChange = useCallback(
    (value: string) => {
      setSearchText(value);

      if (!value.trim()) {
        setCommittedQuery("");
        setSearchSuggestions([]);
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      if (showResults && value.trim() !== committedQuery) {
        setShowResults(false);
      }
    },
    [committedQuery, showResults],
  );

  const handleSubmitSearch = useCallback(() => {
    void performSearch(searchText);
  }, [performSearch, searchText]);

  const handleSuggestionPress = useCallback(
    (value: string) => {
      void performSearch(value);
      Keyboard.dismiss();
    },
    [performSearch],
  );

  const handleRecentSearchPress = useCallback(
    (value: string) => {
      void performSearch(value);
      Keyboard.dismiss();
    },
    [performSearch],
  );

  const handleSortChange = useCallback(
    (value: SearchSortOption) => {
      setSelectedSort(value);

      if (!committedQuery.trim()) return;

      void performSearch(committedQuery, value);
    },
    [committedQuery, performSearch],
  );

  useEffect(() => {
    void loadRecentSearches();
  }, [loadRecentSearches]);

  useEffect(() => {
    if (hasInitializedFromParams.current) return;

    const initialQuery = getSearchParamValue(q).trim();

    if (!initialQuery) {
      hasInitializedFromParams.current = true;
      return;
    }

    hasInitializedFromParams.current = true;
    void performSearch(initialQuery);
  }, [performSearch, q]);

  useEffect(() => {
    if (showResults || !searchText.trim()) {
      setIsSuggestionsLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      void fetchSearchSuggestions(searchText);
    }, SUGGESTION_DEBOUNCE_DELAY);

    return () => clearTimeout(timeout);
  }, [fetchSearchSuggestions, searchText, showResults]);

  const sortOptions = useMemo(
    () => [
      { label: "Newest", value: "newest" as const },
      { label: "Price: Low to High", value: "price_low" as const },
      { label: "Price: High to Low", value: "price_high" as const },
    ],
    [],
  );

  return {
    searchText,
    committedQuery,
    recentSearches,
    searchSuggestions,
    searchResults,
    selectedSort,
    sortOptions,
    isSuggestionsLoading,
    isSearchLoading,
    showResults,
    handleBack,
    handleSearchTextChange,
    handleSubmitSearch,
    handleSuggestionPress,
    handleRecentSearchPress,
    handleRemoveRecentSearch: removeRecentSearch,
    handleSortChange,
  };
};
