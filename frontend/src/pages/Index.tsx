import { useEffect, useRef, useState } from "react";
import { Apple, Sparkles, RotateCcw } from "lucide-react";
import AiAvatar from "@/components/chat/AiAvatar";
import ChatMessage from "@/components/chat/ChatMessage";
import InputBox from "@/components/chat/InputBox";
import SampleQuestions from "@/components/chat/SampleQuestions";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { useNutritionChat } from "@/hooks/useNutritionChat";

const Index = () => {
  const { messages, isLoading, sendMessage, reset } = useNutritionChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasChat = messages.length > 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handlePick = (q: string) => {
    setInput(q);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-hero" aria-hidden />
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-blob" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-primary-glow/15 blur-3xl animate-blob" style={{ animationDelay: "3s" }} aria-hidden />

      <div className="relative flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/60 border-b border-border/60">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
            <div className="flex items-center gap-2.5">
              <AiAvatar className="w-9 h-9" glow />
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-tight">NutriAI</p>
                <p className="text-[11px] text-muted-foreground">Your AI Nutrition Coach</p>
              </div>
            </div>
            {hasChat && (
              <button
                onClick={() => {
                  reset();
                  setInput("");
                }}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border/60 bg-card/40 hover:bg-card/70 hover:border-primary/40 transition-smooth text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                New chat
              </button>
            )}
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col">
          {!hasChat ? (
            // Landing / Empty state
            <section className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
              <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center gap-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-card/40 backdrop-blur text-xs text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Powered by AI · Personalized for you
                </div>

                <div className="relative">
                  <div className="absolute inset-0 -z-10 blur-3xl bg-gradient-primary opacity-30 rounded-full" />
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-primary inline-flex items-center justify-center text-primary-foreground shadow-glow animate-pulse-glow">
                    <Apple className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={2.2} />
                  </div>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
                    Your <span className="text-gradient">AI Nutrition</span> Coach
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Ask anything about diet, calories, weight loss, and healthy eating 🍎
                  </p>
                </div>

                <div className="w-full">
                  <InputBox
                    value={input}
                    onChange={setInput}
                    onSubmit={handleSend}
                    disabled={isLoading}
                    autoFocus
                    size="lg"
                    placeholder="Ask about calories, diets, foods…"
                  />
                </div>

                <div className="w-full pt-2">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    Try asking
                  </p>
                  <SampleQuestions onPick={handlePick} />
                </div>
              </div>
            </section>
          ) : (
            // Chat view
            <section className="flex-1 flex flex-col">
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
              >
                <div className="max-w-3xl mx-auto flex flex-col gap-5 pb-32">
                  {messages.map((m) => (
                    <ChatMessage key={m.id} message={m} />
                  ))}

                  {isLoading && (
                    <div className="flex items-end gap-3 animate-fade-in-up">
                      <AiAvatar className="w-9 h-9" />
                      <TypingIndicator />
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed bottom input */}
              <div className="sticky bottom-0 left-0 right-0 px-4 sm:px-6 pb-4 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent">
                <div className="max-w-3xl mx-auto">
                  <InputBox
                    value={input}
                    onChange={setInput}
                    onSubmit={handleSend}
                    disabled={isLoading}
                    autoFocus
                  />
                  <p className="text-center text-[11px] text-muted-foreground/70 mt-2">
                    NutriAI can make mistakes. Verify important info with a professional.
                  </p>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
