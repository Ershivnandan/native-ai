import { View, Text, Pressable } from "react-native";
import { memo, useCallback } from "react";
import * as Clipboard from "expo-clipboard";
import type { Message } from "@/types/chat";

interface ChatBubbleProps {
  message: Message;
  onLongPress?: (messageId: string) => void;
}

export const ChatBubble = memo(({ message, onLongPress }: ChatBubbleProps) => {
  const isUser = message.role === "user";

  const handleLongPress = useCallback(() => {
    Clipboard.setStringAsync(message.content);
    onLongPress?.(message.id);
  }, [message.id, message.content, onLongPress]);

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      className={`mb-3 px-4 ${isUser ? "items-end" : "items-start"}`}
    >
      <Pressable
        onLongPress={handleLongPress}
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "rounded-br-sm bg-primary-500"
            : "rounded-bl-sm bg-chat-assistant dark:bg-chat-assistantDark"
        }`}
        accessibilityLabel={`${isUser ? "Your" : "AI"} message: ${message.content}`}
        accessibilityHint="Long press to copy"
      >
        <Text
          className={`text-base ${
            isUser ? "text-white" : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {message.content}
        </Text>
      </Pressable>
      <Text className="mt-1 px-1 text-xs text-gray-400 dark:text-gray-500">
        {formattedTime}
      </Text>
    </View>
  );
});
