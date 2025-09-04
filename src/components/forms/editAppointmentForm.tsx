// src/components/forms/editAgendamentoForm.tsx - VERSÃO CORRIGIDA
"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Clock } from "lucide-react";

interface Agendamento {
  id: string;
  modelo_veiculo: string;
  cor: string;
  placa: string;
  servico: string;
  data: string;
  horario: string;
  observacoes: string;
  status: string;
}

type ServicoOption = {
  id: string;
  nome: string;
  valor: number;
  ativo: boolean;
};
type SlotInfo = {
  horario: string;
  ocupados: number;
  capacidade: number;
  disponivel: number;
};

interface Props {
  agendamento: Agendamento;
  onClose: () => void;
  onUpdated?: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
// ✅ CORREÇÃO: Usar regex Mercosul em vez do formato antigo
const PLACA_REGEX_MERCOSUL = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/; // ABC1E23

// ✅ CORREÇÃO: Função para normalizar placa no formato Mercosul
function normalizePlacaMercosul(v: string) {
  const raw = v.toUpperCase().replace(/[^A-Z0-9]/g, "");

  if (raw.length === 0) return "";
  if (raw.length <= 3) return raw.replace(/[^A-Z]/g, "");
  if (raw.length === 4)
    return raw.slice(0, 3) + raw.slice(3, 4).replace(/[^0-9]/g, "");
  if (raw.length === 5)
    return raw.slice(0, 3) + raw.slice(3, 4) + raw.slice(4, 5);

  // ABC1E23 completo
  return (
    raw.slice(0, 3) +
    raw.slice(3, 4).replace(/[^0-9]/g, "") +
    raw.slice(4, 5) +
    raw.slice(5, 7).replace(/[^0-9]/g, "")
  );
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// Função para formatar horário no estilo brasileiro (8h00, 8h50, etc.)
function formatHorarioBR(horario24: string): string {
  const [hora, minuto] = horario24.split(":");
  const h = parseInt(hora);
  const m = parseInt(minuto);

  if (m === 0) {
    return `${h}h`;
  } else {
    return `${h}h${m.toString().padStart(2, "0")}`;
  }
}

export function EditAgendamentoForm({
  agendamento,
  onClose,
  onUpdated,
}: Props) {
  const [modelo_veiculo, setModelo] = useState(agendamento.modelo_veiculo);
  const [cor, setCor] = useState(agendamento.cor || "");
  const [placa, setPlaca] = useState(agendamento.placa);
  const [servico_id, setServicoId] = useState(""); // ✅ Usar servico_id em vez de servico
  const [data, setData] = useState(agendamento.data);
  const [horario, setHorario] = useState(agendamento.horario);
  const [observacoes, setObservacoes] = useState(agendamento.observacoes || "");

  // Estados para slots disponíveis
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ✅ CORREÇÃO: Carregar serviços da API em vez de usar lista estática
  const [servicos, setServicos] = useState<ServicoOption[]>([]);
  const [loadingServicos, setLoadingServicos] = useState(false);

  // ✅ CORREÇÃO: Carregar serviços da API
  useEffect(() => {
    const loadServicos = async () => {
      setLoadingServicos(true);
      try {
        const res = await fetch(`${API_URL}/api/servicos`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erro ao carregar serviços");

        const data = await res.json();
        const servicosDisponiveis = data.data || [];
        setServicos(servicosDisponiveis);

        // ✅ Encontrar o servico_id baseado no nome do agendamento
        const servicoAtual = servicosDisponiveis.find(
          (s: ServicoOption) => s.nome === agendamento.servico
        );
        if (servicoAtual) {
          setServicoId(servicoAtual.id);
        }
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        toast.error("Erro ao carregar serviços disponíveis");
        setServicos([]);
      } finally {
        setLoadingServicos(false);
      }
    };

    loadServicos();
  }, [agendamento.servico]);

  // Função para carregar slots disponíveis
  const loadSlots = async (selectedDate: string) => {
    if (!selectedDate) return;

    setLoadingSlots(true);
    try {
      const res = await fetch(
        `${API_URL}/api/agendamentos/slots?data=${selectedDate}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Erro ao carregar horários");

      const data = await res.json();
      setSlots(data.slots || []);
    } catch (error) {
      console.error("Erro ao carregar slots:", error);
      toast.error("Erro ao carregar horários disponíveis");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Carrega slots quando a data muda
  useEffect(() => {
    const today = todayISO();
    if (data < today) setData(today);

    if (data) {
      loadSlots(data);
    }
  }, [data]);

  const validate = () => {
    if (!modelo_veiculo.trim()) {
      toast.error("Modelo do veículo é obrigatório.");
      return false;
    }

    if (!placa.trim()) {
      toast.error("Placa é obrigatória.");
      return false;
    }

    if (!servico_id.trim()) {
      toast.error("Serviço é obrigatório.");
      return false;
    }

    if (!data.trim()) {
      toast.error("Data é obrigatória.");
      return false;
    }

    if (!horario.trim()) {
      toast.error("Horário é obrigatório.");
      return false;
    }

    // ✅ CORREÇÃO: Validar com regex Mercosul
    if (!PLACA_REGEX_MERCOSUL.test(placa)) {
      toast.error(
        "Placa inválida. Use o formato Mercosul ABC1E23 (ex.: ABC1E23)."
      );
      return false;
    }

    // Verifica se o horário selecionado está disponível OU é o horário atual do agendamento
    const selectedSlot = slots.find((slot) => slot.horario === horario);
    const isCurrentSlot =
      agendamento.horario === horario && agendamento.data === data;

    if (!isCurrentSlot && (!selectedSlot || selectedSlot.disponivel <= 0)) {
      toast.error("Horário selecionado não está mais disponível.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const tid = toast.loading("Atualizando agendamento...");

    try {
      // ✅ Verifica se houve mudanças
      const hasChanges =
        modelo_veiculo !== agendamento.modelo_veiculo ||
        cor !== (agendamento.cor || "") ||
        placa !== agendamento.placa ||
        servico_id !==
          (servicos.find((s) => s.nome === agendamento.servico)?.id || "") ||
        data !== agendamento.data ||
        horario !== agendamento.horario ||
        observacoes !== (agendamento.observacoes || "");

      if (!hasChanges) {
        toast.success("Nenhuma alteração detectada.", { id: tid });
        onClose();
        return;
      }

      // ✅ Usa a nova rota PUT para edição completa
      const res = await fetch(`${API_URL}/api/agendamentos/${agendamento.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelo_veiculo,
          cor: cor || null,
          placa,
          servico_id, // ✅ Enviar servico_id em vez de servico
          data,
          horario,
          observacoes: observacoes || null,
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => null);
        const errorMessage = d?.error || "Erro ao atualizar agendamento.";
        throw new Error(errorMessage);
      }

      toast.success("Agendamento atualizado com sucesso!", { id: tid });
      onUpdated?.();
      onClose();
    } catch (err: unknown) {
      console.error("Erro ao atualizar agendamento:", err);
      let errorMessage = "Erro ao atualizar agendamento.";
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message?: string }).message === "string"
      ) {
        errorMessage = (err as { message: string }).message;
      }
      toast.error(errorMessage, {
        id: tid,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Função para detectar se o agendamento pode ser editado completamente
  const canEditCompletely = agendamento.status === "agendado";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ✅ Aviso se não pode editar completamente */}
      {!canEditCompletely && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            <p className="text-sm text-yellow-800">
              <strong>Atenção:</strong> Este agendamento não pode ser editado
              pois está com status {agendamento.status}. Apenas agendamentos com
              status agendado podem ser modificados.
            </p>
          </div>
        </div>
      )}

      {/* Veículo */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Modelo do veículo *</Label>
          <Input
            placeholder="Ex: Corolla 2023"
            value={modelo_veiculo}
            onChange={(e) => setModelo(e.target.value)}
            disabled={!canEditCompletely || submitting}
            className={
              !canEditCompletely ? "bg-gray-100 cursor-not-allowed" : ""
            }
          />
        </div>
        <div>
          <Label>Cor</Label>
          <Input
            placeholder="Ex: Prata"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
            disabled={!canEditCompletely || submitting}
            className={
              !canEditCompletely ? "bg-gray-100 cursor-not-allowed" : ""
            }
          />
        </div>
      </div>

      {/* Placa + Serviço */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          {/* ✅ CORREÇÃO: Atualizar label e placeholder */}
          <Label>Placa (ABC1E23) *</Label>
          <Input
            placeholder="ABC1E23"
            value={placa}
            onChange={(e) => setPlaca(normalizePlacaMercosul(e.target.value))}
            maxLength={7} // ✅ CORREÇÃO: Mercosul tem 7 caracteres
            disabled={!canEditCompletely || submitting}
            className={
              !canEditCompletely ? "bg-gray-100 cursor-not-allowed" : ""
            }
          />
        </div>
        <div>
          <Label>Serviço *</Label>
          <Select
            value={servico_id}
            onValueChange={setServicoId}
            disabled={!canEditCompletely || submitting || loadingServicos}
          >
            <SelectTrigger
              className={
                !canEditCompletely ? "bg-gray-100 cursor-not-allowed" : ""
              }
            >
              <SelectValue
                placeholder={
                  loadingServicos ? "Carregando..." : "Selecione um serviço"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {servicos.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.nome}
                </SelectItem>
              ))}
              {servicos.length === 0 && !loadingServicos && (
                <SelectItem value="" disabled>
                  Nenhum serviço disponível
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data */}
      <div>
        <Label>Data *</Label>
        <Input
          type="date"
          min={todayISO()}
          value={data}
          onChange={(e) => setData(e.target.value)}
          disabled={submitting || !canEditCompletely}
          className={!canEditCompletely ? "bg-gray-100 cursor-not-allowed" : ""}
        />
      </div>

      {/* Seleção de Horário com Botões */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Escolha um horário *
            {loadingSlots && (
              <span className="text-sm text-[var(--muted-foreground)]">
                Carregando horários...
              </span>
            )}
          </Label>

          {/* Legenda alinhada à direita */}
          {!loadingSlots && slots.length > 0 && (
            <div className="flex flex-wrap gap-4 text-xs text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[var(--accent)]"></div>
                <span>Selecionado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border-2 border-[var(--card-border)]"></div>
                <span>Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-200"></div>
                <span>Ocupado</span>
              </div>
            </div>
          )}
        </div>

        {loadingSlots ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-8 text-[var(--muted-foreground)]">
            Nenhum horário disponível para esta data
          </div>
        ) : (
          <div className="space-y-4">
            {/* Grid de botões de horário */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {slots.map((slot) => {
                const isSelected = horario === slot.horario;
                const isAvailable = slot.disponivel > 0;
                const isCurrentSlot =
                  agendamento.horario === slot.horario &&
                  agendamento.data === data;

                return (
                  <button
                    key={slot.horario}
                    type="button"
                    disabled={
                      (!isAvailable && !isCurrentSlot) ||
                      submitting ||
                      !canEditCompletely
                    }
                    onClick={() => setHorario(slot.horario)}
                    className={`
                      p-3 rounded-lg border-2 transition-all font-medium text-sm
                      ${
                        isSelected && (isAvailable || isCurrentSlot)
                          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)]"
                          : isAvailable || isCurrentSlot
                          ? "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
                          : "border-red-200 bg-red-50 text-red-400 cursor-not-allowed"
                      }
                      disabled:opacity-50
                    `}
                  >
                    <div className="font-bold">
                      {formatHorarioBR(slot.horario)}
                    </div>
                    <div className="text-xs mt-1">
                      {isAvailable || isCurrentSlot
                        ? `${slot.disponivel} vaga${
                            slot.disponivel !== 1 ? "s" : ""
                          }`
                        : "Ocupado"}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Horário selecionado */}
            {horario && (
              <div className="p-4 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-lg">
                <div className="flex items-center gap-2 text-[var(--accent)]">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">
                    Horário selecionado: {formatHorarioBR(horario)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Observações */}
      <div>
        <Label>Observações</Label>
        <Textarea
          placeholder="Preferências, detalhes do veículo, etc."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          disabled={!canEditCompletely || submitting}
          className={!canEditCompletely ? "bg-gray-100 cursor-not-allowed" : ""}
        />
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="px-6 py-2 rounded-lg border border-[var(--card-border)] text-[var(--foreground)] transition-all hover:bg-[var(--muted)] disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || !horario || !canEditCompletely || !servico_id}
          className="px-6 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] font-medium transition-all hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
}
