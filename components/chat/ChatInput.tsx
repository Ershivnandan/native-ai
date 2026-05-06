import { View, TextInput, Pressable, Text } from "react-native";
import { memo, useState, useCallback, useRef } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isGenerating: boolean;
}

const MAX_INPUT_LINES = 4;
const LINE_HEIGHT = 20;
const MIN_HEIGHT = 44;
const MAX_HEIGHT = MIN_HEIGHT + LINE_HEIGHT * (MAX_INPUT_LINES - 1);

export const ChatInput = memo(
  ({ onSend, onStop, isGenerating }: ChatInputProps) => {
    const [text, setText] = useState("");
    const [inputHeight, setInputHeight] = useState(MIN_HEIGHT);
    const inputRef = useRef<TextInput>(null);

    const handleSend = useCallback(() => {
      const trimmed = text.trim();
      if (trimmed.length === 0) return;
      onSend(trimmed);
      setText("");
      setInputHeight(MIN_HEIGHT);
    }, [text, onSend]);

    const handleStop = useCallback(() => {
      onStop?.();
    }, [onStop]);

    const handleContentSizeChange = useCallback(
      (event: { nativeEvent: { contentSize: { height: number } } }) => {
        const newHeight = Math.min(
          Math.max(event.nativeEvent.contentSize.height, MIN_HEIGHT),
          MAX_HEIGHT,
        );
        setInputHeight(newHeight);
      },
      [],
    );

    const canSend = text.trim().length > 0 && !isGenerating;

    return (
      <View className="border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3">
        <View className="flex-row items-end rounded-2xl bg-gray-100 dark:bg-gray-800 px-4 py-2">
          <TextInput
            ref={inputRef}
            className="flex-1 text-base text-gray-900 dark:text-white py-1.5"
            style={{ height: inputHeight, maxHeight: MAX_HEIGHT }}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            value={text}
            onChangeText={setText}
            onContentSizeChange={handleContentSizeChange}
            multiline
            textAlignVertical="center"
            returnKeyType="default"
            editable={!isGenerating}
            accessibilityLabel="Message input"
          />
          {isGenerating ? (
            <Pressable
              onPress={handleStop}
              className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-red-500 active:bg-red-600"
              accessibilityLabel="Stop generating"
            >
              <View className="h-3 w-3 rounded-sm bg-white" />
            </Pressable>
          ) : (
            <Pressable
              onPress={handleSend}
              disabled={!canSend}
              className={`ml-2 h-9 w-9 items-center justify-center rounded-full ${
                canSend
                  ? "bg-primary-500 active:bg-primary-600"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              accessibilityLabel="Send message"
            >
              <Text
                className={`text-lg font-bold ${
                  canSend ? "text-white" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                ↑
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  },
);
