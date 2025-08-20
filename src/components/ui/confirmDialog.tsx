"use client";

import * as Dialog from "@radix-ui/react-dialog";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

export default function ConfirmDialog({
  open,
  title = "Tem certeza?",
  description = "Essa ação não poderá ser desfeita.",
  onCancel,
  onConfirm,
  onOpenChange,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Fundo de overlay sem cor fixa */}
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content
          className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 
                     rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-lg"
        >
          <Dialog.Title className="text-lg font-bold text-[var(--card-text)] mb-2">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-[var(--filter-placeholder)] mb-6">
            {description}
          </Dialog.Description>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                onCancel();
                onOpenChange(false);
              }}
              className="px-4 py-2 rounded-md bg-[var(--filter-input-bg)] text-[var(--filter-text)] border border-[var(--filter-input-border)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500 transition cursor-pointer"
            >
              Confirmar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
