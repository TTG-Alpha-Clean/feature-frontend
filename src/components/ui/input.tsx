import * as React from "react";
import { cn } from "@/lib/utils";

// No need for a separate InputProps interface; use the type directly
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  const classes =
    "flex w-full h-14 rounded-xl px-4 py-3 text-base md:text-sm " +
    "bg-[var(--filter-input-bg)] border border-[var(--filter-input-border)] " +
    "text-[var(--filter-text)] placeholder-[var(--filter-placeholder)] " +
    "focus:outline-none focus:ring-2 focus:border-[#3B82F6] " +
    "disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <input
      ref={ref}
      type={type}
      className={cn(classes, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
