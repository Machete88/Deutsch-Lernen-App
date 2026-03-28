// Load environment variables with proper priority (system > .env)
import "./scripts/load-env.js";
import type { ExpoConfig } from "@expo/config-types";

const config: ExpoConfig = {
  name: "DEUTSCH LERNEN",
  slug: "deutsch-lernen",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "deutschlernen",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.deutschlernen.app",
    adaptiveIcon: {
      backgroundColor: "#ffffff"
    }
  },
  plugins: ["expo-router", "expo-secure-store"],
};

export default config;
