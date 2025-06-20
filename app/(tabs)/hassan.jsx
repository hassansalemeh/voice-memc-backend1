// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Audio } from "expo-av";
// import colors from "../../constant/colors";
// import { useIsFocused } from "@react-navigation/native";
// import { useEffect, useRef, useState } from "react";
// import { useRouter } from 'expo-router';
// import { useTheme } from "../../constant/ThemeContext";
// import { useTranslation } from 'react-i18next';

// import {
//   Alert,
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function SavedMemo() {
//   const [recordings, setRecordings] = useState([]);
//   const [playingId, setPlayingId] = useState(null);
//   const [isPaused, setIsPaused] = useState(false);
//   const soundRef = useRef(null);
//   const isFocused = useIsFocused();
//   const router = useRouter();
//   const {theme} = useTheme();
//   const { t, i18n } = useTranslation();

//   useEffect(() => {
//     const loadRecordings = async () => {
//       const data = await AsyncStorage.getItem("recordings");
//       setRecordings(data ? JSON.parse(data) : []);
//     };
//     if (isFocused){
//       loadRecordings();
//     }
//     loadRecordings();
//   }, [isFocused]);

//   const playRecording = async (item) => {
//     try {
//       if (soundRef.current) {
//         await soundRef.current.unloadAsync();
//         soundRef.current = null;
//       }
//       const { sound } = await Audio.Sound.createAsync({ uri: item.uri });
//       soundRef.current = sound;
//       setPlayingId(item.id);
//       setIsPaused(false);
//       await sound.playAsync();
//       sound.setOnPlaybackStatusUpdate((status) => {
//         if (status.didJustFinish) {
//           setPlayingId(null);
//         }
//       });
//     } catch (err) {
//       Alert.alert("Error", "Failed to play recording.");
//     }
//   };

//   const pauseRecording = async () => {
//     if (soundRef.current) {
//       await soundRef.current.pauseAsync();
//       setIsPaused(true);
//     }
//   };

//   const resumeRecording = async () => {
//     if (soundRef.current) {
//       await soundRef.current.playAsync();
//       setIsPaused(false);
//     }
//   };

//   const deleteRecording = async (id) => {
//     const newRecordings = recordings.filter((r) => r.id !== id);
//     setRecordings(newRecordings);
//     await AsyncStorage.setItem("recordings", JSON.stringify(newRecordings));
//     if (playingId === id && soundRef.current) {
//       await soundRef.current.unloadAsync();
//       soundRef.current = null;
//       setPlayingId(null);
//     }
//   };

//   const renderItem = ({ item, index }) => (
//     <View style={styles.item}>
//       <Text style={styles.text}>{t("recording")} {index + 1}</Text>
//       <View style={styles.buttons}>
//         {playingId === item.id && !isPaused ? (
//           <TouchableOpacity onPress={pauseRecording}>
//             <FontAwesome5 name="pause" size={24} color="black" />
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             onPress={() =>
//               playingId === item.id && isPaused
//                 ? resumeRecording()
//                 : playRecording(item)
//             }
//           >
//             <FontAwesome name="play" size={24} color="black" />
//           </TouchableOpacity>
//         )}
//         <TouchableOpacity
//           onPress={() => deleteRecording(item.id)}
//           style={{ marginLeft: 16 }}
//         >
//           <MaterialIcons name="delete" size={24} color="black" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={[
//       styles.container,
//       theme === 'dark' && { backgroundColor: '#222' }
//     ]}>
//       <View style={[
//         styles.headerContainer,
//         theme === 'dark' && { backgroundColor: '#333' }
//       ]}>
//         <Text style={[
//           styles.headerText,
//           theme === 'dark' && { color: '#fff' }
//         ]}>{t("assignedTasks")}</Text>
//         <TouchableOpacity onPress={() => router.push('/record')}>
//           <MaterialIcons name="add-circle" size={28} color={colors.PRIMARY} />
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={recordings}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item, index }) => (
//           <View style={[
//             styles.item,
//             theme === 'dark' && { backgroundColor: '#333', borderColor: '#555' }
//           ]}>
//             <Text style={[
//               styles.text,
//               theme === 'dark' && { color: '#fff' }
//             ]}>{t("recording")} {index + 1}</Text>
//             <View style={styles.buttons}>
//               {playingId === item.id && !isPaused ? (
//                 <TouchableOpacity onPress={pauseRecording}>
//                   <FontAwesome5 name="pause" size={24} color={theme === 'dark' ? "#fff" : "black"} />
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity
//                   onPress={() =>
//                     playingId === item.id && isPaused
//                       ? resumeRecording()
//                       : playRecording(item)
//                   }
//                 >
//                   <FontAwesome name="play" size={24} color={theme === 'dark' ? "#fff" : "black"} />
//                 </TouchableOpacity>
//               )}
//               <TouchableOpacity
//                 onPress={() => deleteRecording(item.id)}
//                 style={{ marginLeft: 16 }}
//               >
//                 <MaterialIcons name="delete" size={24} color={theme === 'dark' ? "#fff" : "black"} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//         ListEmptyComponent={
//           <Text style={[
//             styles.empty,
//             theme === 'dark' && { color: '#aaa' }
//           ]}>{t("noRecordings")}</Text>
//         }
//       />
//     </View>
//   );

// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 29,
//     backgroundColor: "white",
//   },
//   item: {
//     borderWidth:1,
//     borderColor:colors.PRIMARY,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 16,
//     padding: 15,
//     backgroundColor: colors.WHITE,
//     borderRadius: 12,
//     elevation: 3,
//   },
//   text: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//   },
//   buttons: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   iconButton: {
//     backgroundColor: "#4B0082",
//     padding: 10,
//     borderRadius: 30,
//   },
//   headerContainer: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   paddingHorizontal: 16,
//   paddingVertical: 12,
//   backgroundColor: 'white',
//   borderRadius: 12,
//   marginBottom: 30,
//   marginTop: 20,
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.1,
//   shadowRadius: 4,
//   elevation: 3,
// },
// headerText: {
//   fontSize: 20,
//   fontWeight: 'bold',
//   color: '#333',
// },

// });


