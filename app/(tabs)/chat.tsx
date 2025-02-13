import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, FlatList, Platform, KeyboardAvoidingView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { SlideInUp, Layout } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";

import { ChatBubble } from "../../components/ChatBubble";
import { ChatInput, ChatAttachment } from "../../components/ChatInput";
import { useChatStreamPost } from "../../hooks/useChatStream";
import { useSpeechToText } from "../../hooks/useSpeechToText";
import { AnimatedTypingDots } from "@/components/AnimatedTypingDots";
import { RecordingBar } from "@/components/RecordingBar";

export interface ChatMessage {
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

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [attachment, setAttachment] = useState<ChatAttachment | null>(null);
  const [isRecordingMode, setIsRecordingMode] = useState(false);

  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const { partialResponse, isLoading, streamChatGPT } = useChatStreamPost();
  const { isRecording, transcription, currentMetering, startRecording, stopRecording } =
    useSpeechToText();

  useEffect(() => {
    setMessages((prev) => {
      const lastAssistantIndex = prev
        .map((msg, idx) => (msg.role === "assistant" ? idx : -1))
        .filter((i) => i !== -1)
        .pop();

      if (lastAssistantIndex !== undefined && lastAssistantIndex >= 0) {
        const updated = [...prev];
        updated[lastAssistantIndex] = {
          ...updated[lastAssistantIndex],
          text: partialResponse,
        };
        return updated;
      }
      return prev;
    });
  }, [partialResponse]);

  useEffect(() => {
    if (transcription) {
      setInputText((prev) => prev + " " + transcription);
      setIsRecordingMode(false);
    }
  }, [transcription]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() && !attachment) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: inputText,
    };

    let base64Data: string | undefined;

    if (attachment) {
      if (attachment.type === "image") {
        try {
          let normalizedUri = attachment.uri;
          if (Platform.OS === "ios" && normalizedUri.startsWith("file://")) {
            normalizedUri = normalizedUri.replace("file://", "");
          }
          base64Data = await FileSystem.readAsStringAsync(normalizedUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        } catch (err) {
          console.log("Błąd odczytu obrazu w Base64:", err);
        }
        userMsg.imageUri = attachment.uri;
      } else {
        userMsg.file = {
          uri: attachment.uri,
          name: attachment.name || "",
          type: attachment.mimeType || "",
        };
      }
    }

    let assistantPlaceholder: ChatMessage | null = null;
    if (base64Data || inputText.trim()) {
      assistantPlaceholder = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "",
      };
    }

    if (assistantPlaceholder) {
      setMessages((prev) => [...prev, userMsg, assistantPlaceholder!]);
    } else {
      setMessages((prev) => [...prev, userMsg]);
    }

    setInputText("");
    setAttachment(null);

    if (base64Data || inputText.trim()) {
      await streamChatGPT(inputText, base64Data);
    }

    scrollToEnd();
  };

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <Animated.View entering={SlideInUp.delay(50)} layout={Layout.springify()}>
      <ChatBubble message={item} />
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={["#0a0a0a", "#121212", "#1a1a1a"]}
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatlistContent}
          onContentSizeChange={scrollToEnd}
        />

        {isLoading && (
          <View style={styles.typingContainer}>
            <AnimatedTypingDots />
          </View>
        )}

        {isRecordingMode ? (
          <RecordingBar
            isRecording={isRecording}
            currentMetering={currentMetering}
            onStop={async () => {
              await stopRecording();
              setIsRecordingMode(false);
            }}
          />
        ) : (
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            attachment={attachment}
            setAttachment={setAttachment}
            onSend={handleSend}
            onPickImageError={(msg) => Alert.alert("Błąd obrazu", msg)}
            onPickFileError={(msg) => Alert.alert("Błąd pliku", msg)}
            onStartRecording={async () => {
              setIsRecordingMode(true);
              await startRecording();
            }}
          />
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  flatlistContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  typingContainer: {
    alignItems: "flex-start",
    marginLeft: 16,
    marginVertical: 8,
  },
});
