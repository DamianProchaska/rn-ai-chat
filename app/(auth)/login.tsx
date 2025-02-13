import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "expo-router";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Colors } from "../../constants/Colors";

export default function LoginScreen() {
    const [email, setEmail] = useState("test@example.com");
    const [password, setPassword] = useState("password123");

    const login = useAuthStore((state) => state.login);
    const router = useRouter();
    const colorScheme = useColorScheme();

    const handleLogin = async () => {
        const success = await login(email, password);
        if (success) {
            router.replace("/(tabs)/chat");
        } else {
            Alert.alert("Błąd", "Niepoprawne dane logowania!");
        }
    };

    return (
        <LinearGradient
            colors={["#141414", "#1c1c1c", "#242424"]}
            style={styles.gradientContainer}
        >
            <KeyboardAvoidingView
                style={styles.centerContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
            >
                <Text style={styles.title}>Zaloguj się</Text>

                <View style={[styles.inputWrapper, styles.shadow]}>
                    <Ionicons
                        name="mail"
                        size={18}
                        color={Colors[colorScheme].tabIconDefault}
                        style={styles.icon}
                    />
                    <TextInput
                        style={[styles.input, { color: Colors[colorScheme].text }]}
                        placeholder="Email"
                        placeholderTextColor={Colors[colorScheme].tabIconDefault}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={[styles.inputWrapper, styles.shadow]}>
                    <Ionicons
                        name="lock-closed"
                        size={18}
                        color={Colors[colorScheme].tabIconDefault}
                        style={styles.icon}
                    />
                    <TextInput
                        style={[styles.input, { color: Colors[colorScheme].text }]}
                        placeholder="Hasło"
                        placeholderTextColor={Colors[colorScheme].tabIconDefault}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    activeOpacity={0.8}
                    style={[styles.button, styles.shadow]}
                >
                    <Text style={styles.buttonText}>Zaloguj</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 40,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
        width: "100%",
    },
    icon: {
        marginRight: 6,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 4,
    },
    button: {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        width: "100%",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
    },
});
