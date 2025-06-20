import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../constant/colors";
import { useTheme } from "../constant/ThemeContext";

export default function FilledForm() {
  const router = useRouter();
  const { theme } = useTheme();
  const [userText, setUserText] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    const loadTranscript = async (): Promise<void> => {
      try {
        const data = await AsyncStorage.getItem("recordings");
        console.log("All recordings:", data);
        if (data) {
          const recordings: { transcript?: string }[] = JSON.parse(data);
          const latest = recordings[recordings.length - 1];
          console.log("Latest recording:", latest);
          if (latest.transcript) {
            setUserText(latest.transcript);
          } else {
            console.log("No transcript found");
          }
        }
      } catch (error) {
        console.error("Failed to load transcript:", error);
      }
    };

    loadTranscript();
  }, []);

  return (
    <View
      style={[styles.wrapper, theme === "dark" && { backgroundColor: colors.Navy }]}
    >
      <View
        style={[
          styles.container,
          theme === "dark" && { backgroundColor: colors.Navy,borderColor:colors.BLEU_200,borderWidth:2, },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-circle" size={34} color={theme === "dark" ? colors.BLEU_200 : colors.Navy} />
        </TouchableOpacity>

        <Text style={[styles.title, theme === "dark" && { color: "#fff" }]}>
          {t("editInstructions")}
        </Text>

        <TextInput
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={[
            styles.textInput,
            theme === "dark" && { backgroundColor: colors.Navy, color: "#fff",
              borderColor: colors.BLEU_200, borderWidth: 2
             },
          ]}
          placeholder={t("writeSomething")}
          placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
          value={userText}
          onChangeText={setUserText}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  container: {
    width: "90%",
    aspectRatio: 0.8,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 130,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color:colors.Navy
  },
  textInput: {
    width: "90%",
    height: 150,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.WHITE,
    textAlignVertical: "top",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
});
