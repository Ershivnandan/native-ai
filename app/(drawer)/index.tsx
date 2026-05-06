import { View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useCallback } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { EmptyState } from "@/components/common/EmptyState";

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSend = useCallback((_message: string) => {
    // Will create a new chat and navigate in Phase 5
  }, []);

  const handleSuggestionPress = useCallback((suggestion: string) => {
    handleSend(suggestion);
  }, [handleSend]);

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ChatHeader title="New Chat" onMenuPress={handleMenuPress} />
        <EmptyState onSuggestionPress={handleSuggestionPress} />
        <ChatInput onSend={handleSend} isGenerating={false} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
