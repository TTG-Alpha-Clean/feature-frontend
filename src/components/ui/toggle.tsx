"use client";

import { cn } from "@/lib/utils"; // helper pra juntar classes (se não tiver, usa só template string)

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  activeColor?: string; // ex: "bg-[#9BD60C]"
  inactiveColor?: string; // ex: "bg-gray-400"
}

export function Toggle({
  checked,
  onChange,
  label,
  activeColor = "bg-[#9BD60C]",
  inactiveColor = "bg-gray-400",
}: ToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "w-11 h-6 flex items-center rounded-full px-1 transition-colors duration-300",
          checked ? activeColor : inactiveColor
        )}
      >
        <div
          className={cn(
            "w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
