import { View, Text, Pressable } from "react-native";
import { memo, useCallback, useMemo } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Clipboard from "expo-clipboard";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { Message } from "@/types/chat";

interface ChatBubbleProps {
  message: Message;
  onLongPress?: (messageId: string) => void;
  isStreaming?: boolean;
}

const ANIMATION_DURATION = 200;

export const ChatBubble = memo(
  ({ message, onLongPress, isStreaming }: ChatBubbleProps) => {
    const isUser = message.role === "user";
    const hasContent = message.content.length > 0;

    const handleLongPress = useCallback(() => {
      if (!hasContent) return;
      Clipboard.setStringAsync(message.content);
      onLongPress?.(message.id);
    }, [message.id, message.content, hasContent, onLongPress]);

    const formattedTime = useMemo(
      () =>
        new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      [message.createdAt],
    );

    const shouldShowMarkdown = !isUser && hasContent && !isStreaming;

    return (
      <Animated.View
        entering={FadeInDown.duration(ANIMATION_DURATION)}
        className={`mb-3 px-4 ${isUser ? "items-end" : "items-start"}`}
      >
        <Pressable
          onLongPress={handleLongPress}
          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
            isUser
              ? "rounded-br-sm bg-primary-500"
              : "rounded-bl-sm bg-chat-assistant dark:bg-chat-assistantDark"
          }`}
          accessibilityLabel={`${isUser ? "Your" : "AI"} message`}
          accessibilityHint="Long press to copy"
        >
          {shouldShowMarkdown ? (
            <MarkdownRenderer content={message.content} />
          ) : (
            <Text
              className={`text-base ${
                isUser ? "text-white" : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {message.content}
            </Text>
          )}
        </Pressable>
        {!isStreaming && (
          <Text className="mt-1 px-1 text-xs text-gray-400 dark:text-gray-500">
            {formattedTime}
          </Text>
        )}
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.message.content !== nextProps.message.content) return false;
    if (prevProps.isStreaming !== nextProps.isStreaming) return false;
    return true;
  },
);
