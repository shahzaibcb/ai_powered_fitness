import { Leaf } from "lucide-react";

interface AiAvatarProps {
  className?: string;
  glow?: boolean;
}

const AiAvatar = ({ className = "", glow = false }: AiAvatarProps) => {
  return (
    <div
      className={`shrink-0 inline-flex items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground ${
        glow ? "shadow-glow animate-pulse-glow" : ""
      } ${className}`}
      aria-hidden
    >
      <Leaf className="w-1/2 h-1/2" strokeWidth={2.4} />
    </div>
  );
};

export default AiAvatar;