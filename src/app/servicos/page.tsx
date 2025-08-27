"use client";
import Button from "@/components/ui/button";
import ServicesSection from "@/components/sections/servicesSection";
import Footer from "../../components/navigation/footer";
import Header from "../../components/navigation/header"

export default function SessionPage() {
  return (
    <main className="w-full">
      <Header />
      <section className=" mt-20 relative isolate bg-[var(--primary)] text-[var(--primary-foreground)]">
  <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,.06),transparent_60%)]" />

  <div className="container mx-auto max-w-6xl px-4 py-14 md:py-20 text-center">
    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
      Nossos Serviços
    </h1>

    <p className="mx-auto mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-[var(--primary-foreground)]/85">
      Escolha o serviço ideal para seu veículo. Todos executados com produtos
      profissionais e técnicas especializadas.
    </p>

    <Button className="mt-6 px-9 py-3 rounded-full" variant="accent">
      Agendar Agora
    </Button>
  </div>
</section>


      <section className="container mx-auto px-4 py-10">
        <ServicesSection
          variant="detailed"
          endpoint="http://localhost:3001/services"
          className="mt-12"
        />
      </section>
      <Footer />
    </main>
  );
}
