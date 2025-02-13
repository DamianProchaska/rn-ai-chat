import { useState } from "react";
import EventSource from "react-native-sse";

interface SSEOptions {
  headers?: Record<string, any>;
  method?: string;
  body?: string;
  withCredentials?: boolean;
}

export function useChatStreamPost() {
  const [partialResponse, setPartialResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let es: EventSource | null = null;

  const streamChatGPT = async (prompt: string, imageBase64?: string) => {
    setIsLoading(true);
    setPartialResponse("");

    const url = "https://ai-chat-api-production.up.railway.app/api/openai/chat";

    const contentArray: any[] = [{ type: "text", text: prompt }];

    if (imageBase64) {
      contentArray.push({
        type: "image_url",
        image_url: {
          url: `data:image/jpeg;base64,${imageBase64}`,
          detail: "high",
        },
      });
    }

    const bodyPayload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: contentArray,
        },
      ],
      stream: true,
    };

    const options: SSEOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
      withCredentials: false,
    };

    es = new EventSource(url, options);

    es.addEventListener("open", () => {
      console.log("SSE connection opened");
    });

    es.addEventListener("message", (event) => {
      try {
        if (event.data === "[DONE]") {
          cleanup();
          return;
        }
        const parsed = JSON.parse(event.data || "");
        const content = parsed.content || "";
        if (content) {
          setPartialResponse((prev) => prev + content);
        }
      } catch (err) {
        console.log("SSE parse error:", err);
      }
    });

    es.addEventListener("end", cleanup);

    es.addEventListener("error", (event) => {
      if (event.type === "error") {
        console.error("Connection error:", event.message);
      } else if (event.type === "exception") {
        console.error("Exception:", event.message, event.error);
      }
      cleanup();
    });
  };

  const cleanup = () => {
    setIsLoading(false);
    if (es) {
      es.close();
      es = null;
    }
  };

  return { partialResponse, isLoading, streamChatGPT };
}
