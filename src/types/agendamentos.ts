// src/types/agendamentos.ts - TIPOS COMPARTILHADOS

import { StatusBadgeProps } from "@/components/ui/statusBadge";

// ✅ Tipo base para agendamentos
export interface BaseAgendamento {
    id: string;
    data?: string;
    horario?: string;
    servico: string;
    status: StatusBadgeProps["status"];
    valor?: number | string | null;
}

// ✅ Tipo para AdminServiceList (mais completo)
export interface AdminServiceItem extends BaseAgendamento {
    datetime: string | Date;
    veiculo: string;
    modelo_veiculo?: string;
    cor?: string;
    placa?: string;
    observacoes?: string;
    cliente: {
        id: string;
        nome: string;
        email: string;
        telefone: string;
    };
    created_at?: string;
    updated_at?: string;
}

// ✅ Tipo para AdminCalendar (mais simples)
export interface CalendarAgendamento extends BaseAgendamento {
    cliente?: {
        nome: string;
    };
}

// ✅ Tipo para ServiceList (cliente)
export interface ServiceItem extends BaseAgendamento {
    datetime: string | Date;
    veiculo: string;
    modelo_veiculo?: string;
    cor?: string;
    placa?: string;
    observacoes?: string;
}

// ✅ Tipo para dados da API
export interface AgendamentoApiItem {
    id: string;
    data: string;
    horario: string;
    servico_nome: string;
    servico_valor?: number | string | null;
    modelo_veiculo: string;
    cor?: string;
    placa: string;
    observacoes?: string;
    status: string;
    valor?: number | string | null;
    usuario_id: string;
    usuario_nome?: string;
    usuario_email?: string;
    created_at: string;
    updated_at: string;
}