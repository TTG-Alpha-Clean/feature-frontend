"use client";

import React from "react";
import Image from "next/image";
import axios from "axios";
import Button from "../ui/button";
import { Clock } from "lucide-react";

/* ==========================
 * Tipos
 * ========================== */
export type Information = {
  id: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Service = {
  id: number;
  type: string;
  title: string;
  subtitle?: string;
  price: number;
  time: number;
  description?: string;
  image_url?: string; // <- vem do backend em snake_case
  createdAt?: string;
  updatedAt?: string;
  informations?: Information[];
};

/* ==========================
 * Helpers
 * ========================== */
function formatPriceBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatMinutes(mins: number) {
  if (!Number.isFinite(mins)) return "—";
  if (mins < 60) return `${mins} minutos`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/* ==========================
 * Ícones por tipo (usa var(--accent))
 * ========================== */
const TypeIcon: React.FC<{ type: string; className?: string }> = ({
  type,
  className = "h-5 w-5 text-[var(--accent)]",
}) => {
  switch (type.toLowerCase()) {
    case "básico":
    case "basico":
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      );
    case "completo":
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
          <path d="M4 6h16v12H4z" />
          <path d="M22 6l-10-4-10 4" />
        </svg>
      );
    case "premium":
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2l3 7h7l-5.5 4.5L18 22l-6-4-6 4 1.5-8.5L2 9h7l3-7z" />
        </svg>
      );
    case "proteção":
    case "protecao":
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "especializado":
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

/* ==========================
 * Estados: Loading & Error
 * ========================== */
export const LoadingState: React.FC<{ variant: "compact" | "detailed" }> = ({ variant }) => {
  const gridCols = variant === "compact" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 md:grid-cols-2";
  return (
    <div className={`grid gap-6 ${gridCols}`}>
      {Array.from({ length: variant === "compact" ? 3 : 2 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-[16px] border p-5 shadow-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <div className="mb-4 h-5 w-24 rounded" style={{ background: "var(--muted)" }} />
          {variant === "detailed" && <div className="mb-4 h-40 w-full rounded-lg" style={{ background: "var(--muted)" }} />}
          <div className="mb-2 h-6 w-2/3 rounded" style={{ background: "var(--muted)" }} />
          <div className="mb-6 h-4 w-1/2 rounded" style={{ background: "var(--muted)" }} />
          <div className="h-10 w-full rounded-[16px]" style={{ background: "var(--muted)" }} />
        </div>
      ))}
    </div>
  );
};

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = "Não foi possível carregar os serviços.",
  onRetry,
}) => (
  <div className="rounded-[16px] border p-4 text-red-600" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
    <p className="text-sm font-medium">{message}</p>
    {onRetry && (
      <div className="mt-3">
        <Button onClick={onRetry} variant="primary" className="w-auto px-3 py-1.5 text-sm">
          Tentar novamente
        </Button>
      </div>
    )}
  </div>
);

/* ==========================
 * UI pequenos (Badge / List items)
 * ========================== */
const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium"
    style={{
      color: "var(--accent)",
      borderColor: "var(--accent)",
      background: "color-mix(in srgb, var(--accent) 12%, transparent)",
    }}
  >
    {children}
  </span>
);

const DotItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
    <span className="mt-2 inline-block h-2 w-2 flex-none rounded-full bg-[var(--accent)]" />
    <span>{children}</span>
  </li>
);

const CheckItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" className="mt-0.5 flex-none text-[var(--accent)]">
      <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>{children}</span>
  </li>
);

/* ==========================
 * Cards
 * ========================== */

// Compact: 3 por linha no desktop
const ServiceCardCompact: React.FC<{ service: Service }> = ({ service }) => {
  const { type, title, subtitle, price, time, description, informations } = service;
  const visible = Array.isArray(informations) ? informations.slice(0, 3) : [];

  return (
    <article
      className="group flex flex-col justify-between rounded-[16px] border p-6 shadow-sm transition hover:shadow-md min-h-[500px] w-full max-w-[400px]"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
        color: "var(--foreground)",
      }}
      aria-label={`Serviço: ${title}`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        {/* Ícone dentro de círculo */}
        {type && (
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full transition-colors group-hover:bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] mb-2"
            style={{
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
            }}
          >
            <TypeIcon
              type={type}
              className="h-6 w-6 text-[var(--accent)] transition-transform duration-200 group-hover:scale-110"
            />
          </div>
        )}

        {/* Título */}
        <h3 className="text-lg font-semibold text-[var(--primary)]">
          {title || "Serviço"}
        </h3>

        {/* Tempo + Preço */}
        <div className="flex items-center gap-3 mb-2">
          {Number.isFinite(time) && (
            <span className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
              <Clock className="h-4 w-4" />
              {formatMinutes(time)}
            </span>
          )}
          <span className="text-xl font-extrabold text-[var(--accent)]">
            {formatPriceBRL(price ?? 0)}
          </span>
        </div>

        {/* Subtítulo opcional */}
        {subtitle && (
          <p className="text-sm font-light text-[var(--primary)] mb-3">
            {subtitle}
          </p>
        )}

        {/* Lista de benefícios */}
        {visible.length > 0 && (
          <ul className="w-full space-y-2 text-left mt-2">
            {visible.map((info, i) => (
              <li
                key={info.id ?? `${title}-info-${i}`}
                className="flex items-start gap-2 text-sm text-[var(--primary)]/85"
              >
                <span className="mt-1.5 inline-block h-2 w-2 flex-none rounded-full bg-[var(--accent)]" />
                <span className="text-left">{info.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botão centralizado */}
      <Button
        className="mt-6 w-full rounded-full py-3 font-semibold
                   !bg-transparent !text-[var(--accent)] border border-[var(--accent)]
                   transition-colors duration-200 hover:bg-[var(--accent)] hover:text-white
                   focus-visible:ring-2 focus-visible:ring-[var(--accent)]
                   active:scale-[.99]"
      >
        Agendar Serviço
      </Button>
    </article>
  );
};




// Detailed: 2 por linha no desktop (imagem acompanha o card)
const ServiceCardDetailed: React.FC<{ service: Service; highlightLabel?: string }> = ({
  service,
  highlightLabel,
}) => {
  const { type, title, subtitle, price, time, description, image_url, informations } = service;

  // suporta preço riscado vindo junto no objeto
  const originalPrice = (service as any)?.originalPrice as number | undefined;

  const MAX_VISIBLE_ITEMS = 4;
  const visible = Array.isArray(informations) ? informations.slice(0, MAX_VISIBLE_ITEMS) : [];
  const hiddenCount = Array.isArray(informations) ? Math.max(informations.length - MAX_VISIBLE_ITEMS, 0) : 0;

  return (
    <article
      className="relative grid grid-cols-1 gap-6 rounded-[16px] border p-6 shadow-sm transition hover:shadow-md
                 sm:grid-cols-[minmax(260px,360px)_1fr] sm:items-stretch"
      style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--foreground)" }}
      aria-label={`Serviço: ${title || "Serviço"}`}
    >
      {/* Selo de destaque opcional */}
      {highlightLabel && (
        <div
          className="absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: "var(--accent)", color: "var(--accent-foreground, #fff)" }}
        >
          {highlightLabel}
        </div>
      )}

      {/* Coluna da imagem */}
      <div className="relative h-[260px] overflow-hidden rounded-lg sm:h-auto">
        {image_url ? (
          <Image
            src={image_url}
            alt={title ? `Imagem ilustrativa para ${title}` : "Imagem do serviço"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 360px"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
          >
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 19.5h18a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 21 4.5H3A1.5 1.5 0 0 0 1.5 6v12A1.5 1.5 0 0 0 3 19.5Z" />
            </svg>
          </div>
        )}
      </div>

      {/* Coluna do conteúdo */}
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          {/* Ícone + badge do tipo */}
          <div className="flex items-center gap-3">
            {type && (
              <>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full border"
                  style={{ borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)" }}
                >
                  <TypeIcon type={type} className="h-5 w-5 text-[var(--accent)]" />
                </span>
                <span
                  className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                  style={{ borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)", color: "var(--accent)" }}
                >
                  {type}
                </span>
              </>
            )}
          </div>

          {/* Título e subtítulo (sub em verde como no mock) */}
          <div>
            <h3 className="text-2xl font-bold leading-tight" style={{ color: "var(--primary)" }}>
              {title || "Serviço"}
            </h3>
            {subtitle && (
              <p className="mt-0.5 text-sm font-semibold text-[var(--accent)]0">{subtitle}</p>
            )}
          </div>

          {/* Preços + tempo */}
          <div className="mt-1">
            <div className="flex flex-wrap items-baseline gap-3">
              <p className="text-3xl font-extrabold" style={{ color: "var(--primary)" }}>
                {formatPriceBRL(price ?? 0)}
              </p>
              {Number.isFinite(originalPrice as number) && originalPrice! > (price ?? 0) && (
                <span className="text-lg line-through opacity-60" style={{ color: "var(--primary)" }}>
                  {formatPriceBRL(originalPrice!)}
                </span>
              )}
            </div>
            {Number.isFinite(time) && (
              <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: "var(--primary)" }}>
                <Clock className="h-4 w-4" />
                {formatMinutes(time)}
              </span>
            )}
          </div>

          {/* Descrição curta */}
          {description && (
            <p className="text-sm leading-relaxed" style={{ color: "var(--primary)" }}>
              {description}
            </p>
          )}

          {/* Lista de features (checks) */}
          {visible.length > 0 && (
            <div>
              <ul className="mt-1 space-y-2">
                {visible.map((info, i) => (
                  <li
                    key={info.id ?? `${title}-info-${i}`}
                    className="flex items-start gap-3 text-sm"
                    style={{ color: "var(--primary)" }}
                  >
                    <svg className="mt-0.5 h-4 w-4 flex-none text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{info.description}</span>
                  </li>
                ))}
              </ul>

              {hiddenCount > 0 && (
                <span className="mt-1 inline-block text-sm font-semibold text-[var(--accent)]">
                  + {hiddenCount} itens adicionais
                </span>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-5">
          <Button variant="primary" className="w-full rounded-2xl py-3 font-semibold">
            Agendar Serviço
          </Button>
        </div>
      </div>
    </article>
  );
};



/* ==========================
 * Grid
 * ========================== */
/* ==========================
 * Grid
 * ========================== */
const ServiceGrid: React.FC<{ services: Service[]; variant: "compact" | "detailed" }> = ({ services, variant }) => {
  const gridTemplate =
    variant === "compact"
      ? // compacto → até 3 colunas, cada card entre 360–460px
        "[grid-template-columns:repeat(auto-fit,minmax(360px,1fr))] \
         sm:[grid-template-columns:repeat(auto-fit,minmax(380px,1fr))] \
         lg:[grid-template-columns:repeat(3,minmax(420px,1fr))]"
      : // detalhado → até 2 colunas, cada card entre 520–560px
        "[grid-template-columns:repeat(auto-fit,minmax(480px,1fr))] \
         md:[grid-template-columns:repeat(2,minmax(520px,1fr))] \
         lg:[grid-template-columns:repeat(2,minmax(560px,1fr))]";

  const Card = variant === "compact" ? ServiceCardCompact : ServiceCardDetailed;

  return (
    <div className={`grid gap-6 ${gridTemplate}`}>
      {services.map((svc, idx) => (
        <Card key={svc.id ?? `${svc.title}-${idx}`} service={svc} />
      ))}
    </div>
  );
};


/* ==========================
 * ServicesSection
 * ========================== */
export type ServicesSectionProps = {
  variant?: "compact" | "detailed";
  className?: string;
  endpoint?: string;
};

const ServicesSection: React.FC<ServicesSectionProps> = ({
  variant = "compact",
  className = "",
  endpoint = "/api/services",
}) => {
  const [services, setServices] = React.useState<Service[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Service[]>(endpoint, { timeout: 15000 });
      const data = Array.isArray(res.data) ? res.data : [];
      setServices(data);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar serviços");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <section className={`w-full ${className}`} aria-live="polite">
      {loading && <LoadingState variant={variant} />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && services && services.length === 0 && (
        <p
          className="rounded-[16px] border p-4 text-sm"
          style={{ background: "var(--muted)", borderColor: "var(--card-border)", color: "var(--muted-foreground)" }}
        >
          Nenhum serviço encontrado.
        </p>
      )}
      {!loading && !error && services && services.length > 0 && (
        <ServiceGrid services={services} variant={variant} />
      )}
    </section>
  );
};

export default ServicesSection;
