import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useCallback } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { EmptyState } from "@/components/common/EmptyState";
import { useChat } from "@/hooks/useChat";
import { useAI } from "@/hooks/useAI";

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { sendMessage, isGenerating } = useChat();
  const { generateResponse, modelStatus } = useAI();

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSend = useCallback(
    (message: string) => {
      const chatId = sendMessage(message);
      if (chatId) {
        if (modelStatus === "ready") {
          const userMessage = {
            id: "temp",
            chatId,
            role: "user" as const,
            content: message,
            createdAt: Date.now(),
          };
          generateResponse(chatId, [userMessage]);
        }
        router.push(`/(drawer)/chat/${chatId}`);
      }
    },
    [sendMessage, generateResponse, modelStatus, router],
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

        {modelStatus !== "ready" && (
          <View className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2">
            <Text className="text-sm text-yellow-700 dark:text-yellow-400">
              {modelStatus === "loading"
                ? "Loading model..."
                : "No model loaded. Go to Settings to load a model."}
            </Text>
          </View>
        )}

        <EmptyState onSuggestionPress={handleSuggestionPress} />
        <ChatInput onSend={handleSend} isGenerating={isGenerating} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
