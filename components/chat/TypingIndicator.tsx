import { View } from "react-native";
import { memo, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";

const DOT_SIZE = 8;
const BOUNCE_HEIGHT = -6;
const DURATION = 400;

function AnimatedDot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(BOUNCE_HEIGHT, { duration: DURATION }),
          withTiming(0, { duration: DURATION }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          marginHorizontal: 3,
        },
        animatedStyle,
      ]}
      className="bg-gray-400 dark:bg-gray-500"
    />
  );
}

export const TypingIndicator = memo(() => {
  return (
    <View className="mb-3 items-start px-4">
      <View className="flex-row items-center rounded-2xl rounded-bl-sm bg-chat-assistant dark:bg-chat-assistantDark px-4 py-4">
        <AnimatedDot delay={0} />
        <AnimatedDot delay={150} />
        <AnimatedDot delay={300} />
      </View>
    </View>
  );
});
