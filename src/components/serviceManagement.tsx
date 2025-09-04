// src/components/serviceManagement.tsx - VERSÃO ATUALIZADA
"use client";

import { useState } from "react";
import { Plus, DollarSign, Save, X } from "lucide-react";
import { toast } from "react-hot-toast";
import EditButton from "@/components/ui/editButton";
import DeleteButton from "@/components/ui/deleteButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Servico {
  id: string;
  nome: string;
  valor: number;
  ativo: boolean;
}

interface Props {
  servicos: Servico[];
  onServicoChange: () => void;
  onClose: () => void;
}

interface ApiError {
  error?: string;
}

export function ServicosManagement({
  servicos,
  onServicoChange,
  onClose,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nome: "", valor: "" });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleCreate = async (): Promise<void> => {
    if (!formData.nome.trim() || !formData.valor.trim()) {
      toast.error("Nome e valor são obrigatórios");
      return;
    }

    const valor = parseFloat(formData.valor);
    if (isNaN(valor) || valor <= 0) {
      toast.error("Valor deve ser um número maior que zero");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/servicos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nome: formData.nome.trim(), valor }),
      });

      if (!res.ok) {
        const error: ApiError = await res.json().catch(() => ({}));
        throw new Error(error?.error || "Erro ao criar serviço");
      }

      toast.success("Serviço criado com sucesso!");
      setIsCreating(false);
      setFormData({ nome: "", valor: "" });
      onServicoChange();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar serviço";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (servico: Servico): Promise<void> => {
    if (!formData.nome.trim() || !formData.valor.trim()) {
      toast.error("Nome e valor são obrigatórios");
      return;
    }

    const valor = parseFloat(formData.valor);
    if (isNaN(valor) || valor <= 0) {
      toast.error("Valor deve ser um número maior que zero");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/servicos/${servico.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nome: formData.nome.trim(),
          valor,
          ativo: servico.ativo,
        }),
      });

      if (!res.ok) {
        const error: ApiError = await res.json().catch(() => ({}));
        throw new Error(error?.error || "Erro ao editar serviço");
      }

      toast.success("Serviço editado com sucesso!");
      setEditingId(null);
      setFormData({ nome: "", valor: "" });
      onServicoChange();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao editar serviço";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (servico: Servico): Promise<void> => {
    if (
      !confirm(`Tem certeza que deseja excluir o serviço "${servico.nome}"?`)
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/servicos/${servico.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error: ApiError = await res.json().catch(() => ({}));
        throw new Error(error?.error || "Erro ao excluir serviço");
      }

      toast.success("Serviço removido com sucesso!");
      onServicoChange();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao excluir serviço";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (servico: Servico): void => {
    setEditingId(servico.id);
    setFormData({ nome: servico.nome, valor: servico.valor.toString() });
  };

  const cancelEditing = (): void => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ nome: "", valor: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">
          Gerenciar Serviços
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreating(true)}
            disabled={isCreating || loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} />
            Novo Serviço
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 
                       transition-colors text-[var(--foreground)]"
          >
            <X size={16} />
            Voltar
          </button>
        </div>
      </div>

      {/* Formulário de criação */}
      {isCreating && (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
            Criar Novo Serviço
          </h3>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Nome do serviço"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Valor (R$)"
              value={formData.valor}
              onChange={(e) =>
                setFormData({ ...formData, valor: e.target.value })
              }
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={16} />
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={cancelEditing}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <X size={16} />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de serviços */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)]">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
            Serviços Cadastrados ({servicos.length})
          </h3>

          <div className="space-y-3">
            {servicos.map((servico) => (
              <div
                key={servico.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 
                           transition-colors"
              >
                {editingId === servico.id ? (
                  // Modo de edição
                  <div className="flex items-center gap-4 flex-1">
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                                 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.valor}
                      onChange={(e) =>
                        setFormData({ ...formData, valor: e.target.value })
                      }
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                                 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(servico)}
                        disabled={loading}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Save size={16} />
                        Salvar
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={loading}
                        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 
                                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <X size={16} />
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modo de visualização
                  <>
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-semibold text-[var(--foreground)]">
                          {servico.nome}
                        </h4>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          Status: {servico.ativo ? "Ativo" : "Inativo"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        <DollarSign size={14} />
                        <span className="font-semibold">
                          {formatCurrency(servico.valor)}
                        </span>
                      </div>
                    </div>

                    {/* ✅ USANDO OS COMPONENTES EditButton e DeleteButton */}
                    <div className="flex gap-2">
                      <EditButton
                        onClick={() => startEditing(servico)}
                        disabled={loading || isCreating}
                        title="Editar serviço"
                        size="md"
                      />
                      <DeleteButton
                        onClick={() => handleDelete(servico)}
                        disabled={loading || isCreating}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}

            {servicos.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum serviço cadastrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Comece criando seu primeiro serviço
                </p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 mx-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                             transition-colors"
                >
                  <Plus size={16} />
                  Criar Primeiro Serviço
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
