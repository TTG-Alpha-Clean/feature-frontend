// src/components/lists/serviceList.tsx - VERSÃO CORRIGIDA COM FUNÇÃO DE CANCELAMENTO

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
import { Car, X } from "lucide-react";

export type ServiceItem = {
  id: string;
  datetime: string | Date;
  servico: string;
  veiculo: string;
  modelo_veiculo?: string;
  cor?: string;
  placa?: string;
  data?: string;
  horario?: string;
  observacoes?: string;
  status: StatusBadgeProps["status"];
};

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
  onRefresh?: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function formatDateSafe(dateInput: string | Date): string {
  try {
    if (!dateInput) return "Data inválida";

    let date: Date;

    if (typeof dateInput === "string") {
      if (dateInput.includes("T")) {
        let cleanDateString = dateInput;
        if (dateInput.includes("ZT")) {
          cleanDateString = dateInput.split("ZT")[0] + "Z";
        } else if (dateInput.includes(".000ZT")) {
          cleanDateString = dateInput.split(".000ZT")[0] + ".000Z";
        }
        date = new Date(cleanDateString);
      } else if (dateInput.includes("-")) {
        date = new Date(dateInput + "T12:00:00");
      } else {
        throw new Error("Formato não reconhecido");
      }
    } else {
      date = dateInput;
    }

    if (isNaN(date.getTime())) {
      throw new Error("Data inválida");
    }

    return formatDatePtBr(date);
  } catch (error) {
    console.error("Erro ao formatar data:", error, "Input:", dateInput);
    return "Data inválida";
  }
}

function formatHourSafe(dateInput: string | Date): string {
  try {
    if (!dateInput) return "Hora inválida";

    let date: Date;

    if (typeof dateInput === "string") {
      if (dateInput.includes("T")) {
        date = new Date(dateInput);
      } else {
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
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [editando, setEditando] = useState<AgendamentoEdit | null>(null);
  const [loading, setLoading] = useState(false);

  // Função específica para cancelar agendamentos "agendado"
  const handleCancelAgendamento = async (id: string) => {
    setLoading(true);
    const tid = toast.loading("Cancelando agendamento...");

    console.log("CANCELANDO AGENDAMENTO ID:", id);

    try {
      const res = await fetch(
        `http://localhost:3001/api/agendamentos/${id}/cancel`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      console.log("Resposta do servidor:", res.status, res.statusText);

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        console.log("Erro do servidor:", error);
        throw new Error(error?.error || "Erro ao cancelar agendamento");
      }

      toast.success("Agendamento cancelado com sucesso!", { id: tid });
      onRefresh?.();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Erro no cancelamento:", err);
        toast.error(err.message || "Erro ao cancelar agendamento", { id: tid });
      } else {
        console.error("Erro no cancelamento:", err);
        toast.error("Erro ao cancelar agendamento", { id: tid });
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir agendamentos "cancelado"
  const handleDeleteConfirm = async (id: string) => {
    setLoading(true);
    const tid = toast.loading("Excluindo agendamento...");

    try {
      const res = await fetch(`http://localhost:3001/api/agendamentos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || "Erro ao excluir agendamento");
      }

      toast.success("Agendamento excluído com sucesso!", { id: tid });
      onRefresh?.();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Erro ao excluir agendamento.", {
          id: tid,
        });
      } else {
        toast.error("Erro ao excluir agendamento.", { id: tid });
      }
    } finally {
      setLoading(false);
      setShowDeleteDialog(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setShowDeleteDialog(id);
  };

  const handleEdit = (item: ServiceItem) => {
    let dataFormatada = "";
    let horarioFormatado = "";

    try {
      if (item.data && item.horario) {
        dataFormatada = item.data;
        horarioFormatado = item.horario;
      } else if (typeof item.datetime === "string") {
        if (item.datetime.includes("T")) {
          const [datePart, timePart] = item.datetime.split("T");
          dataFormatada = datePart;
          horarioFormatado = timePart.slice(0, 5);
        } else {
          dataFormatada = item.datetime;
          horarioFormatado = item.horario || "09:00";
        }
      } else if (item.datetime instanceof Date) {
        dataFormatada = item.datetime.toISOString().split("T")[0];
        horarioFormatado = item.datetime.toTimeString().slice(0, 5);
      } else {
        throw new Error("Formato de data não reconhecido");
      }
    } catch (error) {
      console.error("Erro ao converter data/hora:", error, item);
      dataFormatada = new Date().toISOString().split("T")[0];
      horarioFormatado = "09:00";
    }

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

    setEditando(agendamento);
  };

  if (!items?.length) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <p className="text-gray-600 text-lg">
          Nenhum serviço encontrado para o período selecionado.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden
                       hover:shadow-xl transition-all duration-200 transform hover:scale-[1.01]"
          >
            {/* Header com gradiente cinza */}
            <div className="bg-gray-300 px-4 sm:px-6 py-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-white">
                    {item.servico}
                  </h3>
                  <div className="backdrop-blur-sm rounded-lg px-2 py-1">
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                {/* Ações baseadas no status */}
                <div className="flex items-center gap-2">
                  {/* Editar - apenas para agendados */}
                  {item.status === "agendado" && (
                    <EditButton onClick={() => handleEdit(item)} />
                  )}

                  {/* Cancelar - apenas para agendados */}
                  {item.status === "agendado" && (
                    <button
                      onClick={() => handleCancelAgendamento(item.id)}
                      disabled={loading}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      <X className="h-3 w-3" />
                      Cancelar
                    </button>
                  )}

                  {/* Excluir - apenas para cancelados */}
                  {item.status === "cancelado" && (
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      disabled={loading}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      <X className="h-3 w-3" />
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data e Horário */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      📅
                    </div>
                    <span className="font-semibold text-gray-700">
                      Agendamento
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="font-medium">
                      {item.data
                        ? formatDatePtBr(new Date(item.data + "T12:00:00"))
                        : formatDateSafe(item.datetime)}
                    </p>
                    <p>{item.horario || formatHourSafe(item.datetime)}</p>
                  </div>
                </div>

                {/* Veículo */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Car size={16} className="text-purple-600" />
                    </div>
                    <span className="font-semibold text-gray-700">Veículo</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">
                      {item.modelo_veiculo || item.veiculo}
                    </p>
                    {item.placa && <p>Placa: {item.placa}</p>}
                    {item.cor && <p>Cor: {item.cor}</p>}
                  </div>
                </div>
              </div>

              {/* Observações */}
              {item.observacoes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      📝
                    </div>
                    <span className="font-semibold text-gray-700">
                      Observações
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{item.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dialog de confirmação para exclusão (apenas cancelados) */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gray-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                Excluir Agendamento
              </h3>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir permanentemente este agendamento?
                Esta ação não pode ser desfeita e removerá todos os dados do
                sistema.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteDialog(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 
                           rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteConfirm(showDeleteDialog)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                           transition-colors font-medium"
                >
                  Sim, excluir
                </button>
              </div>
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
            onRefresh?.();
          }}
        />
      )}
    </>
  );
}
