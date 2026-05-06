import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import type { AppStateStatus } from "react-native";

interface UseAppStateParams {
  onForeground?: () => void;
  onBackground?: () => void;
}

export const useAppState = ({ onForeground, onBackground }: UseAppStateParams) => {
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        onForeground?.();
      }

      if (
        appStateRef.current === "active" &&
        nextState.match(/inactive|background/)
      ) {
        onBackground?.();
      }

      appStateRef.current = nextState;
    });

    return () => subscription.remove();
  }, [onForeground, onBackground]);
};
