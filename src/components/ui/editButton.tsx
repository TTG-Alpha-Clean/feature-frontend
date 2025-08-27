interface EditButtonProps {
  onClick?: () => void;
  title?: string;
  size?: "sm" | "md" | "lg"; // tamanho do ícone
  disabled?: boolean; // Adicionado suporte a disabled
}

export default function EditButton({
  onClick,
  title = "Editar item",
  size = "md",
  disabled = false, // Valor padrão
}: EditButtonProps) {
  const sizeClasses = {
    sm: "w-4 h-4 lg:w-5 lg:h-5",
    md: "w-6 h-6 lg:w-8 lg:h-8",
    lg: "w-8 h-8 lg:w-10 lg:h-10",
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={title}
      title={title}
      className={`
        group p-2 bg-transparent border-none cursor-pointer transition-transform duration-200 ease-in-out
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`
          ${sizeClasses[size]}
          text-blue-500
          transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]
          ${
            disabled
              ? ""
              : "group-hover:rotate-[-15deg] group-hover:scale-110 group-active:rotate-[-5deg] group-active:scale-95"
          }
        `}
      >
        <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25z" />
        <path
          d="M20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
          className="fill-blue-700"
        />
      </svg>
    </button>
  );
}
