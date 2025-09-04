"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Settings,
  Grid3X3,
  CalendarDays,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  AdminServiceList,
  type AdminServiceItem,
} from "@/components/lists/adminServiceList";
import { CarLogo } from "@/components/ui/carLogo";
import { ServicosManagement } from "@/components/serviceManagement";
import { AdminCalendar } from "@/components/calendars/adminCalendar";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface Servico {
  id: string;
  nome: string;
  valor: number;
  ativo: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Estados principais
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [agendamentos, setAgendamentos] = useState<AdminServiceItem[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showServicos, setShowServicos] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // ✅ Estado para controlar data atual do calendário
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

        if (!res.ok) {
          throw new Error("unauthorized");
        }

        const userData = await res.json();

        if (!userData.user?.role || userData.user.role !== "admin") {
          if (!cancel) {
            toast.error(
              "Acesso negado. Apenas administradores podem acessar esta área."
            );
            router.push("/cliente");
          }
          return;
        }

        if (!cancel) {
          setUser(userData.user);
          setChecking(false);
        }
      } catch {
        if (!cancel) {
          document.cookie = "has_session=; Max-Age=0; Path=/; SameSite=Lax";
          document.cookie = "role=; Max-Age=0; Path=/; SameSite=Lax";
          router.push("/home");
        }
      }
    };

    checkAuth();

    return () => {
      cancel = true;
    };
  }, [router]);

  // Carregamento de dados
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("🔄 Buscando dados...");

        // Buscar agendamentos e serviços em paralelo
        const [agendamentosRes, servicosRes] = await Promise.all([
          fetch(`${API_URL}/api/agendamentos?page=1&page_size=100`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/api/servicos`, {
            credentials: "include",
          }),
        ]);

        // Processar serviços
        if (servicosRes.ok) {
          const servicosData = await servicosRes.json();
          console.log("📋 Serviços carregados:", servicosData);
          setServicos(servicosData.data || []);
        }

        // Processar agendamentos
        if (agendamentosRes.ok) {
          const data = await agendamentosRes.json();
          console.log("📅 Dados brutos dos agendamentos:", data);

          // Tipo para os dados que vêm da API
          interface AgendamentoApiItem {
            id: string;
            data: string;
            horario: string;
            servico_nome: string;
            servico_valor: number | string | null;
            modelo_veiculo: string;
            cor: string;
            placa: string;
            observacoes: string;
            status: string;
            valor?: number | string | null;
            usuario_id: string;
            usuario_nome?: string;
            usuario_email?: string;
            created_at: string;
            updated_at: string;
          }

          // Converter os dados da API para o formato do AdminServiceList
          const agendamentosFormatados: AdminServiceItem[] =
            data.data?.map((item: AgendamentoApiItem) => {
              // Extrai data limpa (sem hora)
              let dataLimpa = "";
              if (item.data) {
                dataLimpa = item.data.split("T")[0];
              }

              // Usar servico_valor que vem do JOIN no backend, com fallback para valor
              const valor = item.servico_valor || item.valor || 0;

              console.log(
                `💰 Agendamento ${item.id}: valor=${valor}, status=${item.status}, data=${dataLimpa}`
              );

              return {
                id: item.id,
                datetime: `${dataLimpa}T${item.horario || "09:00"}`,
                servico: item.servico_nome || "Serviço não informado",
                veiculo: item.modelo_veiculo,
                modelo_veiculo: item.modelo_veiculo,
                cor: item.cor || "",
                placa: item.placa,
                data: dataLimpa || "", // ✅ Garantir que não seja undefined
                horario: item.horario || "09:00", // ✅ Garantir que não seja undefined
                observacoes: item.observacoes || "",
                status: item.status as AdminServiceItem["status"], // ✅ Cast para tipo correto
                valor: valor,
                cliente: {
                  id: item.usuario_id,
                  nome: item.usuario_nome || "Cliente não encontrado",
                  email: item.usuario_email || "",
                  telefone: "",
                },
                created_at: item.created_at,
                updated_at: item.updated_at,
              };
            }) || [];

          console.log("📊 Agendamentos formatados:", agendamentosFormatados);
          setAgendamentos(agendamentosFormatados);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados");
        setAgendamentos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, refreshKey, router]);

  // Logout
  const handleLogout = async () => {
    const toastId = toast.loading("Fazendo logout...");

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      toast.success("Logout realizado com sucesso!", { id: toastId });

      document.cookie = "has_session=; Max-Age=0; Path=/; SameSite=Lax";
      document.cookie = "role=; Max-Age=0; Path=/; SameSite=Lax";

      router.push("/login");
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout", { id: toastId });
    }
  };

  // ✅ Função para clique no calendário
  const handleDateClick = (
    date: string,
    dayAgendamentos: AdminServiceItem[]
  ) => {
    setSelectedDate(selectedDate === date ? null : date);
    setViewMode("list"); // Volta para a lista quando clica numa data
  };

  // ✅ Função segura para mudança de data do calendário
  const handleDateChange = (newDate: Date) => {
    if (newDate && !isNaN(newDate.getTime())) {
      setCurrentDate(newDate);
    } else {
      console.error("Data inválida recebida:", newDate);
      setCurrentDate(new Date()); // Fallback para hoje
    }
  };

  // Loading inicial
  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">
            Verificando permissões...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // ✅ Cálculos de estatísticas - SEM EM_ANDAMENTO
  const stats = {
    total: agendamentos.length,
    agendados: agendamentos.filter((a) => a.status === "agendado").length,
    finalizados: agendamentos.filter((a) => a.status === "finalizado").length,
    cancelados: agendamentos.filter((a) => a.status === "cancelado").length,
  };

  // ✅ Função segura para formatar valores
  const formatCurrency = (value: number | string | null | undefined) => {
    const numValue = Number(value) || 0;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue);
  };

  // Cálculo de receita usando o campo valor correto
  const hoje = new Date().toISOString().split("T")[0];
  const receitaHoje = agendamentos
    .filter((a) => a.status === "finalizado" && a.data === hoje)
    .reduce((sum, a) => {
      const valor = Number(a.valor) || 0;
      console.log(`💰 Receita hoje - Agendamento ${a.id}: +${valor}`);
      return sum + valor;
    }, 0);

  // Receita do mês atual
  const mesAtual = new Date().toISOString().substring(0, 7); // YYYY-MM
  const receitaMes = agendamentos
    .filter((a) => a.status === "finalizado" && a.data?.startsWith(mesAtual))
    .reduce((sum, a) => {
      const valor = Number(a.valor) || 0;
      console.log(`💰 Receita mês - Agendamento ${a.id}: +${valor}`);
      return sum + valor;
    }, 0);

  console.log(`💵 Receita hoje: ${receitaHoje}`);
  console.log(`💵 Receita mês: ${receitaMes}`);

  // Filtrar agendamentos se uma data foi selecionada
  const agendamentosFiltrados = selectedDate
    ? agendamentos.filter((a) => a.data === selectedDate)
    : agendamentos;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <CarLogo />
              <div>
                <h1 className="text-xl font-semibold text-[var(--foreground)]">
                  Alpha Clean - Administração
                </h1>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Bem-vindo, {user.nome}!
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowServicos(!showServicos)}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] 
                           hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                <Settings size={16} />
                <span>Gerenciar Serviços</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] 
                           hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {showServicos ? (
          <ServicosManagement
            servicos={servicos}
            onServicoChange={() => setRefreshKey((prev) => prev + 1)}
            onClose={() => setShowServicos(false)}
          />
        ) : (
          <>
            {/* ✅ ESTATÍSTICAS - SEM EM_ANDAMENTO */}
            <div className="space-y-4 mb-8">
              {/* Primeira linha - 3 cards principais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--card-border)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Agendados
                      </p>
                      <p className="text-2xl font-bold text-[var(--foreground)]">
                        {stats.agendados}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--card-border)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Finalizados
                      </p>
                      <p className="text-2xl font-bold text-[var(--foreground)]">
                        {stats.finalizados}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--card-border)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Cancelados
                      </p>
                      <p className="text-2xl font-bold text-[var(--foreground)]">
                        {stats.cancelados}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Segunda linha - 2 cards de receita */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--card-border)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Receita Hoje
                      </p>
                      <p className="text-xl font-bold text-[var(--foreground)]">
                        {formatCurrency(receitaHoje)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--card-border)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Receita Mês
                      </p>
                      <p className="text-xl font-bold text-[var(--foreground)]">
                        {formatCurrency(receitaMes)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle entre Visualizações */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  {selectedDate
                    ? `Agendamentos de ${new Date(
                        selectedDate + "T00:00:00"
                      ).toLocaleDateString("pt-BR")}`
                    : viewMode === "calendar"
                    ? "Visão do Calendário"
                    : `Todos os Agendamentos (${agendamentosFiltrados.length})`}
                </h2>

                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-sm text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
                  >
                    × Limpar filtro
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("list")}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors
                    ${
                      viewMode === "list"
                        ? "bg-[var(--primary)] text-white"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                    }
                  `}
                >
                  <Grid3X3 size={16} />
                  <span>Lista</span>
                </button>

                <button
                  onClick={() => setViewMode("calendar")}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors
                    ${
                      viewMode === "calendar"
                        ? "bg-[var(--primary)] text-white"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                    }
                  `}
                >
                  <CalendarDays size={16} />
                  <span>Calendário</span>
                </button>

                <button
                  onClick={handleRefresh}
                  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Carregando..." : "Atualizar"}
                </button>
              </div>
            </div>

            {/* ✅ Conteúdo baseado no modo de visualização */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
                  <p className="text-[var(--muted-foreground)]">
                    Carregando agendamentos...
                  </p>
                </div>
              </div>
            ) : viewMode === "calendar" ? (
              <AdminCalendar
                agendamentos={agendamentos}
                currentDate={currentDate} // ✅ Passa currentDate válido
                onDateChange={handleDateChange} // ✅ Função segura
                onDayClick={handleDateClick} // ✅ Função de clique
              />
            ) : (
              <AdminServiceList
                items={agendamentosFiltrados}
                onRefresh={handleRefresh}
              />
            )}
          </>
        )}
      </section>
    </main>
  );
}
