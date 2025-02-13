import React from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

export type ChatAttachment = {
    type: "image" | "file";
    uri: string;
    name?: string;
    mimeType?: string;
};

interface ChatInputProps {
    inputText: string;
    setInputText: (val: string) => void;
    attachment: ChatAttachment | null;
    setAttachment: (val: ChatAttachment | null) => void;
    onSend: () => void;
    onPickImageError: (msg: string) => void;
    onPickFileError: (msg: string) => void;
    onStartRecording: () => void;
}

export function ChatInput({
    inputText,
    setInputText,
    attachment,
    setAttachment,
    onSend,
    onPickImageError,
    onPickFileError,
    onStartRecording,
}: ChatInputProps) {
    const handlePickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: false,
            });
            if (!result.canceled && result.assets?.length) {
                setAttachment({
                    type: "image",
                    uri: result.assets[0].uri,
                });
            }
        } catch (error) {
            onPickImageError(String(error));
        }
    };

    const handlePickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets?.length) {
                const file = result.assets[0];
                const supportedTypes = [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "text/",
                ];
                const isSupported = supportedTypes.some((t) =>
                    file.mimeType?.startsWith(t)
                );
                if (!isSupported) {
                    onPickFileError("Wybrany format pliku nie jest obsługiwany.");
                    return;
                }

                setAttachment({
                    type: "file",
                    uri: file.uri,
                    name: file.name || "unknown",
                    mimeType: file.mimeType || "",
                });
            }
        } catch (error) {
            onPickFileError(String(error));
        }
    };

    return (
        <View style={styles.container}>
            {/* Pole tekstowe - bez wyróżnionego osobnego tła, multiline */}
            <TextInput
                style={styles.input}
                multiline
                placeholder="Napisz wiadomość..."
                placeholderTextColor="#777"
                value={inputText}
                onChangeText={setInputText}
            />

            {/* Podgląd załącznika (jeśli istnieje) */}
            {attachment && (
                <View style={styles.attachmentPreview}>
                    {attachment.type === "image" ? (
                        <View style={styles.imageAttachmentContainer}>
                            <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
                            <TouchableOpacity
                                onPress={() => setAttachment(null)}
                                style={styles.removeAttachmentButton}
                            >
                                <Ionicons name="close-circle" size={24} color="#f44" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.fileAttachmentContainer}>
                            <Ionicons name="document-text" size={24} color="#bbb" />
                            <Text style={styles.fileName} numberOfLines={1}>
                                {attachment.name}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setAttachment(null)}
                                style={styles.removeAttachmentButton}
                            >
                                <Ionicons name="close-circle" size={24} color="#f44" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {/* Pasek ikon na dole (zdjęcie, plik - po lewej; mikrofon, wyślij - po prawej) */}
            <View style={styles.actionRow}>
                <View style={styles.leftIconsContainer}>
                    <TouchableOpacity onPress={handlePickImage} style={styles.iconButton}>
                        <Ionicons name="image" size={24} color="#bbb" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePickFile} style={styles.iconButton}>
                        <Ionicons name="document-attach" size={24} color="#bbb" />
                    </TouchableOpacity>
                </View>
                <View style={styles.rightIconsContainer}>
                    <TouchableOpacity onPress={onStartRecording} style={styles.iconButton}>
                        <Ionicons name="mic" size={24} color="#bbb" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onSend} style={styles.sendButton}>
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1E1E1E",
        // Zaokrąglone górne rogi
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,

        // Opcjonalnie, aby "unosiło się" nad tłem
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,

        padding: 16,
    },
    input: {
        color: "#fff",
        fontSize: 16,
        padding: 0,
        margin: 0,
        minHeight: 50,
        maxHeight: 120, // dzięki temu przy bardzo długich wiadomościach input nie rozciąga się w nieskończoność
        textAlignVertical: "top",
    },
    attachmentPreview: {
        marginVertical: 8,
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#2c2c2c",
    },
    imageAttachmentContainer: {
        position: "relative",
        width: 80,
        height: 80,
    },
    attachmentImage: {
        width: "100%",
        height: "100%",
        borderRadius: 4,
    },
    removeAttachmentButton: {
        position: "absolute",
        top: -6,
        right: -6,
    },
    fileAttachmentContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    fileName: {
        color: "#fff",
        marginLeft: 8,
        maxWidth: 200,
    },
    actionRow: {
        flexDirection: "row",
        marginTop: 8,
        justifyContent: "space-between",
    },
    leftIconsContainer: {
        flexDirection: "row",
    },
    rightIconsContainer: {
        flexDirection: "row",
    },
    iconButton: {
        padding: 6,
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: "#277047",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
});
