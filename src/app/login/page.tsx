"use client";

import { signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, provider } from "../../../firebase.config";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/"); // redireciona após login
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) router.push("/"); // se já estiver logado, redireciona
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <Button onClick={handleGoogleLogin} disabled={loading}>
        {loading ? "Entrando..." : "Entrar com Google"}
      </Button>
    </div>
  );
}
