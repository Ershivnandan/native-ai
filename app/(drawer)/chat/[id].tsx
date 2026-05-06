import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="flex-row items-center border-b border-border-light dark:border-border-dark px-4 py-3">
        <Pressable
          onPress={handleOpenDrawer}
          className="mr-3 rounded-lg p-2 active:bg-gray-100 dark:active:bg-gray-800"
          accessibilityLabel="Open menu"
        >
          <Text className="text-lg text-gray-700 dark:text-gray-200">☰</Text>
        </Pressable>
        <Text
          className="flex-1 text-lg font-semibold text-gray-900 dark:text-white"
          numberOfLines={1}
        >
          Chat
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-base text-gray-500 dark:text-gray-400">
          Chat ID: {id}
        </Text>
        <Text className="mt-2 text-sm text-gray-400 dark:text-gray-500">
          Messages will appear here
        </Text>
      </View>

      <View className="border-t border-border-light dark:border-border-dark px-4 py-3">
        <View className="flex-row items-center rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3">
          <Text className="flex-1 text-base text-gray-400 dark:text-gray-500">
            Type a message...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
