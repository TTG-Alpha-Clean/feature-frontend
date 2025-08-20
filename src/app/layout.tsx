// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

// ✅ Fonte moderna para SaaS - Inter é clean e profissional
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
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Alpha Clean" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Alpha Clean" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#9BD60C" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple Touch Icons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
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
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#9BD60C" />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>

      <body
        className={`
        ${inter.className} 
        antialiased 
        bg-[var(--background)] 
        text-[var(--foreground)] 
        min-h-screen 
        selection:bg-[var(--accent)]/20 
        selection:text-[var(--accent)]
        overflow-x-hidden
      `}
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-white focus:rounded-lg focus:font-medium"
        >
          Pular para o conteúdo principal
        </a>

        {/* Main Application */}
        <div id="root" className="relative">
          <main id="main-content">{children}</main>
        </div>

        {/* ✅ Toast usando react-hot-toast diretamente */}
        <Toaster
          position="top-right"
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Estilo padrão para todos os toasts
            className: "",
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
            // Estilo para sucesso
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
            // Estilo para erro
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
            // Estilo para loading
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

        {/* PWA Install Prompt Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Service Worker Registration
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }

              // PWA Install Prompt
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                
                // Show custom install button if you have one
                const installButton = document.getElementById('pwa-install-button');
                if (installButton) {
                  installButton.style.display = 'block';
                  installButton.addEventListener('click', () => {
                    installButton.style.display = 'none';
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                      if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                      }
                      deferredPrompt = null;
                    });
                  });
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
