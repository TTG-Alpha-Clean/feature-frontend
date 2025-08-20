// src/components/Footer.tsx
import { FC } from "react";
import {
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

const Footer: FC = () => {
  return (
    <footer className="bg-[var(--brand-blue)] text-[var(--brand-white)] py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Coluna 1 - Alpha Clean */}
        <div>
          <h2 className="text-[var(--brand-green)] text-lg font-semibold">
            Alpha Clean
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            Alpha Clean - Estética Automotiva. Sua criação foi motivada pela paixão por carros e 
            sempre tivemos um objetivo claro: Oferecer um serviço de estética automotiva diferenciado, 
            com qualidade e cuidado em cada detalhe. Aqui tratamos cada veículo como único, valorizando 
            sua beleza e desempenho.
          </p>
          <div className="flex gap-3 mt-4 text-[var(--brand-green)] text-xl">
            <a href="https://www.instagram.com/alphacleanauto/" target="_blank" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Coluna 2 - Nossos Serviços */}
        <div>
          <h2 className="font-semibold">Nossos Serviços</h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Lavagem</li>
            <li>Polimento</li>
            <li>Vitrificação</li>
            <li>Enceramento</li>
            <li>Higienização</li>
          </ul>
        </div>

        {/* Coluna 3 - Contato */}
        <div>
          <h2 className="font-semibold">Contato</h2>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="flex items-start gap-2 text-[var(--brand-green)]">
              <FaMapMarkerAlt />
              <address className="not-italic text-[var(--brand-white)]">
                Rod. BA 099 Estrada do Côco, S/N, Posto BR - Loja 02
                <br />
                Abrantes - Camaçari - BA, 42.822-394
              </address>
            </li>
            <li className="flex items-center gap-2 text-[var(--brand-green)]">
              <FaPhoneAlt />
              <a
                href="tel:‪+55 71 98358-4393‬"
                className="text-[var(--brand-white)] hover:underline"
              >
                (71) 98358-439
              </a>
            </li>
            <li className="flex items-center gap-2 text-[var(--brand-green)]">
              <FaEnvelope />
              <a
                href="mailto:contato@alphaclean.com.br"
                className="text-[var(--brand-white)] hover:underline"
              >
                contato@alphaclean.com.br
              </a>
            </li>
          </ul>
        </div>

        {/* Coluna 4 - Horário */}
        <div>
          <h2 className="font-semibold">Horário de Funcionamento</h2>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="flex items-center gap-2 text-[var(--brand-green)]">
              <FaClock />
              <span className="text-[var(--brand-white)]">
                Segunda a Sábado
                <br />
                08:00 - 18:00
              </span>
            </li>
            <li className="flex items-center gap-2 text-[var(--brand-green)]">
              <FaClock />
              <span className="text-[var(--brand-white)]">
                Domingos
                <br />
                08:00 - 12:00
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Linha final */}
      <div className="border-t border-[var(--brand-green)] mt-8 pt-4 text-center text-sm text-gray-300">
        © 2024 Alpha Clean. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;