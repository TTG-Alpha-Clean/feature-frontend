import { NextRequest, NextResponse } from "next/server";

// públicas
const PUBLIC_PATHS = ["/home", "/login", "/register"];

// Lê qualquer indicador de sessão válida (token/access_token httpOnly no mesmo domínio
// ou cookie-espelho has_session = "1" setado pelo front após login)
function isLogged(req: NextRequest) {
    const token = req.cookies.get("token")?.value || req.cookies.get("access_token")?.value;
    const mirror = req.cookies.get("has_session")?.value === "1";
    return Boolean(token || mirror);
}

// Lê role de um cookie leve (espelho) setado após login
function getRole(req: NextRequest): "admin" | "user" | undefined {
    const role = req.cookies.get("role")?.value;
    return role === "admin" || role === "user" ? role : undefined;
}

export function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;
    const logged = isLogged(req);
    const role = getRole(req);

    // "/" -> "/home"
    if (pathname === "/") {
        const url = req.nextUrl.clone();
        url.pathname = "/home";
        return NextResponse.redirect(url);
    }

    const isPublic = PUBLIC_PATHS.includes(pathname);

    // Bloqueio geral de privadas sem login
    if (!logged && !isPublic) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("next", pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""));
        return NextResponse.redirect(url);
    }

    // Admin gate
    if (pathname.startsWith("/admin")) {
        if (role !== "admin") {
            const url = req.nextUrl.clone();
            url.pathname = logged ? "/cliente" : "/login";
            return NextResponse.redirect(url);
        }
    }

    // Se estiver logado, não deixa voltar para /login ou /register
    if (logged && (pathname === "/login" || pathname === "/register")) {
        const url = req.nextUrl.clone();
        url.pathname = role === "admin" ? "/admin" : "/cliente";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",          // redireciona para /home
        "/login",
        "/register",
        "/cliente/:path*",
        "/admin/:path*",
    ],
};
