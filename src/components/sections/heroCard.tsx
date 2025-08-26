import { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function Card({ title, description, icon: Icon }: CardProps) {
  return (
    <div className="border border-white/20 pl-8 pr-24 py-7 rounded-xl bg-white/10 backdrop-blur-md">
      <div className="flex items-center gap-4 justify-start">
        <div className="bg-[var(--accent)] p-3 rounded-lg text-[var(--primary)] flex items-center justify-center">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-sm text-white/90">{description}</p>
        </div>
      </div>
    </div>
  );
}
