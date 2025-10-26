import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ChooseModeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn cách thêm ảnh</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007bff" }]}
        onPress={() => router.push("/camera")}
      >
        <Text style={styles.text}>📷 Chụp ảnh</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#28a745" }]}
        onPress={() => router.push("/library")}
      >
        <Text style={styles.text}>🖼️ Chọn từ thư viện</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 40 },
  button: { padding: 16, width: "70%", borderRadius: 10, marginVertical: 10 },
  text: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600" },
});
