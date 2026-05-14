import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { useSearchOverlay } from "@/src/features/app/search/useSearchOverlay";
import { router } from "expo-router";
import SearchResultsLoadingSkeleton from "@/src/features/app/search/components/SearchResultsLoadingSkeleton";
import SearchSuggestionsLoadingSkeleton from "@/src/features/app/search/components/SearchSuggestionsLoadingSkeleton";

const SearchOverlayScreen = () => {
  const {
    searchText,
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
    handleRemoveRecentSearch,
    handleSortChange,
  } = useSearchOverlay();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-4 border-b border-white-600">
        <Pressable onPress={handleBack} className="mr-3" hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>

        <View className="flex-row items-center flex-1 px-4 rounded-full bg-white-600">
          <Ionicons name="search" size={22} color="#b5b5b5" />

          <TextInput
            value={searchText}
            onChangeText={handleSearchTextChange}
            onSubmitEditing={handleSubmitSearch}
            placeholder="Search a product"
            placeholderTextColor="#b5b5b5"
            returnKeyType="search"
            autoFocus
            className="flex-1 py-3 pl-3 text-base text-black-500"
          />

          {searchText.trim().length > 0 ? (
            <Pressable
              onPress={() => handleSearchTextChange("")}
              className="ml-2"
              hitSlop={10}
            >
              <Ionicons name="close-circle" size={20} color="#b5b5b5" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {showResults ? (
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="py-4 border-b border-white-600">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              <View className="flex-row gap-2">
                {sortOptions.map((option) => {
                  const isSelected = selectedSort === option.value;

                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => handleSortChange(option.value)}
                      className={`rounded-md border px-3 py-2 ${
                        isSelected
                          ? "border-primary-500 bg-primary-500"
                          : "border-brandBlack-50 bg-white"
                      }`}
                    >
                      <Text
                        className={`text-[13px] ${
                          isSelected ? "text-white" : "text-black"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <View className="px-5 pt-4 pb-8">
            <View className="mt-1.5">
              <Text className="text-xl font-semibold text-black-500">
                Search Results ({searchResults.length})
              </Text>
            </View>

            {isSearchLoading ? (
              <SearchResultsLoadingSkeleton />
            ) : searchResults.length === 0 ? (
              <View className="items-center justify-center py-16">
                <Text className="text-base text-center text-white-700">
                  No products matched your search.
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between mt-4">
                {searchResults.map((product) => (
                  <Pressable
                    key={product.id}
                    onPress={() => router.push(`/(app)/products/${product.id}`)}
                    className="mb-4 overflow-hidden bg-white border rounded-lg border-white-600"
                    style={{ width: "48%" }}
                  >
                    <View className="overflow-hidden rounded-t-lg h-28">
                      {product.image ? (
                        <Image
                          source={{ uri: product.image }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="items-center justify-center w-full h-full bg-brandBlack-50">
                          <Ionicons
                            name="image-outline"
                            size={28}
                            color="#9ca3af"
                          />
                        </View>
                      )}
                    </View>

                    <View className="px-3 py-3">
                      <Text
                        className="text-base font-semibold text-black-500"
                        numberOfLines={2}
                      >
                        {product.name}
                      </Text>

                      <View className="flex-row items-center gap-2 mt-2">
                        {product.vendorAvatar ? (
                          <Image
                            source={{ uri: product.vendorAvatar }}
                            className="w-5 h-5 rounded-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="items-center justify-center w-5 h-5 rounded-full bg-brandBlack-50">
                            <Text className="text-[10px] font-semibold text-black-500">
                              {product.vendorInitials}
                            </Text>
                          </View>
                        )}

                        <Text
                          className="flex-1 text-sm text-white-700"
                          numberOfLines={1}
                        >
                          {product.vendorName}
                        </Text>
                      </View>

                      <View className="mt-2">
                        <View className="self-start px-2 py-1 bg-green-700 rounded">
                          <Text className="text-xs text-white">
                            {product.category}
                          </Text>
                        </View>
                      </View>

                      <Text className="mt-2 text-base font-semibold text-primary-500">
                        {product.price}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!searchText.trim() ? (
            <View>
              <Text className="text-xl font-semibold text-black-500">
                Recent Searches
              </Text>

              <View className="mt-4">
                {recentSearches.length === 0 ? (
                  <Text className="text-base text-white-700">
                    Your recent searches will show up here.
                  </Text>
                ) : (
                  recentSearches.map((item) => (
                    <View
                      key={item}
                      className="flex-row items-center justify-between py-1.5"
                    >
                      <Pressable
                        onPress={() => handleRecentSearchPress(item)}
                        className="flex-1 pr-4"
                      >
                        <Text className="text-lg text-black-500">{item}</Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleRemoveRecentSearch(item)}
                        hitSlop={10}
                      >
                        <Ionicons name="close" size={22} color="#374151" />
                      </Pressable>
                    </View>
                  ))
                )}
              </View>
            </View>
          ) : (
            <View>
              <Text className="text-xl font-semibold text-black-500">
                Suggestions
              </Text>

              <View className="mt-4">
                {isSuggestionsLoading ? (
                  <SearchSuggestionsLoadingSkeleton />
                ) : searchSuggestions.length === 0 ? (
                  <Text className="text-base text-white-700">
                    No suggestions found.
                  </Text>
                ) : (
                  searchSuggestions.map((item) => (
                    <Pressable
                      key={item}
                      onPress={() => handleSuggestionPress(item)}
                      className="flex-row items-center py-1.5"
                    >
                      <Ionicons
                        name="search"
                        size={18}
                        color="#6b7280"
                        style={{ marginRight: 12 }}
                      />

                      <Text className="flex-1 text-lg text-black-500">
                        {item}
                      </Text>
                    </Pressable>
                  ))
                )}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SearchOverlayScreen;
