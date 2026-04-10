import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { supabase } from "@/src/config/supabaseClient";
import { useAuth } from "@/src/hooks/useAuth";

const statusLabelMap: Record<string, string> = {
  active: "Active",
  suspended: "Suspended",
  deleted: "Deleted",
};

const statusClassNameMap: Record<string, string> = {
  active: "bg-primary-500",
  suspended: "bg-secondary-500",
  deleted: "bg-red-500",
};

export const useProfileDetails = () => {
  const { user, session, isLoading, fetchUserData } = useAuth();
  const [isUpdatingProfileImage, setIsUpdatingProfileImage] = useState(false);

  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`
    .toUpperCase();
  const statusKey = user?.status?.toLowerCase() ?? "active";

  const profileSections = [
    {
      title: "Personal Information",
      items: [
        {
          label: "First Name",
          value: user?.first_name || "Not provided",
          icon: "person-outline" as const,
        },
        {
          label: "Last Name",
          value: user?.last_name || "Not provided",
          icon: "people-outline" as const,
        },
      ],
    },
    {
      title: "Contact Details",
      items: [
        {
          label: "Email Address",
          value: user?.email || "Not provided",
          icon: "mail-outline" as const,
        },
        {
          label: "Phone Number",
          value: user?.phone || "Not provided",
          icon: "call-outline" as const,
        },
        {
          label: "Delivery Address",
          value: user?.delivery_address || "Not provided",
          icon: "location-outline" as const,
        },
      ],
    },
  ];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(app)/(consumer-tabs)/profile");
  };

  const handleSelectProfileImage = async () => {
    try {
      if (isUpdatingProfileImage) return;

      const userId = session?.user.id;

      if (!userId || !session) {
        Alert.alert(
          "Session required",
          "Unable to get your account session. Please log in again.",
        );
        return;
      }

      const permissionResult = await ImagePicker
        .requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photo library to update your profile image.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        Alert.alert(
          "Image selection failed",
          "Unable to get the selected image.",
        );
        return;
      }

      setIsUpdatingProfileImage(true);

      const response = await fetch(asset.uri);
      const arrayBuffer = await response.arrayBuffer();
      const fileExtension = asset.fileName?.split(".").pop()?.toLowerCase() ||
        asset.mimeType?.split("/").pop()?.toLowerCase() ||
        "jpg";
      const filePath =
        `profile-images/${userId}/${Date.now()}.${fileExtension}`;
      const previousProfileImagePath = user?.profile_image_path;

      const { error: uploadError } = await supabase.storage
        .from("users")
        .upload(filePath, arrayBuffer, {
          contentType: asset.mimeType || "image/jpeg",
          upsert: false,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { error: updateError } = await supabase
        .from("users")
        .update({
          profile_image_path: filePath,
        })
        .eq("user_id", userId);

      if (updateError) {
        await supabase.storage.from("users").remove([filePath]);
        throw new Error(updateError.message);
      }

      if (previousProfileImagePath) {
        const { error: removeError } = await supabase.storage
          .from("users")
          .remove([previousProfileImagePath]);

        if (removeError) {
          console.error(removeError);
        }
      }

      await fetchUserData(session);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Profile image update failed",
        "Something went wrong while updating your profile image.",
      );
    } finally {
      setIsUpdatingProfileImage(false);
    }
  };

  return {
    user,
    isLoading,
    fullName: fullName || "My Profile",
    initials: initials || "MP",
    statusLabel: statusLabelMap[statusKey] || "Active",
    statusClassName: statusClassNameMap[statusKey] || "bg-primary-500",
    profileSections,
    isUpdatingProfileImage,
    handleBack,
    handleSelectProfileImage,
  };
};
