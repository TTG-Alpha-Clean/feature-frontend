import Link from "next/link";
import { Car, Clock, Shield, Star } from "lucide-react";
import Card from "./heroCard";

export default function HeroSection() {
  return (
    <section
      className="w-full min-h-screen relative"
      style={{
        backgroundImage: "url('/teste.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay azul cobrindo toda a seção */}
      <div className="absolute inset-0 bg-[var(--primary)]/70"></div>

      {/* Espaçador invisível para compensar o header fixo */}
      <div className="h-16"></div>

      {/* Container principal */}
      <div className="relative z-10 px-4 sm:px-8 lg:px-24 py-6 sm:py-10 min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Conteúdo */}
        <div className="w-full max-w-2xl text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Seu Carro
            <br />
            <span className="text-[var(--accent)] py-1 rounded">
              Sempre Impecável
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Lava jato profissional com mais de 5 anos de experiência. Cuidamos
            do seu veículo com a qualidade que ele merece.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 sm:mb-12 justify-center lg:justify-start">
            <Link href="/login">
              <button className="w-full sm:w-auto flex gap-3 sm:gap-4 justify-center items-center bg-[var(--accent)] text-[var(--primary)] px-4 sm:px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300 font-semibold cursor-pointer h-12 text-sm sm:text-base">
                <Car size={18} className="sm:w-5 sm:h-5" />
                <span>Agendar Serviço</span>
              </button>
            </Link>

            <Link href="/servicos">
              <button className="w-full sm:w-auto flex gap-3 sm:gap-4 justify-center items-center bg-transparent text-white border-2 border-[var(--accent)] px-4 sm:px-6 py-3 rounded-lg hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-all duration-300 font-semibold cursor-pointer h-12 text-sm sm:text-base">
                <Star size={18} className="sm:w-5 sm:h-5" />
                <span>Ver Serviços</span>
              </button>
            </Link>
          </div>

          {/* Stats - responsivo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[var(--accent)] text-2xl sm:text-3xl font-bold px-3 sm:px-4 rounded-lg">
                5+
              </span>
              <p className="text-white font-medium text-sm sm:text-base mt-1">
                Anos de experiência
              </p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[var(--accent)] text-2xl sm:text-3xl font-bold px-3 sm:px-4 rounded-lg">
                2000+
              </span>
              <p className="text-white font-medium text-sm sm:text-base mt-1">
                Veículos atendidos
              </p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[var(--accent)] text-2xl sm:text-3xl font-bold px-3 sm:px-4 rounded-lg">
                100%
              </span>
              <p className="text-white font-medium text-sm sm:text-base mt-1">
                Satisfação garantida
              </p>
            </div>
          </div>
        </div>

        {/* Cards - responsivo */}
        <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-3 gap-4 sm:gap-6 lg:gap-8 mt-8 lg:mt-0">
          <Card
            title="Qualidade Garantida"
            description="Produtos profissionais e técnicas especializadas"
            icon={Shield}
          />
          <Card
            title="Atendimento Rápido"
            description="Serviços eficientes sem perder a qualidade"
            icon={Clock}
          />
          <Card
            title="Cuidado Completo"
            description="Do básico ao detalhamento premium"
            icon={Car}
          />
        </div>
      </div>
    </section>
  );
}
