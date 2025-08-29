import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent";
  icon?: React.ReactNode;
};

export default function Button({
  children,
  variant = "primary",
  icon,
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex cursor-pointer items-center justify-center gap-2 font-semibold rounded-xl px-10 py-2 transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-[var(--background)] disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 focus-visible:ring-[var(--primary)]",
    accent:
      "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 focus-visible:ring-[var(--accent)]",
  } as const;

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
