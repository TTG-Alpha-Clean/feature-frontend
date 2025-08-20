// src/components/lists/serviceList.tsx
"use client";

import { useState } from "react";
import {
  StatusBadge,
  type StatusBadgeProps,
} from "@/components/ui/statusBadge";
import DeleteButton from "@/components/ui/deleteButton";
import EditButton from "@/components/ui/editButton";
import { formatDatePtBr, formatHour } from "@/lib/date";
import { EditAgendamentoModal } from "@/components/modals/editAppointmentModal";
import { toast } from "react-hot-toast";

export type ServiceItem = {
  id: string;
  datetime: string | Date; // ISO
  servico: string;
  veiculo: string;
  modelo_veiculo?: string;
  cor?: string;
  placa?: string;
  data?: string; // ✅ Adicionado para quando vem separado da API
  horario?: string;
  observacoes?: string;
  status: StatusBadgeProps["status"];
};

// ✅ Tipo específico para o modal de edição
type AgendamentoEdit = {
  id: string;
  modelo_veiculo: string;
  cor: string;
  placa: string;
  servico: string;
  data: string;
  horario: string;
  observacoes: string;
  status: StatusBadgeProps["status"];
};

interface ServiceListProps {
  items: ServiceItem[];
  onRefresh?: () => void; // Função para recarregar a lista
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Função auxiliar para formatar data de forma segura
function formatDateSafe(dateInput: string | Date): string {
  try {
    if (!dateInput) return "Data inválida";

    let date: Date;

    if (typeof dateInput === "string") {
      // Se é string, tenta diferentes formatos
      if (dateInput.includes("T")) {
        // ISO format: "2025-08-20T14:30:00" ou "2025-08-20T03:00:00.000ZT14:40:00"
        let cleanDateString = dateInput;

        // ✅ Corrige se tem duplo T (erro de concatenação)
        if (dateInput.includes("ZT")) {
          cleanDateString = dateInput.split("ZT")[0] + "Z";
        } else if (dateInput.includes(".000ZT")) {
          cleanDateString = dateInput.split(".000ZT")[0] + ".000Z";
        }

        date = new Date(cleanDateString);
      } else if (dateInput.includes("-")) {
        // Date format: "2025-08-20"
        date = new Date(dateInput + "T12:00:00"); // Adiciona horário para evitar timezone issues
      } else {
        throw new Error("Formato não reconhecido");
      }
    } else {
      date = dateInput;
    }

    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      throw new Error("Data inválida");
    }

    return formatDatePtBr(date);
  } catch (error) {
    console.error("Erro ao formatar data:", error, "Input:", dateInput);
    return "Data inválida";
  }
}

// ✅ Função auxiliar para formatar hora de forma segura
function formatHourSafe(dateInput: string | Date): string {
  try {
    if (!dateInput) return "Hora inválida";

    let date: Date;

    if (typeof dateInput === "string") {
      if (dateInput.includes("T")) {
        date = new Date(dateInput);
      } else {
        // Se é só data, retorna hora padrão
        return "09:00";
      }
    } else {
      date = dateInput;
    }

    if (isNaN(date.getTime())) {
      throw new Error("Data inválida");
    }

    return formatHour(date);
  } catch (error) {
    console.error("Erro ao formatar hora:", error, dateInput);
    return "Hora inválida";
  }
}

export function ServiceList({ items, onRefresh }: ServiceListProps) {
  const [editando, setEditando] = useState<AgendamentoEdit | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);

  const handleDeleteConfirm = async (id: string) => {
    const tid = toast.loading("Cancelando agendamento...");

    try {
      // ✅ Rota correta: DELETE /:id (não /cancel)
      const res = await fetch(`${API_URL}/api/agendamentos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || "Erro ao cancelar agendamento");
      }

      toast.success("Agendamento cancelado com sucesso!", { id: tid });

      // Chama o refresh para recarregar a lista
      onRefresh?.();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao cancelar agendamento.", { id: tid });
    } finally {
      setShowDeleteDialog(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setShowDeleteDialog(id);
  };

  const handleEdit = (item: ServiceItem) => {
    // ✅ Conversão mais robusta para o formato esperado pelo modal
    let dataFormatada = "";
    let horarioFormatado = "";

    try {
      // Se item tem data e horario separados, usa eles
      if (item.data && item.horario) {
        dataFormatada = item.data;
        horarioFormatado = item.horario;
      } else if (typeof item.datetime === "string") {
        if (item.datetime.includes("T")) {
          // Formato ISO: "2025-08-20T10:15:00Z"
          const [datePart, timePart] = item.datetime.split("T");
          dataFormatada = datePart;
          horarioFormatado = timePart.slice(0, 5); // Pega apenas HH:MM
        } else {
          // Se não tem T, assume que é só data
          dataFormatada = item.datetime;
          horarioFormatado = item.horario || "09:00";
        }
      } else if (item.datetime instanceof Date) {
        // Se é objeto Date
        dataFormatada = item.datetime.toISOString().split("T")[0];
        horarioFormatado = item.datetime.toTimeString().slice(0, 5);
      } else {
        throw new Error("Formato de data não reconhecido");
      }
    } catch (error) {
      console.error("Erro ao converter data/hora:", error, item);
      // Fallback
      dataFormatada = new Date().toISOString().split("T")[0];
      horarioFormatado = "09:00";
    }

    // ✅ Agora retorna o tipo correto AgendamentoEdit
    const agendamento: AgendamentoEdit = {
      id: item.id,
      modelo_veiculo: item.modelo_veiculo || item.veiculo || "",
      cor: item.cor || "",
      placa: item.placa || "",
      servico: item.servico || "",
      data: dataFormatada,
      horario: horarioFormatado,
      observacoes: item.observacoes || "",
      status: item.status,
    };

    console.log("Dados para edição:", agendamento); // ✅ Para debug
    setEditando(agendamento);
  };

  if (!items?.length) {
    return (
      <p className="text-base text-[#6b859c]">
        Nenhum serviço encontrado para o período selecionado.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex flex-col gap-4 rounded-2xl border border-[#e6edf3] bg-white p-4 shadow-sm
                       lg:flex-row lg:items-center lg:justify-between hover:border-[#d7e6f3] transition-colors"
          >
            {/* Esquerda: infos */}
            <div className="flex flex-1 flex-col space-y-2">
              {/* Linha 1: Serviço + Status */}
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-lg font-semibold text-[#022744]">
                  {it.servico}
                </p>
                <StatusBadge status={it.status} />
              </div>

              {/* Linha 2: Data + Hora + Veículo (responsivo) */}
              <div className="flex flex-wrap items-center gap-1 text-sm text-[#597891]">
                {/* ✅ Prioriza data separada se disponível */}
                <span className="font-medium">
                  {it.data
                    ? formatDatePtBr(new Date(it.data + "T12:00:00"))
                    : formatDateSafe(it.datetime)}
                </span>
                <span className="hidden sm:inline">•</span>
                {/* ✅ Prioriza horário separado se disponível */}
                <span className="font-medium">
                  {it.horario || formatHourSafe(it.datetime)}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="font-medium">
                  <span className="sm:hidden">{it.veiculo}</span>
                  <span className="hidden sm:inline">
                    Veículo: {it.veiculo}
                  </span>
                </span>
              </div>

              {/* Linha 3: Placa (se disponível) */}
              {it.placa && (
                <div className="text-xs text-[#597891]">
                  Placa: {it.placa}
                  {it.cor && <span> • Cor: {it.cor}</span>}
                </div>
              )}
            </div>

            {/* Direita: ações */}
            <div className="flex items-center gap-2 lg:justify-end">
              {/* ✅ Botão Editar à esquerda, só aparece se status for "agendado" */}
              {it.status === "agendado" && (
                <EditButton onClick={() => handleEdit(it)} size="md" />
              )}

              {/* ✅ Botão Cancelar só aparece se status NÃO for "cancelado" */}
              {it.status !== "cancelado" && it.status !== "finalizado" && (
                <DeleteButton onClick={() => handleDeleteClick(it.id)} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Dialog de confirmação customizado */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-[var(--card-bg)] p-6 shadow-xl border border-[var(--card-border)]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                Cancelar Agendamento
              </h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Tem certeza que deseja cancelar este agendamento? Esta ação não
                pode ser desfeita.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(null)}
                className="px-4 py-2 rounded-lg border border-[var(--card-border)] text-[var(--foreground)] transition-all hover:bg-[var(--muted)]"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteConfirm(showDeleteDialog)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium transition-all hover:bg-red-700"
              >
                Sim, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {editando && (
        <EditAgendamentoModal
          agendamento={editando}
          onClose={() => setEditando(null)}
          onUpdated={() => {
            setEditando(null);
            onRefresh?.(); // Recarrega a lista após edição
          }}
        />
      )}
    </>
  );
}
