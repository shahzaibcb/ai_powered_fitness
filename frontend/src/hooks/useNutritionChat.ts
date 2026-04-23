import { useCallback, useState } from "react";
import { askNutritionAI, type ChatMessage } from "@/services/nutritionApi";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useNutritionChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const reply = await askNutritionAI(trimmed, [...messages, userMsg]);
        const aiMsg: ChatMessage = {
          id: uid(),
          role: "assistant",
          content: reply,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  const reset = useCallback(() => setMessages([]), []);

  return { messages, isLoading, sendMessage, reset };
}