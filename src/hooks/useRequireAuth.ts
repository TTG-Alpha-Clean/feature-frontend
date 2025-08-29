// src/hooks/useRequireAuth.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useRequireAuth() {
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
                    { credentials: "include" }
                );
                if (!res.ok) throw new Error("unauthorized");
                // você pode setar algum estado global com os dados do usuário aqui, se quiser
            } catch {
                if (!cancelled) router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
            }
        })();
        return () => { cancelled = true; };
    }, [router]);
}
