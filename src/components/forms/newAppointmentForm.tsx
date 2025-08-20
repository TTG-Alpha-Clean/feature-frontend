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

type ServicoOption = { id: string; nome: string };

interface Props {
  onClose: () => void;
  onCreated?: () => void;
}

const PLACA_REGEX_DB = /^[A-Z]{3}-\d{4}$/; // AAA-9999 (igual ao CHECK do DB)

function normalizePlacaDB(v: string) {
  const raw = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const L = raw.slice(0, 3).replace(/[^A-Z]/g, "");
  const N = raw.slice(3, 7).replace(/[^0-9]/g, "");
  return N ? `${L}-${N}` : L;
}
function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function NewAgendamentoForm({ onClose, onCreated }: Props) {
  const [modelo_veiculo, setModelo] = useState("");
  const [cor, setCor] = useState("");
  const [placa, setPlaca] = useState("");
  const [servico, setServico] = useState("");
  const [data, setData] = useState(todayISO());
  const [horario, setHorario] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const servicos: ServicoOption[] = useMemo(
    () => [
      { id: "lavagem_express", nome: "Lavagem Express" },
      { id: "lavagem_completa", nome: "Lavagem Completa" },
      { id: "higienizacao_interna", nome: "Higienização Interna" },
      { id: "polimento_cristal", nome: "Polimento Cristalizado" },
    ],
    []
  );

  useEffect(() => {
    const today = todayISO();
    if (data < today) setData(today);
  }, [data]);

  const validate = () => {
    if (!modelo_veiculo || !placa || !servico || !data || !horario) {
      toast.error("Preencha todos os campos obrigatórios.");
      return false;
    }
    if (!PLACA_REGEX_DB.test(placa)) {
      toast.error("Placa inválida. Use o formato AAA-9999 (ex.: ABC-1234).");
      return false;
    }
    if (!/^\d{2}:\d{2}$/.test(horario)) {
      toast.error("Informe um horário válido (HH:MM).");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const tid = toast.loading("Agendando serviço...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/agendamentos`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            modelo_veiculo,
            cor: cor || null,
            placa, // AAA-9999
            servico,
            data, // yyyy-mm-dd
            horario, // HH:MM
            observacoes: observacoes || null,
            // usuario_id via sessão; status default 'agendado'
          }),
        }
      );

      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.error || "Erro ao criar agendamento.");
      }

      toast.success("Agendamento criado com sucesso!", { id: tid });
      onCreated?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao agendar serviço.", { id: tid });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Veículo */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Modelo do veículo *</Label>
          <Input
            placeholder="Ex: Corolla 2023"
            value={modelo_veiculo}
            onChange={(e) => setModelo(e.target.value)}
          />
        </div>
        <div>
          <Label>Cor</Label>
          <Input
            placeholder="Ex: Prata"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
          />
        </div>
      </div>

      {/* Placa + Serviço */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Placa (AAA-9999) *</Label>
          <Input
            placeholder="ABC-1234"
            value={placa}
            onChange={(e) => setPlaca(normalizePlacaDB(e.target.value))}
            maxLength={8}
          />
        </div>
        <div>
          <Label>Serviço *</Label>
          <Select value={servico} onValueChange={setServico}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um serviço" />
            </SelectTrigger>
            <SelectContent>
              {servicos.map((s) => (
                <SelectItem key={s.id} value={s.nome}>
                  {s.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data + Horário */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Data *</Label>
          <Input
            type="date"
            min={todayISO()}
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <div>
          <Label>Horário *</Label>
          <Input
            type="time"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          />
        </div>
      </div>

      {/* Observações */}
      <div>
        <Label>Observações</Label>
        <Textarea
          placeholder="Preferências, detalhes do veículo, etc."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />
      </div>

      {/* Botões */}
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[var(--muted)] px-6 py-3 font-medium text-[var(--foreground)] transition-all hover:opacity-90"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--accent)] px-6 py-3 text-[16px] font-semibold text-[var(--accent-contrast)] transition-all hover:opacity-90"
        >
          Agendar
        </button>
      </div>
    </form>
  );
}
