import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { useAuthStore } from "../../store/useAuthStore";
import { ToastMessage } from "../../components/ToastMessage";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [toastMessage, setToastMessage] = useState("");

  const isModified =
    name !== (user?.name || "") ||
    email !== (user?.email || "") ||
    profileImage !== (user?.profileImage || "");

  if (!user) {
    return (
      <LinearGradient colors={["#141414", "#1c1c1c", "#242424"]} style={styles.gradientContainer}>
        <View style={styles.centerWrapper}>
          <Text style={{ color: "#fff" }}>Brak danych użytkownika.</Text>
        </View>
      </LinearGradient>
    );
  }

  const handlePickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    updateProfile({
      ...user,
      name,
      email,
      profileImage,
    });
    setToastMessage("Zmiany zapisane pomyślnie!");
  };

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <LinearGradient colors={["#141414", "#1c1c1c", "#242424"]} style={styles.gradientContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Profil użytkownika</Text>

        <View style={styles.profileSection}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: "#333" }]} />
          )}
          <TouchableOpacity style={styles.pickImageBtn} onPress={handlePickProfileImage}>
            <Ionicons name="image-outline" size={20} color="#fff" />
            <Text style={styles.pickImageBtnText}>Wybierz zdjęcie</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#777"
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Imię (nick):</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor="#777"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              isModified ? styles.saveButtonEnabled : styles.saveButtonDisabled,
            ]}
            disabled={!isModified}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Zapisz</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: "#cc3333" }]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Wyloguj</Text>
          </TouchableOpacity>
        </View>
      </View>

      {toastMessage !== "" && (
        <ToastMessage message={toastMessage} duration={3000} onClose={() => setToastMessage("")} />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 10,
  },
  pickImageBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3c3c3c",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  pickImageBtnText: {
    color: "#fff",
    marginLeft: 6,
  },
  formRow: {
    marginBottom: 15,
  },
  label: {
    color: "#fff",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#2c2c2c",
    borderRadius: 6,
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonContainer: {
    marginTop: 30,
    gap: 10,
  },
  button: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  saveButtonEnabled: {
    backgroundColor: "#277047",
  },
  saveButtonDisabled: {
    backgroundColor: "#555",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
