import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import colors from "../../constant/colors";
import { useTheme } from "../../constant/ThemeContext";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

interface Language {
  code: string;
  name: string;
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [languageModalVisible, setLanguageModalVisible] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const { t, i18n } = useTranslation();

  const languages: Language[] = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "ar", name: "Arabic" },
    { code: "de", name: "Deutsch" },
  ];

  const handleThemeToggle = (): void => {
    Alert.alert(
      t("switchThemeTitle"),
      t("switchThemeMessage", {
        mode: theme === "dark" ? t("lightMode") : t("darkMode"),
      }),
      [
        {
          text: t("no"),
          style: "cancel",
        },
        {
          text: t("yes"),
          onPress: toggleTheme,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View
      style={[styles.container, theme === "dark" && { backgroundColor: colors.Navy }]}
    >
      <Text style={[styles.title, theme === "dark" && { color: colors.BLEU_200 }]}>
        {t("settings")}
      </Text>

      <TouchableOpacity style={styles.option} onPress={handleThemeToggle}>
        <MaterialIcons
          name="dark-mode"
          size={24}
          color={theme === "dark" ? colors.BLEU_200 : colors.Navy}
        />
        <Text style={[styles.optionText, theme === "dark" && { color: colors.WHITE }]}> 
          {t("theme")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          Alert.alert(t("changeLanguageTitle"), t("changeLanguageMessage"), [
            { text: t("no"), style: "cancel" },
            {
              text: t("yes"),
              onPress: () => setLanguageModalVisible(true),
            },
          ]);
        }}
      >
        <Ionicons
          name="language"
          size={24}
          color={theme === "dark" ? colors.BLEU_200 : colors.Navy}
        />
        <Text style={[styles.optionText, theme === "dark" && { color: "#fff" }]}> 
          {t("language")}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: theme === "dark" ? "#222" : "#fff",
              padding: 24,
              borderRadius: 16,
              width: "85%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
                color: theme === "dark" ? "#fff" : "#222",
              }}
            >
              {t("selectLanguage")}
            </Text>
            <TextInput
              placeholder="Search language..."
              placeholderTextColor={theme === "dark" ? "#aaa" : "#888"}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 8,
                marginBottom: 12,
                color: theme === "dark" ? "#fff" : "#222",
              }}
              value={search}
              onChangeText={setSearch}
            />
            <FlatList
              data={languages.filter((l) =>
                l.name.toLowerCase().includes(search.toLowerCase())
              )}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderColor: "#eee",
                  }}
                  onPress={async () => {
                    setSelectedLanguage(item);
                    setLanguageModalVisible(false);
                    i18n.changeLanguage(item.code);
                    await AsyncStorage.setItem("appLanguage", item.code);
                    Alert.alert(
                      t("languageChangedTitle"),
                      t("languageChangedMessage", { language: item.name })
                    );
                  }}
                >
                  <Text style={{ color: theme === "dark" ? "#fff" : "#222" }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 200 }}
            />
            <TouchableOpacity
              onPress={() => setLanguageModalVisible(false)}
              style={{ marginTop: 16, alignSelf: "flex-end" }}
            >
              <Text style={{ color: colors.PRIMARY, fontWeight: "bold" }}>
                {t("cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 25,
    color: colors.Navy,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

