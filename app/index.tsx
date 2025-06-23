// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/(tabs)/record" />;
}
// This file serves as the entry point for the app, redirecting users to the "/(tabs)/record" route.
// It uses Expo Router's Redirect component to navigate to the specified route.