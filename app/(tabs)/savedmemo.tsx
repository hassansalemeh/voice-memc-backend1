import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useIsFocused } from "@react-navigation/native";
import { useTheme } from "../../constant/ThemeContext";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import RecordingItem from "../../components/RecordingItem";
import colors from "../../constant/colors";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";


interface RecordingData {
  id: string;
  uri: string;
  transcript?: string;
}

export default function SavedMemo() {
  const [recordings, setRecordings] = useState<RecordingData[]>([]);
  const isFocused = useIsFocused();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const fetchRecordings = async () => {
      const data = await AsyncStorage.getItem("recordings");
      const parsed: RecordingData[] = data ? JSON.parse(data) : [];
      setRecordings(parsed);
    };
    if (isFocused) fetchRecordings();
  }, [isFocused]);

  const handleDelete = async (id: string) => {
    const updated = recordings.filter((r) => r.id !== id);
    setRecordings(updated);
    await AsyncStorage.setItem("recordings", JSON.stringify(updated));
  };
  const exportToDownloads = async (uri: string) => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        alert("Permission required to export recording.");
        return;
      }

      const filename = uri.split("/").pop();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
      alert(`Exported "${filename}" to Downloads!`);
    } catch (err) {
      console.error("Export failed", err);
      alert("Export failed. Check logs.");
    }
  };

  return (
    <View
      style={[
        styles.container,
        theme === "dark" && { backgroundColor: colors.Navy },
      ]}
    >
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: theme === "dark" ? colors.Navy : colors.WHITE,
            borderColor: theme === "dark" ? colors.BLEU_200 : "transparent",
            borderWidth: 1,
          },
        ]}
      >
        <Text
          style={[
            styles.headerText,
            { color: theme === "dark" ? colors.WHITE : "#000" },
          ]}
        >
          {t("assignedTasks")}
        </Text>
        <TouchableOpacity onPress={() => router.push("/record")}>
          <MaterialIcons
            name="add-circle"
            size={28}
            color={theme === "dark" ? colors.WHITE : colors.Navy}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
  <View style={{ marginBottom: 20 }}>
    <RecordingItem
      item={item}
      index={index}
      onDelete={handleDelete}
    />
    <TouchableOpacity
      style={{
        marginTop: 8,
        padding: 10,
        borderRadius: 8,
        backgroundColor: theme === "dark" ? "#444" : "#ddd",
        alignSelf: "flex-start",
      }}
      onPress={() => exportToDownloads(item.uri)}
    >
      <Text style={{ color: theme === "dark" ? "#fff" : "#000" }}>
        Export to Downloads
      </Text>
    </TouchableOpacity>
  </View>
)}

        ListEmptyComponent={
          <Text style={{ color: theme === "dark" ? "#aaa" : "#444" }}>
            {t("noRecordings")}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    marginBottom: 30,
    marginTop: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.Navy,
  },
});
