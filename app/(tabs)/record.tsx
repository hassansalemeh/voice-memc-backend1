import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
} from "expo-audio";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import Waveform from "../../components/waveform";
import colors from "../../constant/colors";
import { useTheme } from "../../constant/ThemeContext";

type RecordingData = {
  uri: string;
  id: string;
  transcript?: string;
};

export default function Record() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showCheckButton, setShowCheckButton] = useState<boolean>(false);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert(
          "Permission required",
          "Microphone permission is required to record audio."
        );
      }
    })();
  }, []);

  const startRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      await audioRecorder.record();
      setIsRecording(true);
      setShowCheckButton(false);
    } catch (err) {
      console.error("Failed to start recording:", err);
      Alert.alert("Error", "Failed to start recording.");
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      if (!uri) throw new Error("No URI returned from recorder");

      const existing = await AsyncStorage.getItem("recordings");
      const recordings: RecordingData[] = existing ? JSON.parse(existing) : [];
      recordings.push({ uri, id: Date.now().toString() });
      await AsyncStorage.setItem("recordings", JSON.stringify(recordings));

      setIsRecording(false);
      setShowCheckButton(true);

      Toast.show(t("recordSavedToast"), {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        containerStyle: {
          backgroundColor: colors.Navy,
          borderRadius: 20,
          paddingHorizontal: 20,
          paddingVertical: 12,
        },
        textStyle: {
          color: colors.WHITE,
          fontSize: 16,
          fontWeight: "bold",
        },
      });
    } catch (err) {
      console.error("Failed to stop recording:", err);
      Alert.alert("Error", "Failed to stop recording.");
    }
  };

  const uploadAndTranscribe = async (uri: string): Promise<boolean> => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: uri.split("/").pop() || "recording.mp4",
      type: "audio/mp4",
    } as any);

    try {
      const response = await fetch("http://192.168.88.226:8000/transcribe/", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Response body:", errText);
        throw new Error(`Transcription API failed with status: ${response.status}`);
      }

      const data = await response.json();
      const existing = await AsyncStorage.getItem("recordings");
      const recordings: RecordingData[] = existing ? JSON.parse(existing) : [];

      const latestIndex = recordings.length - 1;
      if (recordings[latestIndex]) {
        recordings[latestIndex].transcript = data.transcript;
        await AsyncStorage.setItem("recordings", JSON.stringify(recordings));
      }

      return true;
    } catch (err) {
      console.error("uploadAndTranscribe failed:", err);
      return false;
    }
  };

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View
      style={[
        styles.container,
        theme === "dark" && { backgroundColor: colors.Navy },
      ]}
    >
      <View style={styles.centerBlock}>
        <Waveform isRecording={isRecording} />
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="record-circle-outline"
            size={80}
            color={isRecording ? colors.BLEU_200 : theme === "dark" ? colors.BLEU_200 : colors.Navy}
          />
        </TouchableOpacity>
        <Text style={[styles.status, theme === "dark" && { color: "#fff" }]}> 
          {isRecording ? t("recording1") : t("tapToRecord")}
        </Text>

        {showCheckButton && (
          <TouchableOpacity
            style={[
              styles.checkButton,
              { backgroundColor: theme === "dark" ? colors.BLEU_200 : colors.Navy },
            ]}
            onPress={async () => {
              const existing = await AsyncStorage.getItem("recordings");
              const recordings: RecordingData[] = existing ? JSON.parse(existing) : [];
              const latest = recordings[recordings.length - 1];

              if (!latest || !latest.uri) {
                Alert.alert("Error", "No recording found to transcribe.");
                return;
              }

              if (!latest.transcript) {
                const success = await uploadAndTranscribe(latest.uri);
                if (!success) {
                  Alert.alert("Error", "Transcription failed.");
                  return;
                }
              }

              router.push("/filledform");
            }}
          >
            <Text style={styles.checkButtonText}>{t("check_instructions")}</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.checkButton,
          { backgroundColor: theme === "dark" ? colors.BLEU_200 : colors.Navy },
        ]}
        onPress={() => router.push("/filledform")}
      >
        <Text style={styles.manualButtonText}>{t("fill_form")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  centerBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    marginTop: 20,
    fontSize: 18,
  },
  manualButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkButton: {
    marginTop: 20,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  checkButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
