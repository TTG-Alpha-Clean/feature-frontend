// app/cliente/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { LogOut } from "lucide-react";
import { toast } from "react-hot-toast";

import { ActionCard } from "@/components/cards/actionCard";
import { ServiceList, type ServiceItem } from "@/components/lists/serviceList";
import { CarLogo } from "@/components/ui/carLogo";
import { NewAgendamentoForm } from "@/components/forms/newAppointmentForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ClienteDashboardPage() {
  const router = useRouter();

  // Estados principais
  const [checking, setChecking] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [agendamentos, setAgendamentos] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Função para forçar refresh da lista
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Verificação de autenticação
  useEffect(() => {
    let cancel = false;

    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("unauthorized");

        const userData = await res.json();
        if (!cancel) {
          setUser(userData);
          setChecking(false);
        }
      } catch {
        if (!cancel) {
          // Limpa cookies de sessão
          document.cookie = "has_session=; Max-Age=0; Path=/; SameSite=Lax";
          document.cookie = "role=; Max-Age=0; Path=/; SameSite=Lax";
          router.replace("/login?next=/cliente");
        }
      }
    };

    checkAuth();
    return () => {
      cancel = true;
    };
  }, [router]);

  // Buscar agendamentos do usuário
  useEffect(() => {
    if (!user) return;

    const fetchAgendamentos = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/agendamentos?page=1&page_size=50`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            router.replace("/login");
            return;
          }
          throw new Error("Erro ao buscar agendamentos");
        }

        const data = await res.json();

        // Converte os dados da API para o formato do ServiceList
        const agendamentosFormatados: ServiceItem[] =
          data.data?.map((item: any) => {
            // ✅ Log para debug
            console.log("Item da API:", item);

            // ✅ Extrai data limpa (sem hora)
            let dataLimpa = "";
            if (item.data) {
              // Se data vem como "2025-08-20T03:00:00.000Z", pega só a parte da data
              dataLimpa = item.data.split("T")[0];
            }

            return {
              id: item.id,
              datetime: `${dataLimpa}T${item.horario || "09:00"}`, // ✅ Usa data limpa
              servico: item.servico,
              veiculo: item.modelo_veiculo,
              modelo_veiculo: item.modelo_veiculo,
              cor: item.cor,
              placa: item.placa,
              data: dataLimpa, // ✅ Data limpa separada
              horario: item.horario, // ✅ Horário separado
              observacoes: item.observacoes,
              status: item.status,
            };
          }) || [];

        setAgendamentos(agendamentosFormatados);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        toast.error("Erro ao carregar agendamentos");
        setAgendamentos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamentos();
  }, [user, refreshKey, router]); // ✅ Reexecuta quando refreshKey mudar

  // Logout
  const handleLogout = async () => {
    const toastId = toast.loading("Fazendo logout...");

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      toast.success("Logout realizado com sucesso!", { id: toastId });
    } catch {
      toast.dismiss(toastId);
      // Ignora erro de logout mas ainda faz logout local
    } finally {
      // Limpa cookies de sessão
      document.cookie = "has_session=; Max-Age=0; Path=/; SameSite=Lax";
      document.cookie = "role=; Max-Age=0; Path=/; SameSite=Lax";
      router.replace("/login");
    }
  };

  // Handlers para ações dos cards
  const handleContact = () => {
    // Substitua pelo número real do WhatsApp
    const phone = "5511999999999";
    const message = "Olá! Gostaria de falar sobre meus agendamentos.";
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    toast.success("Redirecionando para WhatsApp...");
  };

  const handleLocation = () => {
    // Substitua pela localização real
    const address = "Rua das Palmeiras, 123, Centro";
    window.open(
      `https://maps.google.com/maps?q=${encodeURIComponent(address)}`,
      "_blank"
    );
    toast.success("Abrindo localização no Google Maps...");
  };

  const handleRefreshManual = () => {
    if (loading) return;

    toast.promise(
      new Promise((resolve) => {
        handleRefresh();
        // Simula um delay para feedback visual
        setTimeout(() => resolve("success"), 500);
      }),
      {
        loading: "Atualizando agendamentos...",
        success: "Lista atualizada!",
        error: "Erro ao atualizar",
      }
    );
  };

  // Loading de autenticação
  if (checking) {
    return (
      <main className="min-h-screen grid place-items-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-4 text-sm">
          Verificando sessão…
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Topbar */}
      <header className="sticky top-0 z-10 h-16 border-b border-[var(--card-border)] bg-[color:var(--card-bg)]/90 backdrop-blur">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <CarLogo />
            <div className="leading-tight">
              <p className="font-semibold">Alpha Clean</p>
              <p className="text-sm text-[color:var(--muted-foreground)]">
                Área do Cliente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user?.name || "Cliente"}</p>
              <p className="text-xs text-[color:var(--muted-foreground)]">
                {user?.email || "cliente@exemplo.com"}
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--card-border)] px-3 py-2 text-sm transition hover:bg-[var(--muted)]"
              aria-label="Sair"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10">
        {/* Cabeçalho */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            Bem-vindo, {user?.name?.split(" ")[0] || "Cliente"}!
          </h1>
          <p className="mt-1 max-w-2xl text-[15px] text-[color:var(--muted-foreground)]">
            Gerencie seus agendamentos e acompanhe o histórico de serviços.
          </p>
        </div>

        {/* Ações principais */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card que abre o modal de novo agendamento */}
          <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
            <Dialog.Trigger asChild>
              <ActionCard
                variant="solid"
                iconName="Plus"
                title="Novo Agendamento"
                subtitle="Agende um novo serviço para seu veículo"
                ctaLabel="Novo Agendamento"
              />
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
              <Dialog.Content
                className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2
                           rounded-2xl bg-[var(--card-bg)] p-6 shadow-lg focus:outline-none border border-[var(--card-border)]
                           max-h-[90vh] overflow-y-auto"
              >
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title className="text-xl font-semibold text-[var(--foreground)]">
                    Novo Agendamento
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      className="text-[color:var(--foreground)]/80 hover:opacity-70 p-1 rounded hover:bg-[var(--muted)] transition-colors"
                      aria-label="Fechar"
                    >
                      ✕
                    </button>
                  </Dialog.Close>
                </div>

                <NewAgendamentoForm
                  onClose={() => setModalOpen(false)}
                  onCreated={() => {
                    handleRefresh(); // ✅ Atualiza a lista após criar
                    setModalOpen(false);
                    toast.success("Agendamento criado com sucesso!");
                  }}
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {/* Card de Contato */}
          <ActionCard
            variant="outline"
            iconName="Phone"
            title="Contato"
            subtitle="Entre em contato conosco"
            ctaLabel="Falar Conosco"
            onClick={handleContact}
          />

          {/* Card de Localização */}
          <ActionCard
            variant="outline"
            iconName="MapPin"
            title="Localização"
            subtitle="Rua das Palmeiras, 123 – Centro"
            ctaLabel="Ver no Mapa"
            onClick={handleLocation}
          />
        </div>

        {/* Histórico de agendamentos */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Histórico de Serviços</h2>

            {/* Botão de atualizar manual */}
            <button
              onClick={handleRefreshManual}
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Carregando..." : "Atualizar"}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
                <p className="text-[var(--muted-foreground)]">
                  Carregando agendamentos...
                </p>
              </div>
            </div>
          ) : (
            <ServiceList
              items={agendamentos}
              onRefresh={handleRefresh} // ✅ Passa a função de refresh
            />
          )}
        </div>
      </section>
    </main>
  );
}
