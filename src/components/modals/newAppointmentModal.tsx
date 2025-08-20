"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { NewAgendamentoForm } from "@/components/forms/newAppointmentForm";
import AddButton from "@/components/ui/addButton";

export function NewAppointmentModal({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <AddButton variant="primary" className="h-10">
          Novo Agendamento
        </AddButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="
            fixed z-50 max-h-[99dvh]
            top-1/2 left-1/2 w-[90vw] max-w-2xl
            -translate-x-1/2 -translate-y-1/2
            rounded-2xl bg-[#111] border border-[#333]
            p-6 shadow-lg focus:outline-none
            flex flex-col min-h-0
          "
        >
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-black">
              Novo Agendamento
            </Dialog.Title>

            <Dialog.Close
              aria-label="Fechar"
              className="
    inline-flex items-center justify-center
    rounded-md p-2
    text-white hover:text-red-400
    hover:bg-white/10
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-red-500
    focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]
    transition cursor-pointer
  "
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {/* Conteúdo rolável */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-2 -mr-2"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <NewAgendamentoForm
              onClose={() => setOpen(false)}
              onCreated={onCreated}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
