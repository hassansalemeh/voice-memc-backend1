// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Audio } from "expo-av";
// import { useState,useRef, use } from "react";
// import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import Waveform from "../../components/waveform";
// import Toast from 'react-native-root-toast';
// import colors from "../../constant/colors";
// import { useTheme } from "../../constant/ThemeContext";
// import { useTranslation } from 'react-i18next';
// import { useRouter } from "expo-router";

// export default function Record() {
//   const [recording, setRecording] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const{theme,toggleTheme} = useTheme();
//   const router = useRouter();
//   const [showCheckButton, setShowCheckButton] = useState(false);
//   const { t, i18n } = useTranslation();

//   const startRecording = async () => {
//     try {
//       console.log("Requesting permissions...");
//       const { status } = await Audio.requestPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission required",
//           "Microphone permission is required to record audio."
//         );
//         return;
//       }

//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       console.log("Starting recording...");
//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//       );
//       setRecording(recording);
//       setIsRecording(true);
//       setShowCheckButton(false);
//       console.log("Recording started");
//     } catch (err) {
//       console.error("Failed to start recording", err);
//       Alert.alert("Error", "Failed to start recording.");
//     }
//     // Start timer

//   };

//   const stopRecording = async () => {
//     try {
//       if (!recording) return;
//       console.log("Stopping recording...");
//       await recording.stopAndUnloadAsync();
//       setIsRecording(false);

//       const uri = recording.getURI();
//       setRecording(null);
//       setShowCheckButton(true);

//       // Save to AsyncStorage
//       const existing = await AsyncStorage.getItem("recordings");
//       const recordings = existing ? JSON.parse(existing) : [];
//       recordings.push({ uri, id: Date.now().toString() });
//       await AsyncStorage.setItem("recordings", JSON.stringify(recordings));
//       console.log("Recording stopped and saved");
//       setShowCheckButton(true);
//       Toast.show(t("recordSavedToast"), {
//         duration: Toast.durations.SHORT,
//         position: Toast.positions.TOP,
//         containerStyle: {
//         backgroundColor: colors.PRIMARY, // Use primary color from constants
//         borderRadius: 20,
//         paddingHorizontal: 20,
//         paddingVertical: 12,
//       },
//         textStyle: {
//         color: '#ffffff', // White text
//         fontSize: 16,
//         fontWeight: 'bold',
//       },
//       });

//     } catch (err) {
//       console.error("Failed to stop recording", err);
//       Alert.alert("Error", "Failed to stop recording.");
//     }
//     // Stop timer
//   };

//   const handlePress = () => {
//     if (isRecording) {
//       stopRecording();
//     } else {
//       startRecording();
//     }
//   };

//   return (
//   <View style={[
//     styles.container,
//     theme === 'dark' && { backgroundColor: '#222' }
//   ]}>
//     <View style={styles.centerBlock}>
//       <Waveform isRecording={isRecording} />
//       <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
//         <MaterialCommunityIcons
//           name="record-circle-outline"
//           size={80}
//           color={isRecording ? "red" : theme === 'dark' ? '#E0E0E0' : "black"}
//         />
//       </TouchableOpacity>
//       <Text style={[
//         styles.status,
//         theme === 'dark' && { color: '#fff' }
//       ]}>
//         {isRecording ? t("recording1") : t("tapToRecord")}
//       </Text>
//       {/* 2️⃣ New button appears only after stopping recording */}
//     {showCheckButton && (
//       <TouchableOpacity
//         style={styles.checkButton}
//         onPress={() => router.push("/filledform")}
//       >
//         <Text style={styles.checkButtonText}>{t("check_instructions")}</Text>
//       </TouchableOpacity>
//     )}
//     </View>

//     {/* 1️⃣ Always visible button */}
//     <TouchableOpacity
//       style={styles.manualButton}
//       onPress={() => router.push("/filledform")}
//     >
//       <Text style={styles.manualButtonText}>{t("fill_form")}</Text>
//     </TouchableOpacity>
//   </View>
// );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor:"white"
//   },
//   centerBlock: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   status: {
//     marginTop: 20,
//     fontSize: 18,
//   },
//   manualButton: {
//   padding: 16,
//   backgroundColor: colors.PRIMARY,
//   alignItems: 'center',
//   justifyContent: 'center',
//   margin: 16,
//   borderRadius: 8,
// },
// manualButtonText: {
//   color: 'white',
//   fontSize: 16,
//   fontWeight: 'bold',
// },
// checkButton: {
//   marginTop: 20,
//   padding: 16,
//   backgroundColor: colors.PRIMARY,
//   alignItems: 'center',
//   justifyContent: 'center',
//   marginHorizontal: 16,
//   marginBottom: 16,
//   borderRadius: 8,
// },
// checkButtonText: {
//   color: 'white',
//   fontSize: 16,
//   fontWeight: 'bold',
// },
// });

