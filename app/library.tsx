import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import React from "react";

export default function LibraryPickerScreen() {
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      router.push({ pathname: "/preview", params: { uri: result.assets[0].uri } });
    }
  };

  return (
    <View style={styles.center}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.text}>Chọn ảnh từ thư viện</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: { backgroundColor: "#28a745", padding: 14, borderRadius: 10 },
  text: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
