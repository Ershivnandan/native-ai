import { View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { isDark } = useTheme();

  return (
    <View className={`flex-1 ${isDark ? "dark" : ""}`}>
      {children}
    </View>
  );
};
