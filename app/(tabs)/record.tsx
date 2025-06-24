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
import { BASE_URL } from "../../constant/env";
import { useTheme } from "../../constant/ThemeContext";

type RecordingData = {
  uri: string;
  id: string;
  transcript?: string;
};

export default function Record() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showCheckButton, setShowCheckButton] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

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

//   const uploadAndTranscribe = async (uri: string): Promise<boolean> => {
//     console.log("Starting upload and transcription...");
//     console.log("Recording URI:", uri);

//     const fileName = uri.split("/").pop() || "recording.m4a";
//     const formData = new FormData();
//     formData.append("file", {
//       uri,
//       name: uri.split("/").pop() || "recording.mp4",
//       type: "audio/mp4",
//     } as any);

//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 seconds timeout

//     try {
//       const response = await fetch("https://voice-memc-backend1.onrender.com/transcribe/", {
//       // const response = await fetch("http://192.168.1.109:8000/transcribe/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         body : formData,
//         signal: controller.signal,
//       });
//       clearTimeout(timeoutId);
//       const status = response.status;
//       const responseText = await response.text();

//       console.log("Response Status:", status);
//       console.log("Response Body:", responseText);
      

//       if (!response.ok) {
//         const errText = await response.text();
//         console.error("Response body:", errText);
//         throw new Error(`Transcription API failed with status: ${response.status}`);
//       }

//       const data = await response.json();
//       const existing = await AsyncStorage.getItem("recordings");
//       const recordings: RecordingData[] = existing ? JSON.parse(existing) : [];

//       const latestIndex = recordings.length - 1;
//       if (recordings[latestIndex]) {
//         recordings[latestIndex].transcript = data.transcript;
//         await AsyncStorage.setItem("recordings", JSON.stringify(recordings));
//       }

//       return true;
//     } catch (err) {
//   console.error("uploadAndTranscribe failed:", JSON.stringify(err, null, 2));
//   Alert.alert("Network Error", "Please check your connection or try again.");
//   return false;
// }

//   };
const uploadAndTranscribe = async (uri: string): Promise<boolean> => {
  console.log("Starting upload and transcription...");
  console.log("Recording URI:", uri);

  const fileName = uri.split("/").pop() || "recording.m4a";
  const formData = new FormData();

  formData.append("file", {
    uri,
    name: fileName,
    type: "audio/x-m4a", // FIXED MIME TYPE
  } as any);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000); // 20 sec timeout

  try {
    const response = await fetch(`${BASE_URL}/transcribe/`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const status = response.status;
    const responseText = await response.text();

    console.log("Response Status:", status);
    console.log("Response Body:", responseText);

    if (!response.ok) {
      throw new Error(`Backend error ${status}: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    if (!data?.transcript) {
      throw new Error("Backend responded but transcript is missing.");
    }

    const existing = await AsyncStorage.getItem("recordings");
    const recordings: RecordingData[] = existing ? JSON.parse(existing) : [];
    const latestIndex = recordings.length - 1;

    if (recordings[latestIndex]) {
      recordings[latestIndex].transcript = data.transcript;
      await AsyncStorage.setItem("recordings", JSON.stringify(recordings));
    }

    console.log("Transcription success.");
    return true;
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError") {
      console.error("❌ Transcription request timed out.");
      Alert.alert("Timeout", "The server took too long to respond. Try again.");
    } else {
      console.error("❌ uploadAndTranscribe failed:", err.message);
      Alert.alert("Upload Error", err.message);
    }

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
                setIsTranscribing(true);
                const success = await uploadAndTranscribe(latest.uri);
                setIsTranscribing(false);
                if (!success) {
                  Alert.alert(
                    "Warning",
                    "Transcription failed. Showing form without transcript."
                  );
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
