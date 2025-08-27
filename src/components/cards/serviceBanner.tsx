import Link from "next/link";

export default function ServiceBanner() {
  return (
    <section className="bg-gray-100 py-12 px-4 sm:px-8 w-[95%] lg:w-[55%] rounded-xl shadow-2xl">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--primary)] mb-4">
          Precisa de um Serviço Personalizado?
        </h2>

        <p className="text-[var(--muted-foreground)] text-base sm:text-md mb-8 max-w-2xl mx-auto">
          Entre em contato conosco para serviços especiais, pacotes corporativos
          ou atendimento em domicílio.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/contato">
            <button className="w-full sm:w-auto px-8 py-3 bg-[var(--primary)] text-white rounded-lg font-semibold hover:bg-[var(--primary)]/90 transition-colors">
              Solicitar Orçamento
            </button>
          </Link>

          <Link href="/servicos">
            <button className="w-full sm:w-auto px-8 py-3 bg-white text-[var(--primary)] border-2 border-[var(--primary)] rounded-lg font-semibold hover:bg-[var(--primary)] hover:text-white transition-all">
              Ver Todos os Serviços
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
