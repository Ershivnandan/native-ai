import { Drawer } from "expo-router/drawer";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

function DrawerContent() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface-light dark:bg-surface-dark">
      <View className="border-b border-border-light dark:border-border-dark px-4 py-4">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          MyAI
        </Text>
        <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Offline AI Assistant
        </Text>
      </View>

      <View className="flex-1 px-2 py-2">
        <Pressable
          className="flex-row items-center rounded-lg px-3 py-3 active:bg-gray-100 dark:active:bg-gray-800"
          onPress={() => router.push("/")}
          accessibilityLabel="Start new chat"
        >
          <Text className="text-base text-gray-700 dark:text-gray-200">
            + New Chat
          </Text>
        </Pressable>
      </View>

      <View className="border-t border-border-light dark:border-border-dark px-2 py-2">
        <Pressable
          className="flex-row items-center rounded-lg px-3 py-3 active:bg-gray-100 dark:active:bg-gray-800"
          onPress={() => router.push("/settings")}
          accessibilityLabel="Open settings"
        >
          <Text className="text-base text-gray-700 dark:text-gray-200">
            Settings
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={DrawerContent}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          width: 280,
        },
      }}
    />
  );
}
