import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useCallback } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { EmptyState } from "@/components/common/EmptyState";
import { useChat } from "@/hooks/useChat";

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { sendMessage, isGenerating } = useChat();

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSend = useCallback(
    (message: string) => {
      const chatId = sendMessage(message);
      if (chatId) {
        router.push(`/(drawer)/chat/${chatId}`);
      }
    },
    [sendMessage, router],
  );

  const handleSuggestionPress = useCallback(
    (suggestion: string) => {
      handleSend(suggestion);
    },
    [handleSend],
  );

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ChatHeader title="New Chat" onMenuPress={handleMenuPress} />
        <EmptyState onSuggestionPress={handleSuggestionPress} />
        <ChatInput onSend={handleSend} isGenerating={isGenerating} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
