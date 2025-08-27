// src/components/lists/adminServiceList.tsx - VERSÃO CORRIGIDA

"use client";

import { useState } from "react";
import {
  StatusBadge,
  type StatusBadgeProps,
} from "@/components/ui/statusBadge";
import DeleteButton from "@/components/ui/deleteButton";
import { formatDatePtBr, formatHour } from "@/lib/date";
import { toast } from "react-hot-toast";
import { User, Car, Phone } from "lucide-react";

export type AdminServiceItem = {
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
  valor?: number; // Valor do serviço
  // Dados do cliente
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
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);

  const handleDeleteConfirm = async (id: string) => {
    const tid = toast.loading("Cancelando agendamento...");

    try {
      const res = await fetch(`${API_URL}/api/agendamentos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || "Erro ao cancelar agendamento");
      }

      toast.success("Agendamento cancelado com sucesso!", { id: tid });
      onRefresh?.();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message
          : "Erro ao cancelar agendamento.";
      toast.error(errorMessage || "Erro ao cancelar agendamento.", { id: tid });
    } finally {
      setShowDeleteDialog(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setShowDeleteDialog(id);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (!items?.length) {
    return (
      <p className="text-base text-[#6b859c]">Nenhum agendamento encontrado.</p>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-[#e6edf3] bg-white p-4 shadow-sm
                       lg:flex-row lg:items-start lg:justify-between hover:border-[#d7e6f3] transition-colors"
          >
            {/* Esquerda: infos */}
            <div className="flex-1 space-y-3">
              {/* Linha 1: Serviço + Status + Valor */}
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-lg font-semibold text-[#022744]">
                  {item.servico}
                </p>
                <StatusBadge status={item.status} />
                {item.valor && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {formatCurrency(item.valor)}
                  </span>
                )}
              </div>

              {/* Linha 2: Cliente */}
              <div className="flex items-center gap-2 text-sm text-[#597891]">
                <User size={16} className="text-[#597891]" />
                <span className="font-medium">{item.cliente.nome}</span>
                {item.cliente.email && (
                  <span className="text-[#8a9ba8]">• {item.cliente.email}</span>
                )}
                {item.cliente.telefone && (
                  <span className="flex items-center gap-1">
                    <Phone size={14} />
                    {item.cliente.telefone}
                  </span>
                )}
              </div>

              {/* Linha 3: Data + Hora + Veículo */}
              <div className="flex flex-wrap items-center gap-1 text-sm text-[#597891]">
                <span className="font-medium">
                  {item.data
                    ? formatDateSafe(item.data)
                    : formatDateSafe(item.datetime)}
                </span>
                <span className="text-[#8a9ba8]">•</span>
                <span>{item.horario || formatHourSafe(item.datetime)}</span>
                <span className="text-[#8a9ba8]">•</span>
                <div className="flex items-center gap-1">
                  <Car size={14} className="text-[#597891]" />
                  <span>
                    {item.modelo_veiculo || item.veiculo}
                    {item.placa && ` - ${item.placa}`}
                    {item.cor && ` (${item.cor})`}
                  </span>
                </div>
              </div>

              {/* Observações se houver */}
              {item.observacoes && (
                <div className="text-sm text-[#8a9ba8] bg-[#f8fafc] p-2 rounded-lg">
                  <strong>Obs:</strong> {item.observacoes}
                </div>
              )}
            </div>

            {/* Direita: ações - APENAS BOTÃO DE DELETAR */}
            <div className="flex flex-col gap-2 lg:items-end">
              {/* Apenas botão de deletar */}
              {(item.status === "agendado" ||
                item.status === "em_andamento") && (
                <DeleteButton onClick={() => handleDeleteClick(item.id)} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dialog de confirmação de exclusão */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Cancelar Agendamento</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja cancelar este agendamento? Esta ação não
              pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteDialog(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Não, manter
              </button>
              <button
                onClick={() => handleDeleteConfirm(showDeleteDialog)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sim, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
