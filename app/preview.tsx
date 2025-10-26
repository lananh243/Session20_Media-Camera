import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImageManipulator from "expo-image-manipulator";

export default function PreviewScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const CLOUD_NAME = "dcmtkk2mw";
  const UPLOAD_PRESET = "Session20";

  const handleUpload = async () => {
    if (!uri) {
      Alert.alert("Lỗi", "Không tìm thấy file để upload.");
      return;
    }

    setLoading(true);
    try {
      const fileType = uri.split(".").pop()?.toLowerCase();
      const isVideo = fileType === "mp4" || fileType === "mov";
      let uploadUri = uri;

      // Nếu là ảnh, nén và resize trước khi upload
      if (!isVideo) {
        const manipulated = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 1080 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        uploadUri = manipulated.uri;
      }

      const formData = new FormData();
      formData.append("file", {
        uri: uploadUri,
        type: isVideo ? `video/${fileType}` : `image/${fileType}`,
        name: `upload.${fileType}`,
      } as any);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      Alert.alert("Thành công", "File đã được tải lên Cloudinary!");

      router.back();
    } catch (error: any) {
      console.error("Upload lỗi:", error.response?.data || error.message);
      Alert.alert("Lỗi upload", "Không thể tải lên Cloudinary!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} resizeMode="contain" />
      {loading && <ActivityIndicator color="#00ffcc" style={{ marginVertical: 20 }} />}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#d54731" }]}
          onPress={() => router.back()}
        >
          <Text style={styles.text}>Quay lại</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#2d83c9" }]}
          onPress={handleUpload}
          disabled={loading}
        >
          <Text style={styles.text}>
            {loading ? "Đang upload..." : "Tải lên Cloudinary"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  image: { width: "90%", height: "70%", borderRadius: 12 },
  buttons: { flexDirection: "row", marginTop: 30, gap: 20 },
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  text: { color: "#fff", fontWeight: "600" },
});
