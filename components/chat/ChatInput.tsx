import { View, TextInput, Pressable, Text, Keyboard } from "react-native";
import { memo, useState, useCallback, useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isGenerating: boolean;
  maxLength?: number;
}

const MAX_INPUT_LINES = 5;
const LINE_HEIGHT = 20;
const MIN_HEIGHT = 44;
const MAX_HEIGHT = MIN_HEIGHT + LINE_HEIGHT * (MAX_INPUT_LINES - 1);
const DEFAULT_MAX_LENGTH = 4000;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ChatInput = memo(
  ({
    onSend,
    onStop,
    isGenerating,
    maxLength = DEFAULT_MAX_LENGTH,
  }: ChatInputProps) => {
    const [text, setText] = useState("");
    const [inputHeight, setInputHeight] = useState(MIN_HEIGHT);
    const inputRef = useRef<TextInput>(null);
    const buttonScale = useSharedValue(1);

    const handleSend = useCallback(() => {
      const trimmed = text.trim();
      if (trimmed.length === 0 || isGenerating) return;
      onSend(trimmed);
      setText("");
      setInputHeight(MIN_HEIGHT);
      Keyboard.dismiss();
    }, [text, onSend, isGenerating]);

    const handleStop = useCallback(() => {
      onStop?.();
    }, [onStop]);

    const handleChangeText = useCallback(
      (newText: string) => {
        if (newText.length <= maxLength) {
          setText(newText);
        }
      },
      [maxLength],
    );

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

    const handlePressIn = useCallback(() => {
      buttonScale.value = withSpring(0.9, { damping: 15 });
    }, [buttonScale]);

    const handlePressOut = useCallback(() => {
      buttonScale.value = withSpring(1, { damping: 15 });
    }, [buttonScale]);

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: buttonScale.value }],
    }));

    const canSend = text.trim().length > 0 && !isGenerating;
    const isNearLimit = text.length > maxLength * 0.9;

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
            onChangeText={handleChangeText}
            onContentSizeChange={handleContentSizeChange}
            multiline
            textAlignVertical="center"
            returnKeyType="default"
            editable={!isGenerating}
            blurOnSubmit={false}
            accessibilityLabel="Message input"
            accessibilityHint={`${text.length} of ${maxLength} characters`}
          />
          {isGenerating ? (
            <AnimatedPressable
              onPress={handleStop}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={buttonAnimatedStyle}
              className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-red-500 active:bg-red-600"
              accessibilityLabel="Stop generating"
            >
              <View className="h-3 w-3 rounded-sm bg-white" />
            </AnimatedPressable>
          ) : (
            <AnimatedPressable
              onPress={handleSend}
              onPressIn={canSend ? handlePressIn : undefined}
              onPressOut={canSend ? handlePressOut : undefined}
              disabled={!canSend}
              style={buttonAnimatedStyle}
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
            </AnimatedPressable>
          )}
        </View>
        {isNearLimit && (
          <Text className="mt-1 text-right text-xs text-gray-400">
            {text.length}/{maxLength}
          </Text>
        )}
      </View>
    );
  },
);
