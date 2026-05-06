import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useCallback, useMemo } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatList } from "@/components/chat/ChatList";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { chat, messages, isGenerating, sendMessage, stopGenerating } =
    useChat({ chatId: id });

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSend = useCallback(
    (message: string) => {
      sendMessage(message);
    },
    [sendMessage],
  );

  const handleStop = useCallback(() => {
    stopGenerating();
  }, [stopGenerating]);

  const handleMessageLongPress = useCallback((_messageId: string) => {
    // Message copied via ChatBubble long press
  }, []);

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
