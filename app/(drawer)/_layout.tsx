import { Drawer } from "expo-router/drawer";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { useChat } from "@/hooks/useChat";
import { useCallback } from "react";

function DrawerContent() {
  const router = useRouter();
  const { chatsMetadata, chatId, switchToChat, removeChat, createNewChat } =
    useChat();

  const handleChatSelect = useCallback(
    (id: string) => {
      switchToChat(id);
      router.push(`/(drawer)/chat/${id}`);
    },
    [router, switchToChat],
  );

  const handleNewChat = useCallback(() => {
    createNewChat();
    router.replace("/(drawer)");
  }, [router, createNewChat]);

  const handleDeleteChat = useCallback(
    (id: string) => {
      removeChat(id);
    },
    [removeChat],
  );

  const handleSettingsPress = useCallback(() => {
    router.push("/(drawer)/settings");
  }, [router]);

  return (
    <SafeAreaView className="flex-1">
      <ChatSidebar
        chats={chatsMetadata}
        activeChatId={chatId}
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
