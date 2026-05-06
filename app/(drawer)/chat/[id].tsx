import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useCallback } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatList } from "@/components/chat/ChatList";
import { ChatInput } from "@/components/chat/ChatInput";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSend = useCallback(
    (_message: string) => {
      // Will dispatch addMessage in Phase 5
      void id;
    },
    [id],
  );

  const handleStop = useCallback(() => {
    // Will stop generation in Phase 6
  }, []);

  const handleMessageLongPress = useCallback((_messageId: string) => {
    // Copied to clipboard via ChatBubble
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ChatHeader title="Chat" onMenuPress={handleMenuPress} />
        <ChatList
          messages={[]}
          isGenerating={false}
          onMessageLongPress={handleMessageLongPress}
        />
        <ChatInput
          onSend={handleSend}
          onStop={handleStop}
          isGenerating={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
