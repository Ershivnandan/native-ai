import { View, Text, Pressable, FlatList } from "react-native";
import { memo, useCallback } from "react";
import type { ChatMetadata } from "@/types/chat";

interface ChatSidebarProps {
  chats: ChatMetadata[];
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onSettingsPress: () => void;
}

interface ChatItemProps {
  chat: ChatMetadata;
  isActive: boolean;
  onPress: (chatId: string) => void;
  onLongPress: (chatId: string) => void;
}

const ChatItem = memo(
  ({ chat, isActive, onPress, onLongPress }: ChatItemProps) => {
    const handlePress = useCallback(() => onPress(chat.id), [chat.id, onPress]);
    const handleLongPress = useCallback(
      () => onLongPress(chat.id),
      [chat.id, onLongPress],
    );

    return (
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        className={`mx-2 mb-1 rounded-lg px-3 py-3 ${
          isActive
            ? "bg-primary-100 dark:bg-primary-900/30"
            : "active:bg-gray-100 dark:active:bg-gray-800"
        }`}
        accessibilityLabel={`Chat: ${chat.title}`}
        accessibilityState={{ selected: isActive }}
      >
        <Text
          className={`text-base ${
            isActive
              ? "font-medium text-primary-700 dark:text-primary-300"
              : "text-gray-800 dark:text-gray-200"
          }`}
          numberOfLines={1}
        >
          {chat.title}
        </Text>
        {chat.lastMessagePreview.length > 0 && (
          <Text
            className="mt-0.5 text-sm text-gray-500 dark:text-gray-400"
            numberOfLines={1}
          >
            {chat.lastMessagePreview}
          </Text>
        )}
      </Pressable>
    );
  },
);

export const ChatSidebar = memo(
  ({
    chats,
    activeChatId,
    onChatSelect,
    onNewChat,
    onDeleteChat,
    onSettingsPress,
  }: ChatSidebarProps) => {
    const renderItem = useCallback(
      ({ item }: { item: ChatMetadata }) => (
        <ChatItem
          chat={item}
          isActive={item.id === activeChatId}
          onPress={onChatSelect}
          onLongPress={onDeleteChat}
        />
      ),
      [activeChatId, onChatSelect, onDeleteChat],
    );

    const keyExtractor = useCallback((item: ChatMetadata) => item.id, []);

    return (
      <View className="flex-1 bg-surface-light dark:bg-surface-dark">
        <View className="border-b border-border-light dark:border-border-dark px-4 py-4">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Native AI
          </Text>
          <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Offline AI Assistant
          </Text>
        </View>

        <Pressable
          onPress={onNewChat}
          className="mx-2 mt-2 flex-row items-center rounded-lg px-3 py-3 active:bg-gray-100 dark:active:bg-gray-800"
          accessibilityLabel="Start new chat"
        >
          <Text className="text-base font-medium text-primary-500">
            + New Chat
          </Text>
        </Pressable>

        <FlatList
          data={chats}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          className="flex-1 mt-1"
          showsVerticalScrollIndicator={false}
          initialNumToRender={20}
        />

        <View className="border-t border-border-light dark:border-border-dark px-2 py-2">
          <Pressable
            onPress={onSettingsPress}
            className="flex-row items-center rounded-lg px-3 py-3 active:bg-gray-100 dark:active:bg-gray-800"
            accessibilityLabel="Open settings"
          >
            <Text className="text-base text-gray-700 dark:text-gray-200">
              Settings
            </Text>
          </Pressable>
        </View>
      </View>
    );
  },
);
