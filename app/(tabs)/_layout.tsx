import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import colors from "../../constant/colors";
import { useTheme } from "../../constant/ThemeContext";
import { useTranslation } from "react-i18next";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

export default function TabLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme === "dark" ? "#121212" : "#fff",
      }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme === "dark" ? colors.Navy : colors.WHITE,
            borderTopWidth: 0,
          },
          tabBarActiveTintColor:
            theme === "dark" ? colors.BLEU_200 : colors.Navy,
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
          name="record"
          options={{
            tabBarLabel: t("record"),
            tabBarIcon: ({
              color,
              size,
            }: {
              color: string;
              size: number;
              focused: boolean;
            }) => <FontAwesome name="microphone" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="savedmemo"
          options={{
            tabBarLabel: t("savedRecords"),
            tabBarIcon: ({
              color,
              size,
            }: {
              color: string;
              size: number;
              focused: boolean;
            }) => <MaterialIcons name="storage" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: t("settings"),
            tabBarIcon: ({
              color,
              size,
            }: {
              color: string;
              size: number;
              focused: boolean;
            }) => <Feather name="settings" size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
