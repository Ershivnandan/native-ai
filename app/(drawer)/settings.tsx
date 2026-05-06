import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useAI } from "@/hooks/useAI";
import { useCallback } from "react";
import * as DocumentPicker from "expo-document-picker";
import type { ThemeMode } from "@/types/settings";

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { themeMode, setThemeMode } = useTheme();
  const { modelStatus, loadProgress, loadModelFromPath, unload, error } =
    useAI();

  const handleGoBack = () => {
    router.back();
  };

  const handlePickModel = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      await loadModelFromPath(result.assets[0].uri);
    }
  }, [loadModelFromPath]);

  const handleUnloadModel = useCallback(async () => {
    await unload();
  }, [unload]);

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
          <View className="rounded-xl bg-surface-light dark:bg-surface-dark p-1">
            <View className="flex-row">
              {THEME_OPTIONS.map((option) => {
                const isActive = themeMode === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setThemeMode(option.value)}
                    className={`flex-1 items-center rounded-lg py-2.5 ${
                      isActive
                        ? "bg-primary-500"
                        : "active:bg-gray-100 dark:active:bg-gray-700"
                    }`}
                    accessibilityLabel={`Set theme to ${option.label}`}
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium uppercase text-gray-500 dark:text-gray-400">
            AI Model
          </Text>
          <View className="rounded-xl bg-surface-light dark:bg-surface-dark p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base text-gray-900 dark:text-white">
                Status
              </Text>
              <View className="flex-row items-center">
                {modelStatus === "loading" && (
                  <ActivityIndicator size="small" className="mr-2" />
                )}
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {modelStatus === "ready"
                    ? "Loaded"
                    : modelStatus === "loading"
                      ? `Loading (${Math.round(loadProgress * 100)}%)`
                      : "Not loaded"}
                </Text>
              </View>
            </View>

            {error && (
              <Text className="mb-3 text-sm text-red-500">{error}</Text>
            )}

            <View className="flex-row gap-2">
              <Pressable
                onPress={handlePickModel}
                disabled={modelStatus === "loading"}
                className={`flex-1 items-center rounded-lg py-2.5 ${
                  modelStatus === "loading"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-primary-500 active:bg-primary-600"
                }`}
                accessibilityLabel="Load model file"
              >
                <Text
                  className={`text-sm font-medium ${
                    modelStatus === "loading"
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-white"
                  }`}
                >
                  {modelStatus === "ready" ? "Change Model" : "Load Model"}
                </Text>
              </Pressable>

              {modelStatus === "ready" && (
                <Pressable
                  onPress={handleUnloadModel}
                  className="flex-1 items-center rounded-lg border border-red-300 dark:border-red-700 py-2.5 active:bg-red-50 dark:active:bg-red-900/20"
                  accessibilityLabel="Unload model"
                >
                  <Text className="text-sm font-medium text-red-500">
                    Unload
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          <Text className="mt-2 px-1 text-xs text-gray-400 dark:text-gray-500">
            Select a GGUF model file from your device. Smaller models (1-3GB)
            work best on mobile.
          </Text>
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
              Fully offline AI chat assistant powered by llama.rn
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
