import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PermissionScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const router = useRouter();

  const requestPermissions = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    const micStatus = await Camera.requestMicrophonePermissionsAsync(); 
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus.granted && micStatus.granted && mediaStatus.granted) {
      setHasPermission(true);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <TouchableOpacity style={styles.button} onPress={requestPermissions}>
          <Text style={styles.text}>Cấp quyền truy cập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007bff" }]}
        onPress={() => router.push("/camera")}
      >
        <Text style={styles.text}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: { backgroundColor: "#2d83c9ff", padding: 14, borderRadius: 10 },
  text: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
