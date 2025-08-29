// src/app/layout.tsx - LIMPO SEM PWA
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Alpha Clean - Sistema de Agendamentos",
    template: "%s | Alpha Clean",
  },
  description:
    "Sistema de agendamento para serviços de lavagem automotiva. Agende sua lavagem de forma rápida e prática.",
  keywords: [
    "lavagem automotiva",
    "agendamento",
    "lava jato",
    "Alpha Clean",
    "serviços automotivos",
  ],
  authors: [{ name: "Alpha Clean Team" }],
  creator: "Alpha Clean",
  publisher: "Alpha Clean",
  // ❌ REMOVER: manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    // ❌ REMOVER: apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://alphaclean.com.br",
    siteName: "Alpha Clean",
    title: "Alpha Clean - Sistema de Agendamentos",
    description:
      "Agende seus serviços de lavagem automotiva de forma prática e rápida.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alpha Clean - Sistema de Agendamentos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha Clean - Sistema de Agendamentos",
    description:
      "Agende seus serviços de lavagem automotiva de forma prática e rápida.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#9BD60C" },
    { media: "(prefers-color-scheme: dark)", color: "#022744" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        {/* ❌ REMOVER TODOS OS PWA Meta Tags */}
        {/* ❌ REMOVER: meta name="application-name" */}
        {/* ❌ REMOVER: meta name="apple-mobile-web-app-capable" */}
        {/* ❌ REMOVER: meta name="mobile-web-app-capable" */}
        {/* ❌ REMOVER: Apple Touch Icons */}
        {/* ❌ REMOVER: link rel="manifest" */}

        {/* Manter apenas ícones básicos */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          gutter={8}
          containerClassName="toast-container"
          containerStyle={{
            bottom: 24,
            right: 24,
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--card-bg)",
              color: "var(--foreground)",
              border: "1px solid var(--card-border)",
              borderRadius: "12px",
              padding: "12px 16px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              maxWidth: "400px",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "var(--accent)",
                secondary: "#fff",
              },
              style: {
                borderColor: "var(--accent)",
                background: "var(--card-bg)",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
              style: {
                borderColor: "#ef4444",
                background: "var(--card-bg)",
              },
            },
            loading: {
              iconTheme: {
                primary: "var(--primary)",
                secondary: "#fff",
              },
              style: {
                borderColor: "var(--primary)",
                background: "var(--card-bg)",
              },
            },
          }}
        />

        {/* ❌ REMOVER TODO O SCRIPT PWA */}
        {/* ❌ REMOVER: Service Worker Registration */}
        {/* ❌ REMOVER: PWA Install Prompt */}
      </body>
    </html>
  );
}
