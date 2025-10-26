import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CameraScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState<"picture" | "video">("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<"off" | "on" | "auto">("off");

  const router = useRouter();

  // Kiểm tra quyền
  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Đang kiểm tra quyền truy cập camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Ứng dụng cần quyền camera để hoạt động</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={{ color: "#fff" }}>Cấp quyền</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Chụp ảnh
  const handleTakePhoto = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync();
      if (photo?.uri) {
        router.push({ pathname: "/preview", params: { uri: photo.uri } });
      }
    } catch (error) {
      console.error("Lỗi chụp ảnh:", error);
      Alert.alert("Lỗi", "Không thể chụp ảnh");
    }
  };

  // Quay video
  const handleRecordVideo = async () => {
    if (!cameraRef.current) return;

    try {
      if (isRecording) {
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync({ maxDuration: 15 });
        if (video?.uri) {
          router.push({ pathname: "/preview", params: { uri: video.uri } });
        }
        setIsRecording(false);
      }
    } catch (error: any) {
      console.error("Lỗi quay video:", error);
      Alert.alert("Lỗi quay video", error?.message || "Không rõ lỗi");
      setIsRecording(false);
    }
  };

  // Lật camera
  const toggleFacing = () => setFacing(facing === "back" ? "front" : "back");

  // Đổi flash: off → on → auto
  const toggleFlash = () => {
    setFlash((prev) => (prev === "off" ? "on" : prev === "on" ? "auto" : "off"));
  };

  // Đổi mode
  const toggleMode = () => setMode(mode === "picture" ? "video" : "picture");

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={facing}
        mode={mode}
        enableTorch={flash === "on"} // flash "on" bật đèn
      />

      <View style={styles.controls}>
        {/* Lật camera */}
        <TouchableOpacity onPress={toggleFacing}>
          <Ionicons name="camera-reverse" size={32} color="white" />
        </TouchableOpacity>

        {/* Flash */}
        <TouchableOpacity onPress={toggleFlash}>
          <Ionicons
            name={
              flash === "on"
                ? "flash"
                : flash === "auto"
                ? "flash-outline"
                : "flash-off"
            }
            size={32}
            color="white"
          />
        </TouchableOpacity>

        {/* Nút chụp/quay */}
        <TouchableOpacity
          style={styles.captureButton}
          onPress={mode === "picture" ? handleTakePhoto : handleRecordVideo}
        >
          <Ionicons
            name={mode === "picture" ? "camera" : isRecording ? "stop" : "videocam"}
            size={40}
            color="#fff"
          />
        </TouchableOpacity>

        {/* Đổi mode */}
        <TouchableOpacity onPress={toggleMode}>
          <Ionicons
            name={mode === "picture" ? "videocam" : "camera"}
            size={32}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 50,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  permissionBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
});
