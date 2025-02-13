import { useState } from "react";
import { Audio } from "expo-av";

export function useSpeechToText() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [currentMetering, setCurrentMetering] = useState(-160);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        throw new Error("Brak uprawnień do mikrofonu.");
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);

      recording.setProgressUpdateInterval(200);
      recording.setOnRecordingStatusUpdate((status) => {
        if (typeof (status as any).metering === "number") {
          setCurrentMetering((status as any).metering);
        } else {
          setCurrentMetering((prev) => {
            const newVal = prev + (Math.random() * 20 - 10);
            return Math.max(Math.min(newVal, 0), -60);
          });
        }
      });
    } catch (error) {
      console.error("Błąd startRecording:", error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setRecording(null);
      setCurrentMetering(-160);

      if (uri) {
        const text = await sendAudioForTranscription(uri);
        setTranscription(text);
      }
    } catch (error) {
      console.error("Błąd stopRecording:", error);
    }
  };

  const sendAudioForTranscription = async (uri: string): Promise<string> => {
    try {
      const url = "https://ai-chat-api-production.up.railway.app/api/openai/speech";
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "recording.m4a",
        type: "audio/mp4",
      } as any);

      const resp = await fetch(url, { method: "POST", body: formData });
      if (!resp.ok) {
        const errText = await resp.text();
        console.error("Błąd transkrypcji:", errText);
        return "";
      }
      const data = await resp.json();
      return data.text;
    } catch (error) {
      console.error("Transkrypcja nie powiodła się:", error);
      return "";
    }
  };

  return { isRecording, transcription, currentMetering, startRecording, stopRecording };
}
