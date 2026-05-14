import { useEffect, useMemo, useState } from "react";

const notificationTabs = ["All", "Unread"] as const;

const notifications = [
  {
    id: "1",
    title: "Order Update",
    description: "Your order from Vendor Name is now being prepared.",
    timeAgo: "2 minutes ago",
    isRead: false,
  },
  {
    id: "2",
    title: "Order Completed",
    description: "Your order from Vendor Name has been successfully delivered.",
    timeAgo: "2 days ago",
    isRead: true,
  },
] as const;

export const useNotifications = () => {
  const [activeTab, setActiveTab] =
    useState<(typeof notificationTabs)[number]>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const filteredNotifications = useMemo(() => {
    if (activeTab === "Unread") {
      return notifications.filter((notification) => !notification.isRead);
    }

    return notifications;
  }, [activeTab]);

  return {
    activeTab,
    setActiveTab,
    notificationTabs,
    filteredNotifications,
    loading,
  };
};
