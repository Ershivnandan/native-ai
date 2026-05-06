import { useCallback, useMemo } from "react";
import { useColorScheme } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTheme, selectTheme } from "@/store/settingsSlice";
import type { ThemeMode } from "@/types/settings";

interface UseThemeReturn {
  themeMode: ThemeMode;
  isDark: boolean;
  effectiveTheme: "light" | "dark";
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useTheme = (): UseThemeReturn => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectTheme);
  const systemColorScheme = useColorScheme();

  const effectiveTheme = useMemo(() => {
    if (themeMode === "system") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  const isDark = effectiveTheme === "dark";

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemeMode = isDark ? "light" : "dark";
    dispatch(setTheme(nextTheme));
  }, [dispatch, isDark]);

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      dispatch(setTheme(mode));
    },
    [dispatch],
  );

  return {
    themeMode,
    isDark,
    effectiveTheme,
    toggleTheme,
    setThemeMode,
  };
};
