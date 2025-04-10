import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.recording.app",
  appName: "transcorder",
  webDir: "out",
  plugins: {
    NavigationBar: {
      color: "#ffffff", // Background color of the navigation bar
      darkButtons: true, // If true, sets dark buttons on the navigation bar
    },
  },
};

export default config;
