import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAudioPlayer } from "expo-audio";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../constant/colors";
import { useTheme } from "../constant/ThemeContext";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

interface RecordingItemProps {
  item: {
    id: string;
    uri: string;
  };
  index: number;
  onDelete: (id: string) => void;
}

export default function RecordingItem({ item, index, onDelete }: RecordingItemProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const player = useAudioPlayer({ uri: item.uri });
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = async () => {
    try {
      if (!item?.uri) {
        console.warn("No URI found");
        return;
      }

      if (isPlaying) {
        await player.pause();
        setIsPlaying(false);
      } else {
        await player.seekTo(0);
        await player.play();
        setIsPlaying(true);

        // Fallback timeout for 10s if duration is unknown
        setTimeout(() => {
          setIsPlaying(false);
        }, 10000);
      }
    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  useEffect(() => {
    let interval: number | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        // If the player has a 'playing' property or similar, use it
        if (!player.playing) {
          setIsPlaying(false);
          if (interval) clearInterval(interval);
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  return (
    <View
      style={[
        styles.item,
        theme === "dark" && { backgroundColor: colors.Navy, borderColor: colors.BLEU_200 },
      ]}
    >
      <Text style={[styles.text, theme === "dark" && { color: "#fff" }]}>
        {t("recording")} {index + 1}
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={handlePlayPause}>
          {isPlaying ? (
            <FontAwesome5
              name="pause"
              size={24}
              color={theme === "dark" ? "#fff" : "black"}
            />
          ) : (
            <FontAwesome
              name="play"
              size={24}
              color={theme === "dark" ? "#fff" : "black"}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          style={{ marginLeft: 16 }}
        >
          <MaterialIcons
            name="delete"
            size={24}
            color={theme === "dark" ? "#fff" : "black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: colors.Navy,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    padding: 15,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
