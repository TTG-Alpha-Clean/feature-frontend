// src/components/modals/adminEditAppointmentModal.tsx
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import * as Dialog from "@radix-ui/react-dialog";
import { X, User, Car, Calendar, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StatusBadgeProps } from "@/components/ui/statusBadge";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type AdminAgendamentoEdit = {
  id: string;
  modelo_veiculo: string;
  cor: string;
  placa: string;
  servico: string;
  data: string;
  horario: string;
  observacoes: string;
  status: StatusBadgeProps["status"];
  cliente: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
  };
};

interface AdminEditAgendamentoModalProps {
  agendamento: AdminAgendamentoEdit;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const servicosDisponiveis = [
  "Lavagem Simples",
  "Lavagem Completa",
  "Lavagem + Enceramento",
  "Detalhamento Premium",
  "Lavagem a Seco",
  "Limpeza de Motor",
];

export function AdminEditAgendamentoModal({
  agendamento,
  isOpen,
  onClose,
  onSave,
}: AdminEditAgendamentoModalProps) {
  const [loading, setLoading] = useState(false);

  // Estados do formulário
  const [modeloVeiculo, setModeloVeiculo] = useState(
    agendamento.modelo_veiculo
  );
  const [cor, setCor] = useState(agendamento.cor);
  const [placa, setPlaca] = useState(agendamento.placa);
  const [servico, setServico] = useState(agendamento.servico);
  const [data, setData] = useState(agendamento.data);
  const [horario, setHorario] = useState(agendamento.horario);
  const [observacoes, setObservacoes] = useState(agendamento.observacoes);
  const [status, setStatus] = useState(agendamento.status);

  const handleSave = async () => {
    if (
      !modeloVeiculo.trim() ||
      !placa.trim() ||
      !servico ||
      !data ||
      !horario
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    const tid = toast.loading("Salvando alterações...");

    try {
      const res = await fetch(`${API_URL}/api/agendamentos/${agendamento.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelo_veiculo: modeloVeiculo.trim(),
          cor: cor.trim(),
          placa: placa.trim().toUpperCase(),
          servico,
          data,
          horario,
          observacoes: observacoes.trim(),
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || "Erro ao salvar alterações");
      }

      // Se o status também mudou, atualiza separadamente
      if (status !== agendamento.status) {
        const statusRes = await fetch(
          `${API_URL}/api/agendamentos/${agendamento.id}/status`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
          }
        );

        if (!statusRes.ok) {
          const error = await statusRes.json().catch(() => null);
          throw new Error(error?.error || "Erro ao alterar status");
        }
      }

      toast.success("Agendamento atualizado com sucesso!", { id: tid });
      onSave();
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao salvar alterações";
      toast.error(errorMessage, { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset para valores originais
    setModeloVeiculo(agendamento.modelo_veiculo);
    setCor(agendamento.cor);
    setPlaca(agendamento.placa);
    setServico(agendamento.servico);
    setData(agendamento.data);
    setHorario(agendamento.horario);
    setObservacoes(agendamento.observacoes);
    setStatus(agendamento.status);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                   bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50 m-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Editar Agendamento #{agendamento.id}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                Edite os dados do agendamento como administrador
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <X size={24} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-6">
            {/* Informações do Cliente (somente leitura) */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center text-blue-800">
                <User size={18} className="mr-2" />
                Informações do Cliente
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium">Nome:</span>{" "}
                  {agendamento.cliente.nome}
                </div>
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {agendamento.cliente.email}
                </div>
                {agendamento.cliente.telefone && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Telefone:</span>{" "}
                    {agendamento.cliente.telefone}
                  </div>
                )}
              </div>
            </div>

            {/* Informações do Veículo */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center text-gray-800">
                <Car size={18} className="mr-2" />
                Informações do Veículo
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="modelo">Modelo do Veículo *</Label>
                  <Input
                    id="modelo"
                    value={modeloVeiculo}
                    onChange={(e) => setModeloVeiculo(e.target.value)}
                    placeholder="Ex: Toyota Corolla"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cor">Cor</Label>
                  <Input
                    id="cor"
                    value={cor}
                    onChange={(e) => setCor(e.target.value)}
                    placeholder="Ex: Branco"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="placa">Placa *</Label>
                  <Input
                    id="placa"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                    placeholder="ABC-1234"
                    maxLength={8}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="servico">Serviço *</Label>
                  <select
                    id="servico"
                    value={servico}
                    onChange={(e) => setServico(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um serviço</option>
                    {servicosDisponiveis.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Data e Horário */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center text-gray-800">
                <Calendar size={18} className="mr-2" />
                Agendamento
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="horario">Horário *</Label>
                  <Input
                    id="horario"
                    type="time"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
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
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
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
