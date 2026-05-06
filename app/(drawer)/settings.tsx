import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="flex-row items-center border-b border-border-light dark:border-border-dark px-4 py-3">
        <Pressable
          onPress={handleGoBack}
          className="mr-3 rounded-lg p-2 active:bg-gray-100 dark:active:bg-gray-800"
          accessibilityLabel="Go back"
        >
          <Text className="text-lg text-gray-700 dark:text-gray-200">←</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Settings
        </Text>
      </View>

      <View className="flex-1 px-4 py-4">
        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium uppercase text-gray-500 dark:text-gray-400">
            Appearance
          </Text>
          <View className="rounded-xl bg-surface-light dark:bg-surface-dark p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-gray-900 dark:text-white">
                Theme
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                System
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium uppercase text-gray-500 dark:text-gray-400">
            AI Model
          </Text>
          <View className="rounded-xl bg-surface-light dark:bg-surface-dark p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-gray-900 dark:text-white">
                Model
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Not loaded
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text className="mb-2 text-sm font-medium uppercase text-gray-500 dark:text-gray-400">
            About
          </Text>
          <View className="rounded-xl bg-surface-light dark:bg-surface-dark p-4">
            <Text className="text-base text-gray-900 dark:text-white">
              MyAI v1.0.0
            </Text>
            <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Fully offline AI chat assistant
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
