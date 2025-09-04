"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
} from "lucide-react";
import { AdminServiceItem } from "@/components/lists/adminServiceList";

interface AdminCalendarProps {
  agendamentos: AdminServiceItem[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onDayClick?: (date: string, agendamentos: AdminServiceItem[]) => void;
}

interface DayData {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  agendamentos: AdminServiceItem[];
  stats: {
    total: number;
    agendados: number;
    finalizados: number;
    cancelados: number;
    receita: number;
  };
}

export function AdminCalendar({
  agendamentos,
  currentDate,
  onDateChange,
  onDayClick,
}: AdminCalendarProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // ✅ PROTEÇÃO: Garantir que currentDate sempre seja uma Date válida
  const safeCurrentDate =
    currentDate && !isNaN(currentDate.getTime()) ? currentDate : new Date();

  // Navegação entre meses
  const goToPreviousMonth = () => {
    const newDate = new Date(
      safeCurrentDate.getFullYear(),
      safeCurrentDate.getMonth() - 1,
      1
    );
    onDateChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(
      safeCurrentDate.getFullYear(),
      safeCurrentDate.getMonth() + 1,
      1
    );
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  // Dados do calendário
  const calendarData = useMemo(() => {
    const year = safeCurrentDate.getFullYear();
    const month = safeCurrentDate.getMonth();

    // Primeiro dia do mês e último dia do mês
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Primeiro dia da semana do calendário (domingo anterior se necessário)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Último dia da semana do calendário (sábado posterior se necessário)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days: DayData[] = [];
    const today = new Date().toISOString().split("T")[0];

    // Gerar todos os dias do calendário
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dateString = date.toISOString().split("T")[0];
      const isCurrentMonth = date.getMonth() === month;

      // Filtrar agendamentos deste dia
      const dayAgendamentos = agendamentos.filter(
        (ag) => ag.data === dateString
      );

      // Calcular estatísticas do dia - SEM EM_ANDAMENTO
      const stats = {
        total: dayAgendamentos.length,
        agendados: dayAgendamentos.filter((a) => a.status === "agendado")
          .length,
        finalizados: dayAgendamentos.filter((a) => a.status === "finalizado")
          .length,
        cancelados: dayAgendamentos.filter((a) => a.status === "cancelado")
          .length,
        receita: dayAgendamentos
          .filter((a) => a.status === "finalizado")
          .reduce((sum, a) => {
            const valor = Number(a.valor) || 0;
            return sum + valor;
          }, 0),
      };

      days.push({
        date: dateString,
        day: date.getDate(),
        isCurrentMonth,
        isToday: dateString === today,
        agendamentos: dayAgendamentos,
        stats,
      });
    }

    return days;
  }, [safeCurrentDate, agendamentos]);

  // Estatísticas do mês - SEM EM_ANDAMENTO
  const monthStats = useMemo(() => {
    const monthAgendamentos = agendamentos.filter(
      (ag) =>
        ag.data &&
        ag.data.startsWith(safeCurrentDate.toISOString().substring(0, 7))
    );

    return {
      total: monthAgendamentos.length,
      agendados: monthAgendamentos.filter((a) => a.status === "agendado")
        .length,
      finalizados: monthAgendamentos.filter((a) => a.status === "finalizado")
        .length,
      cancelados: monthAgendamentos.filter((a) => a.status === "cancelado")
        .length,
      receita: monthAgendamentos
        .filter((a) => a.status === "finalizado")
        .reduce((sum, a) => {
          const valor = Number(a.valor) || 0;
          return sum + valor;
        }, 0),
    };
  }, [safeCurrentDate, agendamentos]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendado":
        return "bg-blue-500";
      case "finalizado":
        return "bg-green-500";
      case "cancelado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Cabeçalho do Calendário */}
      <div className="bg-gray-400 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-white gap-3 sm:gap-0">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <h3 className="text-lg sm:text-xl font-bold">
              {monthNames[safeCurrentDate.getMonth()]}{" "}
              {safeCurrentDate.getFullYear()}
            </h3>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
            >
              Hoje
            </button>

            <div className="flex items-center space-x-1">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas do Mês - ATUALIZADO PARA 3 STATUS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-4">
          <div className="bg-white backdrop-blur-sm rounded-xl p-2 sm:p-3 text-center">
            <div className="text-lg sm:text-2xl font-bold">
              {monthStats.total}
            </div>
            <div className="text-xs sm:text-sm opacity-90">Total</div>
          </div>

          <div className="bg-white backdrop-blur-sm rounded-xl p-2 sm:p-3 text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-400">
              {monthStats.agendados}
            </div>
            <div className="text-xs sm:text-sm opacity-90">Agendados</div>
          </div>

          <div className="bg-white backdrop-blur-sm rounded-xl p-2 sm:p-3 text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-400">
              {monthStats.finalizados}
            </div>
            <div className="text-xs sm:text-sm opacity-90">Finalizados</div>
          </div>

          <div className="bg-white backdrop-blur-sm rounded-xl p-2 sm:p-3 text-center">
            <div className="text-base sm:text-lg font-bold text-green-400">
              {formatCurrency(monthStats.receita)}
            </div>
            <div className="text-xs sm:text-sm opacity-90">Receita</div>
          </div>
        </div>
      </div>

      {/* Grade do Calendário */}
      <div className="p-3 sm:p-6">
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-3 sm:mb-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className="h-8 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Dias do calendário */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-2">
          {calendarData.map((dayData, index) => (
            <div
              key={index}
              onClick={() => onDayClick?.(dayData.date, dayData.agendamentos)}
              onMouseEnter={() => setHoveredDate(dayData.date)}
              onMouseLeave={() => setHoveredDate(null)}
              className={`
                relative group cursor-pointer transition-all duration-200 transform hover:scale-105
                ${dayData.isCurrentMonth ? "hover:shadow-lg" : ""}
              `}
            >
              <div
                className={`
                  h-16 sm:h-20 md:h-24 rounded-lg sm:rounded-xl border-2 transition-all duration-200 p-1 sm:p-2 flex flex-col
                  ${
                    dayData.isCurrentMonth
                      ? dayData.isToday
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : hoveredDate === dayData.date
                        ? "border-purple-300 bg-purple-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      : "border-gray-100 bg-gray-50"
                  }
                `}
              >
                {/* Número do dia */}
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`
                    text-xs sm:text-sm font-semibold
                    ${
                      dayData.isCurrentMonth
                        ? dayData.isToday
                          ? "text-blue-600 text-sm sm:text-lg"
                          : "text-gray-700"
                        : "text-gray-400"
                    }
                  `}
                  >
                    {dayData.day}
                  </span>

                  {/* Contador de agendamentos */}
                  {dayData.stats.total > 0 && (
                    <div className="relative">
                      <div
                        className={`
                        px-1 sm:px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-sm
                        ${
                          dayData.stats.total > 3
                            ? "bg-red-500"
                            : dayData.stats.total > 1
                            ? "bg-orange-500"
                            : "bg-blue-500"
                        }
                      `}
                      >
                        {dayData.stats.total}
                      </div>
                    </div>
                  )}
                </div>

                {/* Indicadores de status - ATUALIZADO PARA 3 STATUS */}
                {dayData.stats.total > 0 && (
                  <div className="flex-1 flex flex-col justify-end">
                    {/* Barras de progresso por status */}
                    <div className="grid grid-cols-2 gap-0.5 sm:gap-1 mb-1">
                      {dayData.stats.agendados > 0 && (
                        <div className="h-1 sm:h-1.5 bg-blue-400 rounded-full opacity-80"></div>
                      )}
                      {dayData.stats.finalizados > 0 && (
                        <div className="h-1 sm:h-1.5 bg-green-400 rounded-full opacity-80"></div>
                      )}
                      {dayData.stats.cancelados > 0 && (
                        <div className="h-1 sm:h-1.5 bg-red-400 rounded-full opacity-80"></div>
                      )}
                    </div>

                    {/* Valor da receita */}
                    {dayData.stats.receita > 0 && (
                      <div className="text-center">
                        <span className="text-xs font-medium text-green-600 bg-green-100 px-1 sm:px-1.5 py-0.5 rounded-md">
                          {dayData.stats.receita > 999
                            ? `${(dayData.stats.receita / 1000).toFixed(1)}k`
                            : formatCurrency(dayData.stats.receita)
                                .replace("R$", "")
                                .trim()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tooltip no hover - apenas em desktop */}
                {hoveredDate === dayData.date && dayData.stats.total > 0 && (
                  <div className="hidden lg:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg min-w-max">
                      <div className="font-medium mb-1">
                        {new Date(
                          dayData.date + "T00:00:00"
                        ).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex justify-between space-x-3">
                          <span>Total:</span>
                          <span className="font-medium">
                            {dayData.stats.total}
                          </span>
                        </div>
                        {dayData.stats.receita > 0 && (
                          <div className="flex justify-between space-x-3">
                            <span>Receita:</span>
                            <span className="font-medium text-green-300">
                              {formatCurrency(dayData.stats.receita)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                        <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legenda - ATUALIZADA PARA 3 STATUS */}
      <div className="bg-gray-50 px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-100">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded shadow-sm"></div>
            <span className="text-gray-600 font-medium">Agendado</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded shadow-sm"></div>
            <span className="text-gray-600 font-medium">Finalizado</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-400 rounded shadow-sm"></div>
            <span className="text-gray-600 font-medium">Cancelado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
