import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    text?: string;
    imageUri?: string;
    file?: {
        uri: string;
        name: string;
        type: string;
    };
}

interface Props {
    message: ChatMessage;
}

export function ChatBubble({ message }: Props) {
    const isUser = message.role === "user";

    const userGradient = ["#EBEBEB", "#D5D5D5"];
    const assistantGradient = ["#3F3F3F", "#292929"];
    return (
        <View
            style={[
                styles.container,
                isUser ? styles.userContainer : styles.assistantContainer,
            ]}
        >
            <LinearGradient
                colors={isUser ? userGradient : assistantGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.assistantBubble,
                ]}
            >
                {message.imageUri && (
                    <Image source={{ uri: message.imageUri }} style={styles.messageImage} />
                )}

                {message.file && (
                    <View style={styles.fileContainer}>
                        <Ionicons name="document-text" size={20} color="#EEE" />
                        <Text
                            style={[
                                styles.fileName,
                                isUser ? styles.userTextColor : styles.assistantTextColor,
                            ]}
                            numberOfLines={1}
                        >
                            {message.file.name}
                        </Text>
                    </View>
                )}

                {!!message.text && (
                    <Text
                        style={[
                            styles.messageText,
                            isUser ? styles.userTextColor : styles.assistantTextColor,
                        ]}
                    >
                        {message.text}
                    </Text>
                )}

                <View
                    style={[
                        styles.bubbleTail,
                        isUser ? styles.userTail : styles.assistantTail,
                    ]}
                >
                    <LinearGradient
                        colors={isUser ? userGradient : assistantGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.tailGradient}
                    />
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        maxWidth: "80%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    userContainer: {
        alignSelf: "flex-end",
    },
    assistantContainer: {
        alignSelf: "flex-start",
    },

    bubble: {
        padding: 12,
        borderRadius: 16,
        position: "relative",
    },
    userBubble: {
        borderTopRightRadius: 0,
    },
    assistantBubble: {
        borderTopLeftRadius: 0,
    },

    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userTextColor: {
        color: "#1A202C",
    },
    assistantTextColor: {
        color: "#F7FAFC",
    },

    messageImage: {
        width: 180,
        height: 180,
        marginBottom: 8,
        borderRadius: 8,
        alignSelf: "center",
    },

    fileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    fileName: {
        marginLeft: 8,
        fontSize: 15,
        maxWidth: 130,
    },

    bubbleTail: {
        position: "absolute",
        bottom: 0,
        width: 14,
        height: 14,
        overflow: "hidden",
    },
    userTail: {
        right: -7,
    },
    assistantTail: {
        left: -7,
    },
    tailGradient: {
        width: 20,
        height: 20,
        transform: [{ rotate: "45deg" }],
        marginTop: -3,
        marginLeft: -3,
    },
});
