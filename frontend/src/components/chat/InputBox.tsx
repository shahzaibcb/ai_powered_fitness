import { ArrowUp } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef } from "react";

interface InputBoxProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  size?: "sm" | "lg";
}

const InputBox = ({
  value,
  onChange,
  onSubmit,
  disabled,
  autoFocus,
  placeholder = "Ask about calories, diets, foods…",
  size = "sm",
}: InputBoxProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  // Auto-grow textarea
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSubmit();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!disabled && value.trim()) onSubmit();
  };

  const isLarge = size === "lg";

  return (
    <form
      onSubmit={handleSubmit}
      className={`group relative w-full rounded-3xl border border-border/70 bg-card/70 backdrop-blur-xl shadow-elegant transition-smooth focus-within:border-primary/60 focus-within:shadow-glow ${
        isLarge ? "p-2.5" : "p-2"
      }`}
    >
      <div className="flex items-end gap-2">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder={placeholder}
          className={`flex-1 resize-none bg-transparent outline-none placeholder:text-muted-foreground text-foreground ${
            isLarge ? "px-4 py-3 text-base" : "px-3 py-2.5 text-sm"
          } disabled:opacity-60`}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className={`shrink-0 inline-flex items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground transition-smooth hover:scale-105 hover:shadow-glow disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none ${
            isLarge ? "w-12 h-12" : "w-10 h-10"
          }`}
        >
          <ArrowUp className={isLarge ? "w-5 h-5" : "w-4 h-4"} strokeWidth={2.5} />
        </button>
      </div>
      <p className="hidden sm:block text-[11px] text-muted-foreground/80 px-3 pb-1 pt-0.5">
        Press <kbd className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/60 text-[10px]">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/60 text-[10px]">Shift + Enter</kbd> for newline
      </p>
    </form>
  );
};

export default InputBox;