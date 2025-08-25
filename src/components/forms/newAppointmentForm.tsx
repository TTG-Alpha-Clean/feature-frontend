// src/components/forms/newAppointmentForm.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

interface ServicoOption {
  id: string;
  nome: string;
  valor: number | string;
}

interface SlotInfo {
  horario: string;
  disponivel: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const PLACA_REGEX_MERCOSUL = /^[A-Z]{3}\d[A-Z]\d{2}$/;

function normalizePlacaMercosul(v: string): string {
  const raw = v.toUpperCase().replace(/[^A-Z0-9]/g, "");

  let formatted = "";
  for (let i = 0; i < raw.length && i < 7; i++) {
    if (i < 3) {
      // Primeiras 3 posições: apenas letras
      if (/[A-Z]/.test(raw[i])) {
        formatted += raw[i];
      }
    } else if (i === 3) {
      // 4ª posição: número
      if (/[0-9]/.test(raw[i])) {
        formatted += raw[i];
      }
    } else if (i === 4) {
      // 5ª posição: letra
      if (/[A-Z]/.test(raw[i])) {
        formatted += raw[i];
      }
    } else {
      // 6ª e 7ª posições: números
      if (/[0-9]/.test(raw[i])) {
        formatted += raw[i];
      }
    }
  }

  return formatted;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function safeToFixed(value: number | string, digits: number = 2): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(numValue) ? "0,00" : numValue.toFixed(digits).replace(".", ",");
}

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

export function NewAgendamentoForm({ onClose, onCreated }: Props) {
  const [modelo_veiculo, setModelo] = useState("");
  const [cor, setCor] = useState("");
  const [placa, setPlaca] = useState("");
  const [servico_id, setServicoId] = useState("");
  const [data, setData] = useState(todayISO());
  const [horario, setHorario] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Estados para serviços e slots
  const [servicos, setServicos] = useState<ServicoOption[]>([]);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [loadingServicos, setLoadingServicos] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Carregar serviços disponíveis
  useEffect(() => {
    const loadServicos = async () => {
      setLoadingServicos(true);
      try {
        const res = await fetch(`${API_URL}/api/servicos`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erro ao carregar serviços");

        const data = await res.json();
        setServicos(data.data || []);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        toast.error("Erro ao carregar serviços disponíveis");
        setServicos([]);
      } finally {
        setLoadingServicos(false);
      }
    };

    loadServicos();
  }, []);

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
      setHorario(""); // Reset horário quando muda a data
    }
  }, [data]);

  const validate = () => {
    if (!modelo_veiculo || !placa || !servico_id || !data || !horario) {
      toast.error("Preencha todos os campos obrigatórios.");
      return false;
    }

    if (!PLACA_REGEX_MERCOSUL.test(placa)) {
      toast.error(
        "Placa inválida. Use o formato Mercosul ABC1D23 (ex.: ABC1E23)."
      );
      return false;
    }

    // Verifica se o horário selecionado está disponível
    const selectedSlot = slots.find((slot) => slot.horario === horario);
    if (!selectedSlot || selectedSlot.disponivel <= 0) {
      toast.error("Horário selecionado não está mais disponível.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const tid = toast.loading("Agendando serviço...");

    try {
      const res = await fetch(`${API_URL}/api/agendamentos`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelo_veiculo,
          cor: cor || null,
          placa,
          servico_id,
          data,
          horario,
          observacoes: observacoes || null,
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => null);
        const errorMessage = d?.error || "Erro ao criar agendamento.";
        console.error("Erro do servidor:", errorMessage);
        throw new Error(errorMessage);
      }

      toast.success("Agendamento criado com sucesso!", { id: tid });
      onCreated?.();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao agendar serviço.";
      toast.error(errorMessage, { id: tid });
    } finally {
      setSubmitting(false);
    }
  };

  // Encontra o serviço selecionado para mostrar o valor
  const servicoSelecionado = servicos.find((s) => s.id === servico_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Veículo */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Modelo do veículo *</Label>
          <Input
            placeholder="Ex: Corolla 2023"
            value={modelo_veiculo}
            onChange={(e) => setModelo(e.target.value)}
            disabled={submitting}
          />
        </div>
        <div>
          <Label>Cor</Label>
          <Input
            placeholder="Ex: Prata"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
            disabled={submitting}
          />
        </div>
      </div>

      {/* Placa + Serviço */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Placa Mercosul (ABC1D23) *</Label>
          <Input
            placeholder="ABC1E23"
            value={placa}
            onChange={(e) => setPlaca(normalizePlacaMercosul(e.target.value))}
            maxLength={7}
            disabled={submitting}
            className="font-mono"
          />
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Formato: 3 letras + 1 número + 1 letra + 2 números
          </p>
        </div>

        <div>
          <Label>Serviço *</Label>
          {loadingServicos ? (
            <div className="h-10 flex items-center px-3 border border-[var(--input-border)] rounded-lg bg-[var(--muted)]">
              <span className="text-sm text-[var(--muted-foreground)]">
                Carregando serviços...
              </span>
            </div>
          ) : (
            <Select
              value={servico_id}
              onValueChange={setServicoId}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {servicos.map((servico) => (
                  <SelectItem key={servico.id} value={servico.id}>
                    {servico.nome} - R$ {safeToFixed(servico.valor)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {servicoSelecionado && (
            <p className="text-sm text-[var(--accent)] mt-1 font-medium">
              Valor: R$ {safeToFixed(servicoSelecionado.valor)}
            </p>
          )}
        </div>
      </div>

      {/* Data */}
      <div>
        <Label>Data *</Label>
        <Input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          min={todayISO()}
          disabled={submitting}
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
        ) : slots.length === 0 && !loadingSlots && data ? (
          <div className="text-center py-8 text-[var(--muted-foreground)]">
            Nenhum horário disponível para esta data
          </div>
        ) : (
          <div className="space-y-4">
            {/* Grid de botões de horário */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {slots.map((slot) => {
                // Remove o .filter que ocultava slots sem vagas
                const isSelected = horario === slot.horario;
                const isAvailable = slot.disponivel > 0;

                return (
                  <button
                    key={slot.horario}
                    type="button"
                    disabled={!isAvailable || submitting}
                    onClick={() => isAvailable && setHorario(slot.horario)}
                    className={`
          p-3 rounded-lg border-2 transition-all font-medium text-sm
          ${
            isSelected && isAvailable
              ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]"
              : isAvailable
              ? "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
              : "border-red-200 bg-red-200 text-red-600 cursor-not-allowed" // Vermelho para ocupado
          }
          disabled:opacity-50
        `}
                  >
                    <div className="font-bold">
                      {formatHorarioBR(slot.horario)}
                    </div>
                    <div className="text-xs mt-1">
                      {isAvailable
                        ? `${slot.disponivel} vaga${
                            slot.disponivel !== 1 ? "s" : ""
                          }`
                        : "Lotado"}
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
        <textarea
          placeholder="Preferências, detalhes do veículo, etc."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          disabled={submitting}
          rows={3}
          className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg bg-[var(--input-bg)] text-[var(--input-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50 resize-none"
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
          disabled={submitting || !horario}
          className="px-6 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] font-medium transition-all hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Agendando..." : "Confirmar Agendamento"}
        </button>
      </div>
    </form>
  );
}
