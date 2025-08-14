import { cn } from "@/lib/utils";

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function DeleteButton({ onClick, disabled }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label="Excluir"
      title="Excluir"
      className={cn(
        "group relative p-2 bg-transparent border-none cursor-pointer transition-transform duration-200 ease-in-out",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <svg
        className={cn(
          "w-7 h-7 lg:w-8 lg:h-8",
          "transition-transform duration-[300ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] overflow-visible",
          "group-hover:scale-[1.08] group-hover:rotate-[3deg]",
          "group-active:scale-[0.96] group-active:rotate-[-1deg]"
        )}
        viewBox="0 -10 64 74"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="trash-can">
          <rect
            x="16"
            y="24"
            width="32"
            height="30"
            rx="3"
            ry="3"
            fill="#e74c3c"
          ></rect>

          <g
            id="lid-group"
            className="transition-transform duration-[300ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-[12px_18px] group-hover:rotate-[-28deg] group-hover:translate-y-[2px] group-active:rotate-[-12deg] group-active:scale-[0.98]"
          >
            <rect
              x="12"
              y="12"
              width="40"
              height="6"
              rx="2"
              ry="2"
              fill="#c0392b"
            ></rect>
            <rect
              x="26"
              y="8"
              width="12"
              height="4"
              rx="2"
              ry="2"
              fill="#c0392b"
            ></rect>
          </g>
        </g>
      </svg>
    </button>
  );
}
