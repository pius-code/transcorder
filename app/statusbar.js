// statusBar.js
import { StatusBar, Style } from "@capacitor/status-bar";
import { NavigationBar } from "@capgo/capacitor-navigation-bar";

export const initializeStatusBar = async (isDarkMode) => {
  try {
    if (isDarkMode) {
      await StatusBar.setBackgroundColor({ color: "#030008" });
      await StatusBar.setStyle({ style: Style.Dark });
      await NavigationBar.setColor({ color: "#cb1717", darkButtons: false });
    } else {
      await StatusBar.setBackgroundColor({ color: "#f2eeee" });
      await StatusBar.setStyle({ style: Style.Light });
      await NavigationBar.setColor({ color: "#078a53", darkButtons: true });
    }
  } catch (error) {
    console.error("Error setting status bar:", error);
  }
};
