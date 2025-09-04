// components/ui/statusBadge.tsx - VERSÃO CORRIGIDA
export interface StatusBadgeProps {
  status: "agendado" | "em_andamento" | "finalizado" | "cancelado";
}

const statusStyles: Record<StatusBadgeProps["status"], string> = {
  agendado: "bg-blue-100 text-blue-800",
  em_andamento: "bg-yellow-100 text-yellow-800",
  finalizado: "bg-green-100 text-green-800", // ✅ Status correto
  cancelado: "bg-red-100 text-red-800",
};

const statusLabels: Record<StatusBadgeProps["status"], string> = {
  agendado: "Agendado",
  em_andamento: "Em Andamento",
  finalizado: "Finalizado", // ✅ Label correta
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
