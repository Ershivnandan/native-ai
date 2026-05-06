import "../global.css";

import { useEffect, useCallback, useState } from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as SplashScreen from "expo-splash-screen";
import { store, persistor } from "@/store";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { LoadingScreen } from "@/components/common/LoadingScreen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  const onBeforeLift = useCallback(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <Provider store={store}>
      <PersistGate
        loading={<LoadingScreen message="Restoring data..." />}
        persistor={persistor}
        onBeforeLift={onBeforeLift}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <ThemeProvider>
              <StatusBar style="auto" />
              <Slot />
            </ThemeProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
