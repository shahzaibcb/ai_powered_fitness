const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-card/60 border border-border/60 w-fit">
      <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: "300ms" }} />
    </div>
  );
};

export default TypingIndicator;