"use client";

import AuthLayout from "@/components/navigation/auth-layout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type LoginResponse = {
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
    role: "user" | "admin";
    active: boolean;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tid = toast.loading("Entrando...");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data: any = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Erro ao entrar.");

      toast.success("Bem-vindo!", { id: tid });
      const role = (data as LoginResponse).user.role;
      router.push(role === "admin" ? "/admin" : "/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao entrar.", { id: tid });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <h1 className="text-center text-xl font-semibold">Fazer Login</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label className="mb-1 block">Email</Label>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 border-[#022744]/15 focus:ring-2 focus:ring-[#9BD60C]"
              required
            />
          </div>

          <div>
            <Label className="mb-1 block">Senha</Label>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="h-10 border-[#022744]/15 focus:ring-2 focus:ring-[#9BD60C]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-[#022744] text-white font-medium hover:opacity-90 disabled:opacity-60 transition-colors"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="/register" className="text-[#9BD60C] hover:underline">
            Não tem conta? Cadastre-se
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
