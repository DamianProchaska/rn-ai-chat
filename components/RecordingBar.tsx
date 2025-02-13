import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VoiceVisualizer } from "./VoiceVisualizer";

interface RecordingBarProps {
    isRecording: boolean;
    currentMetering: number;
    onStop: () => void;
}

export function RecordingBar({
    isRecording,
    currentMetering,
    onStop,
}: RecordingBarProps) {
    return (
        <View style={styles.recordingContainer}>
            <View style={styles.leftPlaceholder} />

            <View style={styles.centerContainer}>
                {isRecording && (
                    <View style={styles.waveContainer}>
                        <VoiceVisualizer amplitudeDb={currentMetering} barsCount={7} />
                    </View>
                )}
            </View>

            <TouchableOpacity onPress={onStop} style={styles.stopButton}>
                <Ionicons name="stop-circle" size={32} color="#f44" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    recordingContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        backgroundColor: "#2e2e2e",
    },
    leftPlaceholder: {
        width: 50,
    },
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    waveContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    recordingText: {
        fontSize: 16,
        color: "#fff",
    },
    stopButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
});
