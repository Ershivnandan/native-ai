import { View, Text, Pressable } from "react-native";
import { memo } from "react";

interface EmptyStateProps {
  onSuggestionPress?: (suggestion: string) => void;
}

const SUGGESTIONS = [
  "Explain quantum computing simply",
  "Write a short poem about nature",
  "Help me brainstorm project ideas",
  "What are good coding practices?",
];

export const EmptyState = memo(({ onSuggestionPress }: EmptyStateProps) => {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-3xl font-bold text-gray-900 dark:text-white">
        MyAI
      </Text>
      <Text className="mt-2 text-center text-base text-gray-500 dark:text-gray-400">
        Your private, offline AI assistant
      </Text>

      {onSuggestionPress && (
        <View className="mt-8 w-full max-w-sm">
          <Text className="mb-3 text-center text-sm font-medium text-gray-400 dark:text-gray-500">
            Try asking...
          </Text>
          {SUGGESTIONS.map((suggestion) => (
            <Pressable
              key={suggestion}
              onPress={() => onSuggestionPress(suggestion)}
              className="mb-2 rounded-xl border border-border-light dark:border-border-dark px-4 py-3 active:bg-gray-50 dark:active:bg-gray-800"
              accessibilityLabel={`Suggestion: ${suggestion}`}
            >
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                {suggestion}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
});
