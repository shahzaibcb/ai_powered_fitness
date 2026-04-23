import { User } from "lucide-react";
import AiAvatar from "./AiAvatar";
import type { ChatMessage as ChatMessageType } from "@/services/nutritionApi";

interface ChatMessageProps {
  message: ChatMessageType;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Lightweight markdown-ish renderer (bold + bullet lists + line breaks)
function renderContent(text: string) {
  const lines = text.split("\n");
  const out: JSX.Element[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: number) => {
    if (listBuffer.length === 0) return;
    out.push(
      <ul key={`ul-${key}`} className="list-disc pl-5 space-y-1 my-2">
        {listBuffer.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line, i) => {
    const bullet = line.match(/^\s*[-*]\s+(.*)/);
    const numbered = line.match(/^\s*\d+\.\s+(.*)/);
    if (bullet) {
      listBuffer.push(bullet[1]);
    } else if (numbered) {
      listBuffer.push(numbered[1]);
    } else {
      flushList(i);
      if (line.trim() === "") {
        out.push(<div key={`br-${i}`} className="h-2" />);
      } else {
        out.push(
          <p key={`p-${i}`} className="leading-relaxed">
            {renderInline(line)}
          </p>
        );
      }
    }
  });
  flushList(lines.length);
  return out;
}

function renderInline(text: string): (string | JSX.Element)[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} className="text-muted-foreground">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full gap-3 animate-fade-in-up ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <AiAvatar className="w-9 h-9" />}

      <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm sm:text-[15px] border transition-smooth ${
            isUser
              ? "bg-gradient-primary text-primary-foreground border-transparent rounded-br-md shadow-elegant"
              : "bg-card/70 backdrop-blur text-card-foreground border-border/60 rounded-bl-md"
          }`}
        >
          {isUser ? (
            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="space-y-1">{renderContent(message.content)}</div>
          )}
        </div>
        <span className="text-[11px] text-muted-foreground px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>

      {isUser && (
        <div className="shrink-0 w-9 h-9 rounded-xl bg-secondary border border-border/60 inline-flex items-center justify-center text-secondary-foreground">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;