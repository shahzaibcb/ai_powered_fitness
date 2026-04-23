// Nutrition AI service — talks to a FastAPI backend.
// Endpoint contract:
//   POST {API_BASE_URL}/chat
//   request:  { "message": "user input" }
//   response: { "reply":   "AI response" }

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
}

// Base URL of the FastAPI backend.
// Configure via Vite env var: VITE_API_BASE_URL (e.g. "http://localhost:8000").
// Falls back to same-origin "" so a reverse proxy / dev proxy can forward /chat.
const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
}

export async function askNutritionAI(
  prompt: string,
  _history: ChatMessage[] = [],
  options: { signal?: AbortSignal } = {}
): Promise<string> {
  const payload: ChatRequest = { message: prompt };

  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    signal: options.signal,
  });

  if (!res.ok) {
    let detail = "";
    try {
      const errBody = await res.json();
      detail = errBody?.detail ?? errBody?.message ?? "";
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(
      `Chat API error ${res.status}${detail ? `: ${detail}` : ""}`
    );
  }

  const data = (await res.json()) as Partial<ChatResponse>;
  if (typeof data.reply !== "string") {
    throw new Error("Invalid response: missing 'reply' string");
  }
  return data.reply;
}