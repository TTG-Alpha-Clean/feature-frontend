// src/components/lists/adminServiceList.tsx - VERSÃO COMPLETA CORRIGIDA

"use client";

import { useState } from "react";
import {
  StatusBadge,
  type StatusBadgeProps,
} from "@/components/ui/statusBadge";
import { formatDatePtBr, formatHour } from "@/lib/date";
import { toast } from "react-hot-toast";
import { User, Car, Phone, Check, X } from "lucide-react";

export type AdminServiceItem = {
  id: string;
  datetime: string | Date;
  servico: string;
  veiculo: string;
  modelo_veiculo?: string;
  cor?: string;
  placa?: string;
  data: string;
  horario: string;
  observacoes?: string;
  status: StatusBadgeProps["status"];
  valor?: number | string | null;
  cliente: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
  };
  created_at?: string;
  updated_at?: string;
};

interface AdminServiceListProps {
  items: AdminServiceItem[];
  onRefresh?: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Função auxiliar para formatar valores monetários de forma segura
function formatCurrency(value: number | string | null | undefined): string {
  if (!value && value !== 0) return "";
  const numValue = Number(value);
  if (isNaN(numValue)) return "";
  if (numValue <= 0) return "";
  return `R$ ${numValue.toFixed(2)}`;
}

// Função auxiliar para formatar data de forma segura
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

// Função auxiliar para formatar hora de forma segura
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

export function AdminServiceList({ items, onRefresh }: AdminServiceListProps) {
  const [showCancelDialog, setShowCancelDialog] = useState<string | null>(null);
  const [showFinishDialog, setShowFinishDialog] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Função para alterar status (cancelar/finalizar)
  const handleStatusChange = async (
    id: string,
    newStatus: StatusBadgeProps["status"]
  ) => {
    setLoading(id);
    const tid = toast.loading(
      newStatus === "cancelado"
        ? "Cancelando agendamento..."
        : "Finalizando agendamento..."
    );

    try {
      const res = await fetch(`${API_URL}/api/agendamentos/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || "Erro ao atualizar status");
      }

      toast.success(
        newStatus === "cancelado"
          ? "Agendamento cancelado com sucesso!"
          : "Agendamento finalizado com sucesso!",
        { id: tid }
      );

      onRefresh?.();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Erro ao atualizar status";
      toast.error(errorMessage, { id: tid });
    } finally {
      setLoading(null);
      setShowCancelDialog(null);
      setShowFinishDialog(null);
    }
  };

  // Função para excluir agendamento
  const handleDeleteAgendamento = async (id: string) => {
    setLoading(id);
    const tid = toast.loading("Excluindo agendamento...");

    try {
      const res = await fetch(`${API_URL}/api/agendamentos/${id}`, {
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
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Erro ao excluir agendamento";
      toast.error(errorMessage, { id: tid });
    } finally {
      setLoading(null);
      setShowDeleteDialog(null);
    }
  };

  if (!items?.length) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <p className="text-gray-600 text-lg">Nenhum agendamento encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((item) => {
          const valorFormatado = formatCurrency(item.valor);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Informações principais */}
                <div className="flex-1 space-y-4">
                  {/* Header com data, horário e status */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-lg font-bold text-gray-900">
                      {formatDateSafe(item.datetime)} às{" "}
                      {formatHourSafe(item.datetime)}
                    </div>
                    <StatusBadge status={item.status} />
                    {valorFormatado && (
                      <div className="text-lg font-bold text-green-600">
                        {valorFormatado}
                      </div>
                    )}
                  </div>

                  {/* Informações do serviço e veículo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{item.servico}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.modelo_veiculo} {item.cor && `- ${item.cor}`}
                      </div>
                      {item.placa && (
                        <div className="text-sm text-gray-600 font-mono">
                          Placa: {item.placa}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{item.cliente.nome}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.cliente.email}
                      </div>
                      {item.cliente.telefone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          {item.cliente.telefone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Observações */}
                  {item.observacoes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Observações:</strong> {item.observacoes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botões de controle baseados no status */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Botões para agendamentos com status "agendado" */}
                  {item.status === "agendado" && (
                    <>
                      <button
                        onClick={() => setShowFinishDialog(item.id)}
                        disabled={loading === item.id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        Finalizar
                      </button>

                      <button
                        onClick={() => setShowCancelDialog(item.id)}
                        disabled={loading === item.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </button>
                    </>
                  )}

                  {/* Botão de exclusão para agendamentos cancelados ou finalizados */}
                  {(item.status === "cancelado" ||
                    item.status === "finalizado") && (
                    <button
                      onClick={() => setShowDeleteDialog(item.id)}
                      disabled={loading === item.id}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog de confirmação para cancelar */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-red-500 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                Cancelar Agendamento
              </h3>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja cancelar este agendamento? Esta ação não
                pode ser desfeita.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCancelDialog(null)}
                  disabled={loading !== null}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 
                           rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Não, manter
                </button>
                <button
                  onClick={() =>
                    handleStatusChange(showCancelDialog, "cancelado")
                  }
                  disabled={loading !== null}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading === showCancelDialog
                    ? "Cancelando..."
                    : "Sim, cancelar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmação para finalizar */}
      {showFinishDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-green-500 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                Finalizar Agendamento
              </h3>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja marcar este agendamento como finalizado?
                Isso indica que o serviço foi concluído com sucesso.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowFinishDialog(null)}
                  disabled={loading !== null}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 
                           rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() =>
                    handleStatusChange(showFinishDialog, "finalizado")
                  }
                  disabled={loading !== null}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading === showFinishDialog
                    ? "Finalizando..."
                    : "Sim, finalizar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmação para excluir */}
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
                  disabled={loading !== null}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 
                           rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteAgendamento(showDeleteDialog)}
                  disabled={loading !== null}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading === showDeleteDialog
                    ? "Excluindo..."
                    : "Sim, excluir"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
