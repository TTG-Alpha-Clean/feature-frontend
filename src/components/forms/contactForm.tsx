"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Send, Loader } from "lucide-react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.mensagem) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsLoading(true);

    try {
      // Adicionar data e horário aos dados
      const emailData = {
        ...formData,
        data: new Date().toLocaleDateString("pt-BR"),
        horario: new Date().toLocaleTimeString("pt-BR"),
      };

      // Substitua pelos seus IDs do EmailJS
      await emailjs.send(
        "service_0bn4ntq", // Substitua pelo seu Service ID
        "template_bx3gxmo", // Substitua pelo seu Template ID
        emailData,
        "DK89XS2gPWHD024tL" // Substitua pela sua Public Key
      );

      toast.success(
        "Mensagem enviada com sucesso! Entraremos em contato em breve."
      );

      // Limpar formulário
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: "",
      });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast.error("Erro ao enviar mensagem. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-[var(--primary)] mb-8">
        Envie sua Mensagem
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Nome */}
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-semibold text-[var(--primary)] mb-2"
            >
              Nome Completo *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors"
              placeholder="Seu nome completo"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[var(--primary)] mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          {/* Telefone */}
          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-semibold text-[var(--primary)] mb-2"
            >
              Telefone
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors"
              placeholder="(11) 99999-9999"
            />
          </div>

          {/* Assunto */}
          <div>
            <label
              htmlFor="assunto"
              className="block text-sm font-semibold text-[var(--primary)] mb-2"
            >
              Assunto
            </label>
            <select
              id="assunto"
              name="assunto"
              value={formData.assunto}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors"
            >
              <option value="">Selecione um assunto</option>
              <option value="Agendamento">Agendamento de Serviço</option>
              <option value="Orçamento">Solicitação de Orçamento</option>
              <option value="Dúvidas">Dúvidas sobre Serviços</option>
              <option value="Reclamação">Reclamação</option>
              <option value="Sugestão">Sugestão</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
        </div>

        {/* Mensagem */}
        <div className="mb-6">
          <label
            htmlFor="mensagem"
            className="block text-sm font-semibold text-[var(--primary)] mb-2"
          >
            Mensagem *
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            value={formData.mensagem}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors resize-vertical"
            placeholder="Descreva sua solicitação ou dúvida..."
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-[var(--primary)] rounded-lg font-bold text-lg hover:bg-[var(--accent)]/90 focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Enviando...
              </>
            ) : (
              <>
                <Send size={20} />
                Enviar Mensagem
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
