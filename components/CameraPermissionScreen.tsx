import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraPermissionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cloudinary info
  const CLOUD_NAME = "dcmtkk2mw"; 
  const UPLOAD_PRESET = "Session20"; 

  // Nếu đang kiểm tra quyền
  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Đang kiểm tra quyền camera...</Text>
      </View>
    );
  }

  // Nếu chưa có quyền
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Yêu cầu quyền Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Hàm chụp ảnh
  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể chụp ảnh: " + (error as Error).message);
      }
    }
  };

  // Hàm upload ảnh lên Cloudinary
  const handleUploadToCloudinary = async () => {
    if (!photoUri) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: photoUri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ secure_url:", response.data.secure_url);
      Alert.alert("Upload thành công!", "Ảnh của bạn đã được tải lên Cloudinary.", [
        {
          text: "OK",
          onPress: () => setPhotoUri(null), // Quay lại màn hình chụp ảnh
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Upload thất bại!", "Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!photoUri ? (
        <>
          <CameraView ref={cameraRef} style={styles.camera} />
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleTakePhoto}
          >
            <Ionicons name="camera" size={36} color="#fff" />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />

          {loading && (
            <ActivityIndicator size="small" color="#00ffcc" style={{ marginVertical: 20 }} />
          )}
          <View style={styles.previewButtons}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#d54731ff" }]}
              onPress={() => setPhotoUri(null)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Chụp lại</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#2d83c9ff", opacity: loading ? 0.6 : 1 },
              ]}
              onPress={handleUploadToCloudinary}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Đang upload..." : "Tiếp tục"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1},
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#007bff",
    padding: 18,
    borderRadius: 50,
    elevation: 5,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  previewImage: {
    width: "90%",
    height: "70%",
    borderRadius: 10,
  },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 30,
  },
});
