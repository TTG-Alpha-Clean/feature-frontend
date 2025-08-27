// components/navigation/auth-layout.tsx
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] relative overflow-hidden bg-gradient-to-br from-[#0a1420] via-[#152640] to-[#022744]">
      {/* Elementos decorativos automotivos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Hexágonos flutuantes */}
        <div className="absolute top-20 left-10 w-16 h-16 border-2 border-[#9BD60C]/20 transform rotate-12 animate-pulse">
          <div
            className="w-full h-full border border-[#9BD60C]/30"
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            }}
          />
        </div>

        {/* Círculos concêntricos (rodas) */}
        <div className="absolute top-40 right-20 w-24 h-24 opacity-10">
          <div
            className="w-full h-full rounded-full border-4 border-[#9BD60C] animate-spin"
            style={{ animationDuration: "20s" }}
          />
          <div className="absolute inset-2 rounded-full border-2 border-[#9BD60C]/60" />
          <div className="absolute inset-4 rounded-full border border-[#9BD60C]/40" />
        </div>

        {/* Forma de para-brisa */}
        <div className="absolute bottom-32 left-1/4 w-32 h-20 opacity-5 bg-gradient-to-t from-[#9BD60C] to-transparent transform -skew-x-12" />

        {/* Linhas de velocidade */}
        <div className="absolute top-1/3 right-0 w-40 h-1 bg-gradient-to-l from-[#9BD60C]/30 to-transparent" />
        <div className="absolute top-1/3 right-0 w-32 h-1 bg-gradient-to-l from-[#9BD60C]/20 to-transparent mt-4" />
        <div className="absolute top-1/3 right-0 w-24 h-1 bg-gradient-to-l from-[#9BD60C]/10 to-transparent mt-8" />

        {/* Grade automotiva */}
        <div className="absolute bottom-20 right-10 grid grid-cols-6 gap-1 opacity-5">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-3 h-1 bg-[#9BD60C] rounded-full" />
          ))}
        </div>

        {/* Forma de farol */}
        <div className="absolute top-1/4 left-1/3 w-20 h-10 bg-gradient-to-r from-[#9BD60C]/20 to-transparent rounded-full opacity-30 blur-sm" />

        {/* Partículas fixas decorativas */}
        <div className="absolute top-16 left-1/4 w-1 h-1 bg-[#9BD60C]/40 rounded-full animate-pulse" />
        <div
          className="absolute top-32 right-1/3 w-1 h-1 bg-[#9BD60C]/30 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-1/5 w-1 h-1 bg-[#9BD60C]/35 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-1 h-1 bg-[#9BD60C]/25 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(#9BD60C 1px, transparent 1px),
            linear-gradient(90deg, #9BD60C 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Container principal */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 mt-12">
        {/* Header with back button and brand aligned */}
        <div className="flex items-start justify-between mb-8">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-[#9BD60C]/20 transition-colors">
              <span className="text-lg">←</span>
            </div>
            <span className="font-medium">Voltar ao site</span>
          </Link>

          {/* Brand centered */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-4 mb-3">
              {/* Logo mais elaborado */}
              <div className="relative">
                <div
                  className="h-12 w-16 rounded-lg relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #9BD60C 0%, #c4ff57 50%, #9BD60C 100%)",
                  }}
                >
                  {/* Reflexo no logo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                  {/* Detalhes automotivos no logo */}
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/40 rounded-full" />
                  <div className="absolute top-2 right-2 w-1 h-1 bg-white/60 rounded-full" />
                </div>
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-[#9BD60C]/20 rounded-lg blur-md -z-10" />
              </div>

              <div className="text-3xl font-bold text-white">Alpha Clean</div>
            </div>

            <div className="text-center">
              <p className="text-[#9BD60C] font-semibold text-lg tracking-wide">
                PREMIUM AUTO CARE
              </p>
              <p className="text-white/60 text-sm mt-1 tracking-wider">
                Acesse sua área do cliente
              </p>
            </div>
          </div>

          {/* Spacer for symmetry */}
          <div className="w-[140px]"></div>
        </div>

        {/* Card container */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            {/* Glow effect do card */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9BD60C]/20 to-[#c4ff57]/20 rounded-2xl blur opacity-60" />

            {/* Card principal */}
            <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20">
              {children}
            </div>
          </div>
        </div>

        {/* Elementos decorativos inferiores */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <div className="w-1 h-1 bg-[#9BD60C] rounded-full animate-pulse" />
            <span>Proteção de dados SSL</span>
            <div
              className="w-1 h-1 bg-[#9BD60C] rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <span>Sistema seguro</span>
            <div
              className="w-1 h-1 bg-[#9BD60C] rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
