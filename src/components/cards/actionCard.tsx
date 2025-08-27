import { Plus, Phone, MapPin } from "lucide-react";
import type { ComponentProps } from "react";

const icons = { Plus, Phone, MapPin } as const;

export type ActionCardProps = {
  iconName: keyof typeof icons;
  title: string;
  subtitle: string;
  ctaLabel: string;
  variant?: "solid" | "outline";
  onClick?: () => void;
} & ComponentProps<"div">;

export function ActionCard({
  iconName,
  title,
  subtitle,
  ctaLabel,
  variant = "solid",
  onClick,
  className,
}: ActionCardProps) {
  const Icon = icons[iconName];
  const isSolid = variant === "solid";
  return (
    <div
      className={`rounded-3xl border border-[#e6edf3] bg-white p-6 shadow-sm ${
        className ?? ""
      }`}
    >
      <div
        className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{
          background: isSolid ? "#eaf7c4" : "#f2f8ff",
          color: "#9BD60C",
        }}
        aria-hidden
      >
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-center text-lg font-semibold">{title}</h3>
      <p className="mb-5 mt-1 text-center text-sm text-[#4b647d]">{subtitle}</p>
      <button
        onClick={onClick}
        className={
          "w-full rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 cursor-pointer focus:ring-offset-2 " +
          (isSolid
            ? "bg-[#022744] text-white hover:opacity-95 focus:ring-[#022744]"
            : "border border-[#cfe3f2] text-[#022744] hover:bg-[#f7fbff] focus:ring-[#9BD60C]")
        }
      >
        {ctaLabel}
      </button>
    </div>
  );
}
