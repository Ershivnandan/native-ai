import { View, Text, ActivityIndicator } from "react-native";
import { memo } from "react";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = memo(
  ({ message = "Loading..." }: LoadingScreenProps) => {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-base text-gray-500 dark:text-gray-400">
          {message}
        </Text>
      </View>
    );
  },
);
