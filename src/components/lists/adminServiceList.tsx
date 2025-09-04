// src/components/lists/adminServiceList.tsx - COM ESTILO DO CALENDÁRIO

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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <p className="text-gray-600 text-lg">Nenhum agendamento encontrado.</p>
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
            <div className="bg-gray-400 px-4 sm:px-6 py-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-white">
                    {item.servico}
                  </h3>
                  <div className=" backdrop-blur-sm rounded-lg px-2 py-1">
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                {item.valor && (
                  <div className="bg-white backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-green-400 font-semibold">
                      {formatCurrency(item.valor)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                {/* Informações principais */}
                <div className="flex-1 space-y-4">
                  {/* Cliente */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-700">
                        Cliente
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="font-medium">{item.cliente.nome}</p>
                      {item.cliente.email && (
                        <p className="flex items-center gap-1">
                          📧 {item.cliente.email}
                        </p>
                      )}
                      {item.cliente.telefone && (
                        <p className="flex items-center gap-1">
                          <Phone size={14} />
                          {item.cliente.telefone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Data e Veículo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Data/Hora */}
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
                            ? formatDateSafe(item.data)
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
                        <span className="font-semibold text-gray-700">
                          Veículo
                        </span>
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
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          📝
                        </div>
                        <span className="font-semibold text-gray-700">
                          Observações
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {item.observacoes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex flex-row lg:flex-col gap-2 lg:items-end">
                  {(item.status === "agendado" ||
                    item.status === "em_andamento") && (
                    <DeleteButton onClick={() => handleDeleteClick(item.id)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog de confirmação de exclusão com estilo melhorado */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full mx-4 overflow-hidden">
            {/* Header do modal */}
            <div className="bg-red-500 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                Cancelar Agendamento
              </h3>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja cancelar este agendamento? Esta ação não
                pode ser desfeita.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteDialog(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 
                           rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Não, manter
                </button>
                <button
                  onClick={() => handleDeleteConfirm(showDeleteDialog)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                           transition-colors font-medium"
                >
                  Sim, cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
