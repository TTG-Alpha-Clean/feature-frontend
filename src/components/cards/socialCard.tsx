// SocialCard corrigido
import { Share2, Instagram, MessageCircle, Facebook } from "lucide-react";

export default function SocialCard() {
  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-4xl mt-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[var(--primary)]/90 rounded-full flex items-center justify-center">
            <Share2 size={20} color="#9bd60c" />
          </div>
          <h4 className="font-semibold text-[var(--primary)]">
            Conecte-se Conosco
          </h4>
        </div>

        <div className="space-y-3">
          <a
            href="https://wa.me/5511123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <MessageCircle size={20} color="#25D366" />
            <div>
              <p className="font-medium text-[var(--primary)] text-sm">
                WhatsApp
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Atendimento rápido
              </p>
            </div>
          </a>

          <a
            href="https://instagram.com/alphaclean"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <Instagram size={20} color="#E4405F" />
            <div>
              <p className="font-medium text-[var(--primary)] text-sm">
                Instagram
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                @alphaclean
              </p>
            </div>
          </a>

          <a
            href="https://facebook.com/alphaclean"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <Facebook size={20} color="#1877F2" />
            <div>
              <p className="font-medium text-[var(--primary)] text-sm">
                Facebook
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Alpha Clean
              </p>
            </div>
          </a>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg max-w-4xl mb-20">
        <p className="text-xs text-[var(--muted-foreground)] text-center">
          Siga-nos para dicas de cuidados automotivos e promoções especiais!
        </p>
      </div>
    </div>
  );
}
