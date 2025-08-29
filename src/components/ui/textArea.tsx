import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  const base =
    "flex w-full min-h-[120px] rounded-xl px-4 py-3 text-base md:text-sm resize-none " +
    "bg-[var(--card-bg)] border text-[var(--foreground)] placeholder-[color:var(--muted-foreground)] " +
    "border-[var(--card-border)] outline-none " +
    "focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] " +
    "disabled:cursor-not-allowed disabled:opacity-50";
  return <textarea ref={ref} className={cn(base, className)} {...props} />;
});
Textarea.displayName = "Textarea";
