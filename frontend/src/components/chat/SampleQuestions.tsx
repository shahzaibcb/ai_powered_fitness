import { Flame, Salad, Drumstick, HeartPulse } from "lucide-react";

interface SampleQuestionsProps {
  onPick: (q: string) => void;
}

const SUGGESTIONS = [
  { icon: Flame, text: "How many calories should I eat daily?" },
  { icon: Salad, text: "Best diet for weight loss?" },
  { icon: Drumstick, text: "High protein foods list" },
  { icon: HeartPulse, text: "What should I eat for better energy?" },
];

const SampleQuestions = ({ onPick }: SampleQuestionsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {SUGGESTIONS.map(({ icon: Icon, text }, i) => (
        <button
          key={text}
          onClick={() => onPick(text)}
          className="group text-left p-4 rounded-2xl border border-border/60 bg-card/40 backdrop-blur hover:bg-card/70 hover:border-primary/50 transition-smooth animate-fade-in-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-9 h-9 rounded-lg bg-gradient-bubble border border-border/60 inline-flex items-center justify-center text-primary group-hover:scale-110 transition-smooth">
              <Icon className="w-4 h-4" />
            </span>
            <span className="text-sm text-foreground/90 leading-snug pt-1">{text}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SampleQuestions;