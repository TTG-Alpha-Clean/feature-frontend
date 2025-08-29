import { Clock, Mail, Phone, Pin, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="max-w-6xl mx-auto mb-8">
      <div>
        <h3 className="text-xl font-bold text-[var(--primary)] mb-8">
          Nossos Dados
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Endereço */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--primary)]/90 rounded-full flex items-center justify-center">
                <Pin size={20} color="#9bd60c" />
              </div>
              <h4 className="font-semibold text-[var(--primary)]">Endereço</h4>
            </div>
            <div className="text-[var(--muted-foreground)] space-y-1">
              <p>Rua das Palmeiras, 123</p>
              <p>Centro - Caetité/BA</p>
              <p>CEP: 12.345-678</p>
            </div>
          </div>

          {/* Telefone */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--primary)]/90 rounded-full flex items-center justify-center">
                <Phone size={20} color="#9bd60c" />
              </div>
              <h4 className="font-semibold text-[var(--primary)]">Telefone</h4>
            </div>
            <div className="text-[var(--muted-foreground)] space-y-1">
              <p className="text-[var(--accent)] font-medium">(11) 1234-5678</p>
              <p className="text-sm">WhatsApp disponível</p>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[var(--primary)]/90 rounded-full flex items-center justify-center">
                <Mail size={18} color="#9bd60c" />
              </div>
              <h4 className="font-semibold text-[var(--primary)] text-sm">Email</h4>
            </div>
            <div className="text-[var(--muted-foreground)] text-sm break-words">
              <p>contato@alphaclean.com.br</p>
            </div>
        </div>



          {/* Horários */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--primary)]/90 rounded-full flex items-center justify-center">
                <Clock size={20} color="#9bd60c" />
              </div>
              <h4 className="font-semibold text-[var(--primary)]">Horários</h4>
            </div>
            <div className="text-[var(--muted-foreground)] space-y-1">
              <p>Segunda a Sexta: 08:00 - 18:00</p>
              <p>Sábado: 08:00 - 17:00</p>
              <p>Domingo: 08:00 - 12:00</p>
            </div>
          </div>

          {/* Localização - Card que ocupa 2 colunas */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--primary)]/90 rounded-full flex items-center justify-center">
                <MapPin size={20} color="#9bd60c" />
              </div>
              <h4 className="font-semibold text-[var(--primary)]">
                Nossa Localização
              </h4>
            </div>
            <div className="w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3897.123456789!2d-42.123456!3d-14.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDA3JzI0LjQiUyA0MsKwMDcnMjQuNCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Alpha Clean"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-[var(--muted-foreground)] text-sm mb-3">
                Encontre-nos facilmente em Abrantes
              </p>

              <a
                href="https://maps.google.com/?q=Rua+das+Palmeiras,+123+Centro+Caetité+BA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--primary)] rounded-lg font-medium hover:bg-[var(--accent)]/90 transition-colors"
              >
                <MapPin size={16} />
                Abrir no Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
