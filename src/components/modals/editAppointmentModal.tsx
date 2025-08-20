// src/components/modals/editAgendamentoModal.tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { EditAgendamentoForm } from "../forms/editAppointmentForm";

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

interface EditAgendamentoModalProps {
  agendamento: Agendamento | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export function EditAgendamentoModal({
  agendamento,
  onClose,
  onUpdated,
}: EditAgendamentoModalProps) {
  if (!agendamento) return null;

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-lg focus:outline-none max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-[var(--foreground)]">
              Editar Agendamento
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                className="text-[var(--foreground)]/80 hover:text-[var(--foreground)] cursor-pointer p-1 rounded hover:bg-[var(--muted)] transition-colors"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <EditAgendamentoForm
            agendamento={agendamento}
            onClose={onClose}
            onUpdated={onUpdated}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
