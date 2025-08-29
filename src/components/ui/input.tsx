import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  const base =
    "flex w-full h-14 rounded-xl px-4 py-3 text-base md:text-sm " +
    "bg-[var(--card-bg)] border text-[var(--foreground)] placeholder-[color:var(--muted-foreground)] " +
    "border-[var(--card-border)] outline-none " +
    "focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] " +
    "disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <input ref={ref} type={type} className={cn(base, className)} {...props} />
  );
});
Input.displayName = "Input";
