// src/utils/api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiPost<T = any>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        credentials: "include", // <- importante para receber/setar cookie httpOnly
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    // tenta ler json mesmo em erro:
    let data: any = null;
    try {
        data = await res.json();
    } catch {
        // ignore
    }

    if (!res.ok) {
        const msg = data?.error || data?.message || `Erro ${res.status}`;
        throw new Error(msg);
    }
    return data as T;
}
