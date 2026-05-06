import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useCallback, useMemo } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatList } from "@/components/chat/ChatList";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useAI } from "@/hooks/useAI";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { chat, messages, isGenerating, sendMessage } = useChat({
    chatId: id,
  });
  const { generateResponse, stopGeneration, modelStatus, error } = useAI();

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSend = useCallback(
    (message: string) => {
      const chatId = sendMessage(message);
      if (chatId && modelStatus === "ready") {
        const updatedMessages = [
          ...messages,
          {
            id: "temp",
            chatId,
            role: "user" as const,
            content: message,
            createdAt: Date.now(),
          },
        ];
        generateResponse(chatId, updatedMessages);
      }
    },
    [sendMessage, generateResponse, messages, modelStatus],
  );

  const handleStop = useCallback(() => {
    stopGeneration();
  }, [stopGeneration]);

  const handleMessageLongPress = useCallback((_messageId: string) => {}, []);

  const reversedMessages = useMemo(
    () => [...messages].reverse(),
    [messages],
  );

  const chatTitle = chat?.title ?? "Chat";

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ChatHeader title={chatTitle} onMenuPress={handleMenuPress} />

        {error && (
          <View className="bg-red-50 dark:bg-red-900/20 px-4 py-2">
            <Text className="text-sm text-red-600 dark:text-red-400">
              {error}
            </Text>
          </View>
        )}

        {modelStatus !== "ready" && !error && (
          <View className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2">
            <Text className="text-sm text-yellow-700 dark:text-yellow-400">
              {modelStatus === "loading"
                ? "Loading model..."
                : "No model loaded. Go to Settings to load a model."}
            </Text>
          </View>
        )}

        <ChatList
          messages={reversedMessages}
          isGenerating={isGenerating}
          onMessageLongPress={handleMessageLongPress}
        />
        <ChatInput
          onSend={handleSend}
          onStop={handleStop}
          isGenerating={isGenerating}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
