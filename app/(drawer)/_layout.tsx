import { Drawer } from "expo-router/drawer";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { useCallback } from "react";

function DrawerContent() {
  const router = useRouter();

  const handleChatSelect = useCallback(
    (chatId: string) => {
      router.push(`/(drawer)/chat/${chatId}`);
    },
    [router],
  );

  const handleNewChat = useCallback(() => {
    router.replace("/(drawer)");
  }, [router]);

  const handleDeleteChat = useCallback((_chatId: string) => {
    // Will be implemented in Phase 5 with Redux
  }, []);

  const handleSettingsPress = useCallback(() => {
    router.push("/(drawer)/settings");
  }, [router]);

  return (
    <SafeAreaView className="flex-1">
      <ChatSidebar
        chats={[]}
        activeChatId={null}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onSettingsPress={handleSettingsPress}
      />
    </SafeAreaView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={DrawerContent}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          width: 280,
        },
      }}
    />
  );
}
