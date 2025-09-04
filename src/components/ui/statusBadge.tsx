// components/ui/statusBadge.tsx - VERSÃO SIMPLIFICADA COM 3 STATUS

export interface StatusBadgeProps {
  status: "agendado" | "finalizado" | "cancelado";
}

const statusStyles: Record<StatusBadgeProps["status"], string> = {
  agendado: "bg-blue-100 text-blue-800",
  finalizado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

const statusLabels: Record<StatusBadgeProps["status"], string> = {
  agendado: "Agendado",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}
