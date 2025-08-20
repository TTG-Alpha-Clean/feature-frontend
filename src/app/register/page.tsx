"use client";

import AuthLayout from "@/components/navigation/auth-layout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toggle } from "../../components/ui/toggle";
import DeleteButton from "../../components/ui/deleteButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type PhoneInput = { ddd: string; numero: string; is_whatsapp?: boolean };

export default function RegisterPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const [ddd, setDDD] = useState("");
  const [numero, setNumero] = useState("");
  const [whats, setWhats] = useState(false);
  const [telefones, setTelefones] = useState<PhoneInput[]>([]);

  const [loading, setLoading] = useState(false);

  function addPhone() {
    if (!ddd || !numero) return toast.error("Informe DDD e número.");
    setTelefones((p) => [...p, { ddd, numero, is_whatsapp: whats }]);
    setDDD("");
    setNumero("");
    setWhats(false);
  }

  function removePhone(i: number) {
    setTelefones((p) => p.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (senha.length < 6)
      return toast.error("Senha deve ter pelo menos 6 caracteres.");
    if (senha !== confirm) return toast.error("As senhas não coincidem.");

    const tid = toast.loading("Cadastrando...");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, role, telefones }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Erro ao cadastrar.");

      toast.success("Conta criada! Faça login.", { id: tid });
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao cadastrar.", { id: tid });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <h1 className="text-center text-xl font-semibold">Criar Conta</h1>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          {/* Nome */}
          <div>
            <Label className="mb-1 block">Nome</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="h-10 border-[#022744]/15 focus:ring-2 focus:ring-[#9BD60C]"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label className="mb-1 block">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 border-[#022744]/15 focus:ring-2 focus:ring-[#9BD60C]"
              required
            />
          </div>

          {/* Senhas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1 block">Senha</Label>
              <Input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="h-10 border-[#022744]/15 focus:ring-2 focus:ring-[#9BD60C]"
                required
                minLength={6}
              />
            </div>
            <div>
              <Label className="mb-1 block">Confirmar senha</Label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="h-10 border-[#022744]/15 focus:ring-2 focus:ring-[#9BD60C]"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Telefones */}
          <div className="space-y-3">
            <Label className="block">Telefones (opcional)</Label>

            {/* DDD menor + Número ocupa o resto */}
            <div className="grid w-full grid-cols-[90px_1fr] gap-4">
              <div>
                <Label className="mb-1 block text-xs">DDD</Label>
                <Input
                  value={ddd}
                  onChange={(e) => setDDD(e.target.value)}
                  placeholder="71"
                  className="h-10 border-[#022744]/15 focus:ring-2 focus:ring-[#9BD60C]"
                />
              </div>
              <div className="min-w-0">
                <Label className="mb-1 block text-xs">Número</Label>
                <Input
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="99660-1709"
                  className="h-10 border-[#022744]/15 focus:ring-2 focus:ring-[#9BD60C]"
                />
              </div>
            </div>

            {/* Toggle WhatsApp */}

            <div className="grid grid-cols-2">
              <Toggle checked={whats} onChange={setWhats} label="WhatsApp" />
              <button
                type="button"
                onClick={addPhone}
                className="h-10 px-4 rounded-lg bg-[#022744] text-white hover:opacity-90"
              >
                Adicionar
              </button>
            </div>

            {telefones.length > 0 && (
              <ul className="mt-1 space-y-2">
                {telefones.map((t, i) => (
                  <li
                    key={`${t.ddd}-${t.numero}-${i}`}
                    className="flex items-center justify-between rounded-lg border border-[#022744]/10 bg-[#022744]/[0.03] px-3 py-2"
                  >
                    <span className="text-sm">
                      ({t.ddd}) {t.numero} {t.is_whatsapp ? "- WhatsApp" : ""}
                    </span>
                    <DeleteButton onClick={() => removePhone(i)} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Botões */}
          <div className="mt-2 flex gap-3">
            <a
              href="/login"
              className="h-10 flex-1 grid place-items-center rounded-lg border border-[#022744]/15 hover:bg-[#022744]/[0.03]"
            >
              Já tenho conta
            </a>
            <button
              type="submit"
              disabled={loading}
              className="h-10 flex-1 rounded-lg bg-[#9BD60C] text-[#022744] font-medium hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
