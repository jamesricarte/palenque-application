import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import NotificationsLoadingSkeleton from "@/src/features/app/consumer-tabs/notifications/components/NotificationsLoadingSkeleton";
import { useNotifications } from "@/src/features/app/consumer-tabs/notifications/useNotifications";

const NotificationsScreen = () => {
  const {
    activeTab,
    setActiveTab,
    notificationTabs,
    filteredNotifications,
    loading,
  } = useNotifications();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="px-5 pt-2 pb-5 border-b border-white-600">
        <Text className="text-[22px] font-semibold text-black-500">
          Notifications
        </Text>
      </View>

      <View className="px-5 py-4 border-b border-white-600">
        <View className="flex-row gap-2">
          {notificationTabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`rounded-md border px-4 py-2 ${
                  isActive
                    ? "border-primary-500 bg-primary-500"
                    : "border-brandBlack-50 bg-white"
                }`}
              >
                <Text
                  className={`text-[13px] ${
                    isActive ? "text-white" : "text-black"
                  }`}
                >
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <NotificationsLoadingSkeleton />
        ) : filteredNotifications.length === 0 ? (
          <View className="items-center justify-center px-10 py-16">
            <Text className="text-base text-center text-white-700">
              No unread notifications right now.
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <View
              key={notification.id}
              className="px-5 py-4 border-b border-white-600"
            >
              <Text className="text-lg font-medium text-black-500">
                {notification.title}
              </Text>

              <Text className="mt-2 text-base leading-6 text-black-400">
                {notification.description}
              </Text>

              <Text className="mt-1 text-sm text-white-700">
                {notification.timeAgo}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
