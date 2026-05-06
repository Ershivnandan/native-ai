import { View, Text, Pressable } from "react-native";
import { memo } from "react";

interface ChatHeaderProps {
  title: string;
  onMenuPress: () => void;
  onTitlePress?: () => void;
}

export const ChatHeader = memo(
  ({ title, onMenuPress, onTitlePress }: ChatHeaderProps) => {
    return (
      <View className="flex-row items-center border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3">
        <Pressable
          onPress={onMenuPress}
          className="mr-3 rounded-lg p-2 active:bg-gray-100 dark:active:bg-gray-800"
          accessibilityLabel="Open menu"
        >
          <Text className="text-lg text-gray-700 dark:text-gray-200">☰</Text>
        </Pressable>

        <Pressable
          onPress={onTitlePress}
          className="flex-1 active:opacity-70"
          disabled={!onTitlePress}
          accessibilityLabel={`Chat: ${title}`}
        >
          <Text
            className="text-lg font-semibold text-gray-900 dark:text-white"
            numberOfLines={1}
          >
            {title}
          </Text>
        </Pressable>
      </View>
    );
  },
);
