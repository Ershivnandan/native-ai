import { AccessibilityInfo, Platform } from "react-native";

export const announceForAccessibility = (message: string) => {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    AccessibilityInfo.announceForAccessibility(message);
  }
};
