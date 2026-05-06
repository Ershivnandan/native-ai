import { router } from "expo-router";

export const navigateToChat = (chatId: string) => {
  router.push(`/(drawer)/chat/${chatId}`);
};

export const navigateToNewChat = () => {
  router.replace("/(drawer)");
};

export const navigateToSettings = () => {
  router.push("/(drawer)/settings");
};

export const goBack = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    navigateToNewChat();
  }
};
