"use client";

import {
  StatusBadge,
  type StatusBadgeProps,
} from "@/components/ui/statusBadge";
import DeleteButton from "@/components/ui/deleteButton";
import EditButton from "@/components/ui/editButton";
import { formatDatePtBr, formatHour } from "@/lib/date";

export type ServiceItem = {
  id: string;
  datetime: string | Date; // ISO
  servico: string;
  veiculo: string;
  status: StatusBadgeProps["status"];
};

export function ServiceList({
  items,
  onDelete,
  onEdit,
}: {
  items: ServiceItem[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  if (!items?.length) {
    return (
      <p className="text-base text-[#6b859c]">
        Nenhum serviço encontrado para o período selecionado.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((it) => (
        <div
          key={it.id}
          className="flex flex-col gap-4 rounded-2xl border border-[#e6edf3] bg-white p-5 shadow-sm
                     sm:flex-row sm:items-center sm:justify-between hover:border-[#d7e6f3] transition-colors"
        >
          {/* Esquerda: infos */}
          <div className="flex flex-1 flex-col">
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#597891]">
              {/* Data | Hora */}
              <span className="font-medium">{formatDatePtBr(it.datetime)}</span>
              <span>•</span>
              <span className="font-medium">{formatHour(it.datetime)}</span>
              <span>•</span>
              <span className="font-medium">Veículo: {it.veiculo}</span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <p className="text-lg font-semibold text-[#022744]">
                {it.servico}
              </p>
              <StatusBadge status={it.status} />
            </div>
          </div>

          {/* Direita: ações */}
          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <DeleteButton onClick={() => onDelete(it.id)} />
            {it.status === "agendado" && (
              <EditButton onClick={() => onEdit(it.id)} size="md" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
