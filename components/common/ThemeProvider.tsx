import { useEffect } from "react";
import { colorScheme } from "nativewind";
import { useTheme } from "@/hooks/useTheme";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { themeMode } = useTheme();

  useEffect(() => {
    colorScheme.set(themeMode);
  }, [themeMode]);

  return <>{children}</>;
};
