import { LucideIcon } from "lucide-react";

interface AboutCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function AboutCard({
  title,
  description,
  icon: Icon,
}: AboutCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 border border-gray-200 rounded-xl py-8 shadow-xl w-full bg-white">
      <div>
        <Icon size={36} color="#9bd60c" />
      </div>
      <div>
        <h4 className="font-bold text-[var(--primary)] mb-1 text-sm sm:text-base text-center">
          {title}
        </h4>
        <p className="text-[var(--muted-foreground)] text-xs sm:text-sm text-center">
          {description}
        </p>
      </div>
    </div>
  );
}
