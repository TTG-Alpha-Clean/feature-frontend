// components/StatusBadge.tsx
export interface StatusBadgeProps {
  status: "agendado" | "em_andamento" | "finalizado" | "cancelado";
}

const statusStyles: Record<StatusBadgeProps["status"], string> = {
  agendado: "bg-blue-100 text-blue-800",
  em_andamento: "bg-yellow-100 text-yellow-800",
  finalizado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${statusStyles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
