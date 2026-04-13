import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CustomDropdownProps<T> = {
  items: T[];
  selectedItem: T | null;
  isOpen: boolean;
  loading?: boolean;
  placeholder: string;
  emptyText: string;
  onToggle: () => void;
  onSelect: (item: T) => void;
  keyExtractor: (item: T) => string | number;
  labelExtractor: (item: T) => string;
  isItemDisabled?: (item: T) => boolean;
  renderItemSubtext?: (item: T) => React.ReactNode;
};

export const CustomDropdown = <T,>({
  items,
  selectedItem,
  isOpen,
  loading = false,
  placeholder,
  emptyText,
  onToggle,
  onSelect,
  keyExtractor,
  labelExtractor,
  isItemDisabled,
  renderItemSubtext,
}: CustomDropdownProps<T>) => {
  const [shouldRender, setShouldRender] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      fadeAnim.setValue(1);
    } else if (shouldRender) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [isOpen, shouldRender, fadeAnim]);

  return (
    <View className="relative">
      <Pressable
        onPress={onToggle}
        className="flex-row items-center justify-between p-4 bg-white border rounded-md border-white-600"
      >
        <View className="flex-1 pr-3">
          <Text
            className={`text-base ${selectedItem ? "text-black" : "text-[#b5b5b5]"}`}
          >
            {selectedItem ? labelExtractor(selectedItem) : placeholder}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color="#111111" />
        ) : (
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#6f6f6f"
          />
        )}
      </Pressable>

      {/* Dropdown */}
      {shouldRender ? (
        <Animated.View
          style={{ opacity: fadeAnim, top: 58 }}
          className="absolute z-20 w-full overflow-hidden bg-white border rounded-md shadow-lg border-white-600"
        >
          {loading ? (
            <View className="items-center py-4">
              <ActivityIndicator size="small" color="#111111" />
            </View>
          ) : items.length > 0 ? (
            <ScrollView
              nestedScrollEnabled
              className="max-h-60"
              showsVerticalScrollIndicator={false}
            >
              {items.map((item, index) => {
                const itemKey = keyExtractor(item);
                const isSelected =
                  selectedItem !== null &&
                  keyExtractor(selectedItem) === itemKey;
                const isDisabled = isItemDisabled?.(item) ?? false;

                return (
                  <Pressable
                    key={itemKey}
                    disabled={isDisabled}
                    onPress={() => onSelect(item)}
                    className={`flex-row items-center justify-between px-4 py-3 ${index !== items.length - 1 ? "border-b border-white-600" : ""} ${isDisabled ? "opacity-60" : ""} ${isSelected ? "bg-white-600" : "bg-white"}`}
                  >
                    <View className="flex-1 pr-3">
                      <Text
                        className={`text-base ${isDisabled ? "text-white-700" : "text-black"}`}
                      >
                        {labelExtractor(item)}
                      </Text>

                      {renderItemSubtext ? renderItemSubtext(item) : null}
                    </View>

                    {isSelected ? (
                      <Ionicons name="checkmark" size={18} color="#F46B45" />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <View className="px-4 py-3">
              <Text className="text-base text-white-700">{emptyText}</Text>
            </View>
          )}
        </Animated.View>
      ) : null}
    </View>
  );
};
