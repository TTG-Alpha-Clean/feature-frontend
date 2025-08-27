import Image from "next/image";
import { Calendar1, Clock, Droplets, Medal, Sprout } from "lucide-react";
import AboutCard from "./aboutCard";

export default function AboutSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 max-w-[90rem] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-start">
        {/* Lado esquerdo - Conteúdo */}
        <div className="order-2 lg:order-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--primary)] mb-6 sm:mb-8 text-center lg:text-left">
            Nossa História e Missão
          </h2>

          <div className="space-y-4 sm:space-y-6 text-[var(--muted-foreground)] text-base sm:text-lg leading-relaxed">
            <p>
              Fundado em 2014, o{" "}
              <strong className="text-[var(--primary)]">Alpha Clean</strong>{" "}
              nasceu da paixão por automóveis e do compromisso em oferecer
              serviços de lava jato que realmente fazem a diferença.
            </p>

            <p>
              Nossa missão é proporcionar aos nossos clientes um atendimento
              excepcional, utilizando as melhores técnicas e produtos do mercado
              para garantir que seu veículo receba o cuidado que merece.
            </p>

            <p>
              Acreditamos que um carro limpo não é apenas uma questão estética,
              mas também de preservação do investimento e orgulho do
              proprietário. Por isso, cada serviço é executado com máxima
              atenção aos detalhes.
            </p>
          </div>

          {/* Valores */}
          <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-bold text-[var(--primary)] text-base sm:text-lg mb-1">
                  Qualidade Garantida
                </h4>
                <p className="text-[var(--muted-foreground)] text-sm sm:text-base">
                  Produtos premium e técnicas profissionais
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-bold text-[var(--primary)] text-base sm:text-lg mb-1">
                  Atendimento Personalizado
                </h4>
                <p className="text-[var(--muted-foreground)] text-sm sm:text-base">
                  Cada cliente e veículo recebe atenção especial
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-bold text-[var(--primary)] text-base sm:text-lg mb-1">
                  Comprometimento
                </h4>
                <p className="text-[var(--muted-foreground)] text-sm sm:text-base">
                  Pontualidade e responsabilidade em todos os serviços
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito - Grid de imagens e cards */}
        <div className="order-1 lg:order-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Primeira linha/coluna */}
          <div className="space-y-4 sm:space-y-6">
            <Image
              src="/card1.jpg"
              alt="Lava jato Alpha Clean"
              width={400}
              height={280}
              className="rounded-xl shadow-lg w-full h-48 sm:h-56 lg:h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center mb-2 sm:mb-3 mx-auto">
                <Medal color="white" size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-bold text-[var(--primary)] mb-1 text-sm sm:text-base">
                Certificação
              </h4>
              <p className="text-[var(--muted-foreground)] text-xs sm:text-sm">
                Profissionais qualificados
              </p>
            </div>
          </div>

          {/* Segunda linha/coluna */}
          <div className="space-y-4 sm:space-y-6 sm:mt-8 lg:mt-12">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center mb-2 sm:mb-3 mx-auto">
                <Sprout color="white" size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-bold text-[var(--primary)] mb-1 text-sm sm:text-base">
                Eco-Friendly
              </h4>
              <p className="text-[var(--muted-foreground)] text-xs sm:text-sm">
                Produtos biodegradáveis
              </p>
            </div>
            <Image
              src="/card2.jpg"
              alt="Limpeza detalhada Alpha Clean"
              width={400}
              height={280}
              className="rounded-xl shadow-lg w-full h-48 sm:h-56 lg:h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 mt-16 gap-4 lg:gap-12">
        <AboutCard
          title="5+"
          description="Anos de Experiência"
          icon={Calendar1}
        />
        <AboutCard
          title="2000+"
          description="Clientes Satisfeitos"
          icon={Medal}
        />
        <AboutCard title="100%" description="Pontualidade" icon={Clock} />
        <AboutCard
          title="Premium"
          description="Produtos Utilizados"
          icon={Droplets}
        />
      </div>
    </section>
  );
}
