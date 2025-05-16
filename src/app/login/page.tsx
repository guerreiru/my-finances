"use client";

import { Button } from "@/components/ui/button";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, provider } from "../../../firebase.config";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Seção de informações */}
        <div className="p-4 md:p-8 bg-indigo-100 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-indigo-900 mb-4">
            Bem-vindo ao minhas finanças
          </h1>
          <p className="text-indigo-800 mb-6">
            Organize seus gastos, visualize gráficos por categoria e acompanhe
            sua evolução financeira. Tudo simples, direto no navegador.
          </p>
          <ul className="list-disc pl-5 text-indigo-800 mb-6">
            <li>Cadastro automático com sua conta Google</li>
            <li>Lançamento de despesas com parcelas</li>
            <li>Gráficos mensais por categoria</li>
            <li>Sincronização com o navegador e nuvem</li>
          </ul>
          <p className="text-sm text-indigo-700">
            Sem complicação. Sua privacidade é prioridade.
          </p>
        </div>

        {/* Seção de login */}
        <div className="p-4 md:p-8 flex flex-col justify-center items-center bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Acesse sua conta
          </h2>

          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full max-w-xs flex gap-2 items-center justify-center"
            variant="outline"
          >
            <FcGoogle className="text-xl" />
            {loading ? "Entrando..." : "Entrar com Google"}
          </Button>
        </div>
      </div>
    </div>
  );
}
