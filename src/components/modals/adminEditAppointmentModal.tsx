// src/components/modals/adminEditAppointmentModal.tsx - VERSÃO SIMPLIFICADA

"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { StatusBadgeProps } from "@/components/ui/statusBadge";

interface EditAppointmentData {
  id: string;
  modelo_veiculo: string;
  cor: string;
  placa: string;
  servico_id: string;
  servico_nome: string;
  data: string;
  horario: string;
  observacoes: string;
  status: StatusBadgeProps["status"];
  cliente_nome: string;
  cliente_email: string;
}

interface AdminEditAppointmentModalProps {
  appointment: EditAppointmentData;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

interface Servico {
  id: string;
  nome: string;
  valor: number;
  ativo: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {children}
    </label>
  );
}

export function AdminEditAppointmentModal({
  appointment,
  isOpen,
  onClose,
  onUpdated,
}: AdminEditAppointmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [servicos, setServicos] = useState<Servico[]>([]);

  // Estados do formulário
  const [modeloVeiculo, setModeloVeiculo] = useState("");
  const [cor, setCor] = useState("");
  const [placa, setPlaca] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [status, setStatus] = useState<StatusBadgeProps["status"]>("agendado");

  // Inicializar formulário com dados do agendamento
  useEffect(() => {
    if (appointment) {
      setModeloVeiculo(appointment.modelo_veiculo);
      setCor(appointment.cor || "");
      setPlaca(appointment.placa);
      setServicoId(appointment.servico_id);
      setData(appointment.data);
      setHorario(appointment.horario);
      setObservacoes(appointment.observacoes || "");
      setStatus(appointment.status);
    }
  }, [appointment]);

  // Carregar serviços
  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/servicos`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setServicos(data.data || []);
        }
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        toast.error("Erro ao carregar serviços");
      }
    };

    if (isOpen) {
      fetchServicos();
    }
  }, [isOpen]);

  const handleCancel = () => {
    onClose();
  };

  const handleSave = async () => {
    if (!modeloVeiculo || !placa || !servicoId || !data || !horario) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    const tid = toast.loading("Salvando alterações...");

    try {
      const res = await fetch(`${API_URL}/api/agendamentos/${appointment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          modelo_veiculo: modeloVeiculo,
          cor: cor || null,
          placa,
          servico_id: servicoId,
          data,
          horario,
          observacoes: observacoes || null,
          status,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || "Erro ao salvar alterações");
      }

      toast.success("Agendamento atualizado com sucesso!", { id: tid });
      onUpdated();
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao salvar alterações";
      toast.error(errorMessage, { id: tid });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-xl font-bold text-gray-900">
                Editar Agendamento
              </Dialog.Title>
              <p className="text-sm text-gray-600 mt-1">
                Cliente: {appointment?.cliente_nome} (
                {appointment?.cliente_email})
              </p>
            </div>
            <Dialog.Close className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Informações do Veículo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="modelo_veiculo">Modelo do Veículo *</Label>
                <input
                  id="modelo_veiculo"
                  type="text"
                  value={modeloVeiculo}
                  onChange={(e) => setModeloVeiculo(e.target.value)}
                  placeholder="Ex: Honda Civic"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="placa">Placa *</Label>
              <input
                id="placa"
                type="text"
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                placeholder="Ex: ABC-1234"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Serviço */}
            <div>
              <Label htmlFor="servico">Serviço *</Label>
              <select
                id="servico"
                value={servicoId}
                onChange={(e) => setServicoId(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione um serviço</option>
                {servicos
                  .filter((s) => s.ativo)
                  .map((servico) => (
                    <option key={servico.id} value={servico.id}>
                      {servico.nome} - R$ {servico.valor.toFixed(2)}
                    </option>
                  ))}
              </select>
            </div>

            {/* Data e Horário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data">Data *</Label>
                <input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="horario">Horário *</Label>
                <select
                  id="horario"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione um horário</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                </select>
              </div>
            </div>

            {/* ✅ STATUS - APENAS 3 OPÇÕES */}
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as StatusBadgeProps["status"])
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="agendado">Agendado</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações adicionais sobre o serviço..."
                rows={3}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg 
                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
