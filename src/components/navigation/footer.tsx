// src/components/Footer.tsx
import { FC } from "react";
import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer: FC = () => {
  return (
    <footer
      role="contentinfo"
      className="w-full bg-[var(--primary)] text-white"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Coluna 1 - Alpha Clean */}
          <div className="min-w-0">
            <h2 className="text-[var(--accent)] text-xl font-semibold">
              Alpha Clean
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              Lava jato profissional com mais de 10 anos de experiência,
              oferecendo serviços de qualidade para seu veículo.
            </p>

            <div className="flex items-center gap-4 mt-4 text-[var(--accent)]">
              <a
                href="https://www.instagram.com/alphacleanauto/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Alpha Clean"
                className="text-xl hover:opacity-90"
              >
                <Instagram aria-hidden="true" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Alpha Clean"
                className="text-xl hover:opacity-90"
              >
                <Facebook aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Nossos Serviços */}
          <nav aria-label="Nossos Serviços" className="min-w-0">
            <h2 className="text-base font-semibold">Nossos Serviços</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Lavagem Simples</li>
              <li>Lavagem Completa</li>
              <li>Limpeza Interna</li>
              <li>Enceramento</li>
              <li>Detalhamento</li>
            </ul>
          </nav>

          {/* Coluna 3 - Contato */}
          <div className="min-w-0">
            <h2 className="text-base font-semibold">Contato</h2>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="shrink-0 text-[var(--accent)]" />
                <address className="not-italic">
                  Rua das Palmeiras, 123
                  <br />
                  Centro - Cidade/UF
                </address>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0 text-[var(--accent)]" />
                <a href="tel:+551199998888" className="hover:underline">
                  (11) 9999-8888
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="shrink-0 text-[var(--accent)]" />
                <a
                  href="mailto:contato@alphaclean.com.br"
                  className="hover:underline break-all"
                >
                  contato@alphaclean.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Horário */}
          <div className="min-w-0">
            <h2 className="text-base font-semibold">
              Horário de Funcionamento
            </h2>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Clock className="shrink-0 text-[var(--accent)]" />
                <div>
                  <div>Segunda a Sexta</div>
                  <div className="opacity-90">08:00 - 18:00</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="shrink-0 text-[var(--accent)]" />
                <div>
                  <div>Sábados</div>
                  <div className="opacity-90">08:00 - 17:00</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="shrink-0 text-[var(--accent)]" />
                <div>
                  <div>Domingos</div>
                  <div className="opacity-90">08:00 - 12:00</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha final */}
        <div className="mt-8 pt-4 border-t border-[var(--accent)] text-center text-sm opacity-90">
          © 2025 Alpha Clean. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
