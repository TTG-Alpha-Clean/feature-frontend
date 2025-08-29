import ServiceBanner from "../components/cards/serviceBanner";
import SocialCard from "../components/cards/socialCard";
import ContactForm from "../components/forms/contactForm";
import Footer from "../components/navigation/footer";
import Header from "../components/navigation/header";
import AboutSection from "../components/sections/aboutSection";
import ContactSection from "../components/sections/contactSection";
import HeroSection from "../components/sections/heroSection";
import ServicesSection from "@/components/sections/servicesSection";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      <Header />
      <HeroSection />
      <div className="flex flex-col w-full justify-center items-center text-center pt-16">
        <h1 className="text-[var(--primary)] text-4xl font-semibold mb-4">
          Sobre a Alpha Clean
        </h1>
        <p className="text-lg text-[var(--primary)] max-w-3xl">
          Mais do que um serviço, proporcionamos uma experiência: o cuidado de quem realmente entende e ama carros.
        </p>
      </div>

      <AboutSection />

      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold text-[var(--primary)] mb-4">
          Nossos Serviços
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto">
          Oferecemos uma gama completa de serviços para manter seu veículo sempre impecável. Escolha o serviço que melhor atende suas necessidades.
        </p>
         <section className="container mx-auto px-4 py-10">
        <ServicesSection
          variant="compact"
          endpoint="http://localhost:3001/services"
          className="mt-12"
        />
      </section>
      </div>

      <ServiceBanner />
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold text-[var(--primary)] mb-4">
          Entre em Contato
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto">
          Estamos prontos pra atender você! Entre em contato conosco para
          agendar seu serviço ou esclarecer qualquer dúvida.
        </p>
      </div>

      <div className="w-full max-w-[95%] mx-auto px-4 sm:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Coluna esquerda */}
          <div>
            <ContactSection />
          </div>

          {/* Coluna direita */}
          <div className="">
            <ContactForm />
            <SocialCard />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
