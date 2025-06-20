import { ThemeProvider } from '../constant/ThemeContext'; // Adjust path if needed
import { Stack } from 'expo-router';
import { use, useEffect } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../constant/i18n'; // Adjust path if needed

export default function RootLayout() {
  useEffect(() => {
    const loadLanguage =async () => {
      const savedLang =await AsyncStorage.getItem('appLanguage');
      if (savedLang) {
        i18n.changeLanguage(savedLang);
      }
    };
    loadLanguage();
  }, []);
 // Adjust path if needed
  return (
    <RootSiblingParent>
      <ThemeProvider >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </RootSiblingParent>
  );
}
// This layout wraps the entire app with a theme provider and sibling parent for modals or overlays.
// It uses Expo Router's Stack for navigation and hides the header by default.
// Adjust the import path for ThemeProvider based on your project structure.
// The RootSiblingParent is used to manage sibling components that may need to be rendered above the main app content, such as modals or notifications

// This layout wraps the entire app with a theme provider and sibling parent for modals or overlays.
// It uses Expo Router's Stack for navigation and hides the header by default.
// Adjust the import path for ThemeProvider based on your project structure.
// The RootSiblingParent is used to manage sibling components that may need to be rendered above the main app content, such as modals or notifications.

