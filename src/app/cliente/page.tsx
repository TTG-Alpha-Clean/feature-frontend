// app/cliente/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { LogOut } from "lucide-react";

import { ActionCard } from "@/components/cards/actionCard";
import {
  StatusBadge,
  type StatusBadgeProps,
} from "@/components/ui/statusBadge";
import { RowActions } from "@/components/ui/rowActions";
import { CarLogo } from "@/components/ui/carLogo";
import { formatDatePtBr, formatHour } from "@/lib/date";
import { NewAgendamentoForm } from "@/components/forms/newAppointmentForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function ClienteDashboardPage() {
  const router = useRouter();

  // 1) Hooks de estado SEMPRE primeiro
  const [checking, setChecking] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // 2) Hooks de memo SEMPRE antes de qualquer return condicional
  const user = useMemo(
    () => ({ name: "cliente", email: "cliente@gmail.com" }),
    []
  );

  const historico = useMemo(
    () =>
      [
        {
          id: "A-1007",
          data: "2025-08-14T09:30:00Z",
          servico: "Lavagem Completa",
          veiculo: "Corolla 2023",
          status: "finalizado" as StatusBadgeProps["status"],
        },
        {
          id: "A-1009",
          data: "2025-08-17T14:00:00Z",
          servico: "Higienização Interna",
          veiculo: "HB20 2021",
          status: "agendado" as StatusBadgeProps["status"],
        },
        {
          id: "A-1012",
          data: "2025-08-20T10:15:00Z",
          servico: "Polimento Cristalizado",
          veiculo: "Compass 2022",
          status: "em_andamento" as StatusBadgeProps["status"],
        },
        {
          id: "A-1014",
          data: "2025-08-22T16:45:00Z",
          servico: "Lavagem Express",
          veiculo: "Civic 2020",
          status: "cancelado" as StatusBadgeProps["status"],
        },
      ] as const,
    []
  );

  // 3) useEffect depois – mas ainda antes do return
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("unauthorized");
      } catch {
        if (!cancel) {
          document.cookie = "has_session=; Max-Age=0; Path=/; SameSite=Lax";
          document.cookie = "role=; Max-Age=0; Path=/; SameSite=Lax";
          router.replace("/login?next=/cliente");
        }
      } finally {
        if (!cancel) setChecking(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [router]);

  async function handleLogout() {
    try {
      // await fetch(`${API_URL}/auth/logout`, { credentials: "include" });
    } finally {
      document.cookie = "has_session=; Max-Age=0; Path=/; SameSite=Lax";
      document.cookie = "role=; Max-Age=0; Path=/; SameSite=Lax";
      router.replace("/login");
    }
  }

  // 4) Só aqui pode ter return condicional
  if (checking) {
    return (
      <main className="min-h-screen grid place-items-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-4 text-sm">
          Verificando sessão…
        </div>
      </main>
    );
  }

  // 5) Render padrão
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
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-[color:var(--muted-foreground)]">
                {user.email}
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
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            Bem-vindo, cliente!
          </h1>
          <p className="mt-1 max-w-2xl text-[15px] text-[color:var(--muted-foreground)]">
            Gerencie seus agendamentos e acompanhe o histórico de serviços.
          </p>
        </div>

        {/* Ações principais */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card que abre o modal */}
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
                           rounded-2xl bg-[var(--card-bg)] p-6 shadow-lg focus:outline-none border border-[var(--card-border)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title className="text-xl font-semibold text-[var(--foreground)]">
                    Novo Agendamento
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="text-[color:var(--foreground)]/80 hover:opacity-70">
                      ✕
                    </button>
                  </Dialog.Close>
                </div>

                <NewAgendamentoForm
                  onClose={() => setModalOpen(false)}
                  onCreated={() => {
                    // TODO: refetch do histórico quando integrar com API
                    setModalOpen(false);
                  }}
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <ActionCard
            variant="outline"
            iconName="Phone"
            title="Contato"
            subtitle="Entre em contato conosco"
            ctaLabel="Falar Conosco"
            onClick={() => alert("Abrir WhatsApp/telefone")}
          />
          <ActionCard
            variant="outline"
            iconName="MapPin"
            title="Localização"
            subtitle="Rua das Palmeiras, 123 – Centro"
            ctaLabel="Ver no Mapa"
            onClick={() => window.open("https://maps.google.com", "_blank")}
          />
        </div>

        {/* Histórico em cards */}
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-semibold">Histórico de Serviços</h2>
          <div className="space-y-5">
            {historico.map((h) => (
              <div
                key={h.id}
                className="flex flex-col gap-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 transition-colors
                           hover:border-[color-mix(in srgb,var(--accent) 60%, var(--card-border))] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-1 flex-col">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-bold">{h.servico}</p>
                    <StatusBadge status={h.status} />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted-foreground)]">
                    <span>{h.veiculo}</span>
                    <span>•</span>
                    <span>{formatDatePtBr(h.data)}</span>
                    <span>•</span>
                    <span>{formatHour(h.data)}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <RowActions id={h.id} status={h.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
