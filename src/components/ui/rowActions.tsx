"use client";

import { useState } from "react";
import EditButton from "@/components/ui/editButton";
import DeleteButton from "@/components/ui/deleteButton";
import ConfirmDialog from "@/components/ui/confirmDialog";
import { StatusBadgeProps } from "./statusBadge";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function RowActions({
  id,
  status,
  onEdit,
  onCanceled,
}: {
  id: string;
  status: StatusBadgeProps["status"];
  onEdit?: (id: string) => void;
  onCanceled?: () => void;
}) {
  // Debug apenas em desenvolvimento
  if (process.env.NODE_ENV === "development") {
    console.log(`🔍 RowActions renderizado para ${id}:`, {
      status,
      onEdit: typeof onEdit,
      onCanceled: typeof onCanceled,
      canEdit: status === "agendado",
      canCancel: status === "agendado",
    });
  }

  const [showConfirm, setShowConfirm] = useState(false);
  const [canceling, setCanceling] = useState(false);

  // Só mostra botões para agendamentos com status "agendado"
  const canEdit = status === "agendado";
  const canCancel = status === "agendado";

  const handleEdit = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 handleEdit chamado para ID:", id);
      console.log("🔍 onEdit function:", typeof onEdit);
    }

    if (onEdit) {
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Chamando onEdit...");
      }
      onEdit(id);
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log("❌ onEdit não definido");
      }
      toast.error("Função de edição não implementada");
    }
  };

  const handleCancelConfirm = async () => {
    setCanceling(true);
    const tid = toast.loading("Cancelando agendamento...");

    try {
      const res = await fetch(`${API_URL}/api/agendamentos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Erro ao cancelar agendamento");
      }

      toast.success("Agendamento cancelado com sucesso!", { id: tid });

      // Chama o callback ANTES de fechar o modal
      if (onCanceled) {
        onCanceled();
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao cancelar agendamento", { id: tid });
    } finally {
      setCanceling(false);
      setShowConfirm(false);
    }
  };

  // Se não pode editar nem cancelar, não mostra nada
  if (!canEdit && !canCancel) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2">
        {canEdit && (
          <EditButton onClick={handleEdit} size="md" disabled={canceling} />
        )}
        {canCancel && (
          <DeleteButton
            onClick={() => setShowConfirm(true)}
            disabled={canceling}
          />
        )}
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Cancelar Agendamento"
        description="Tem certeza que deseja cancelar este agendamento? Esta ação não poderá ser desfeita."
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleCancelConfirm}
        onOpenChange={setShowConfirm}
      />
    </>
  );
}
