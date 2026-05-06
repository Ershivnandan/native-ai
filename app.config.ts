import { ExpoConfig, ConfigContext } from "expo/config";

const IS_STAGING = process.env.APP_ENV === "staging";

const getAppName = () => {
  if (IS_STAGING) return "Native AI (Staging)";
  return "Native AI";
};

const getAppIcon = () => {
  if (IS_STAGING) return "./assets/AppIcon-badged.png";
  return "./assets/AppIcon.png";
};

const getBundleId = () => {
  if (IS_STAGING) return "com.nativeai.app.staging";
  return "com.nativeai.app";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "native-ai",
  version: "1.0.0",
  orientation: "portrait",
  icon: getAppIcon(),
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  scheme: IS_STAGING ? "nativeai-staging" : "nativeai",
  splash: {
    image: "./assets/SplashIcon.png",
    resizeMode: "contain",
    backgroundColor: "#0f0f1a",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: getBundleId(),
  },
  android: {
    adaptiveIcon: {
      foregroundImage: getAppIcon(),
      backgroundColor: "#0f0f1a",
    },
    edgeToEdgeEnabled: true,
    package: getBundleId(),
  },
  web: {
    favicon: "./assets/AppIcon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    "expo-web-browser",
    "expo-splash-screen",
    "expo-document-picker",
  ],
  extra: {
    appEnv: process.env.APP_ENV ?? "production",
    router: {},
    eas: {
      projectId: "36a8fa6d-5690-4cce-b241-7a2dcf0714f3",
    },
  },
  owner: "shivnandansoni",
});
