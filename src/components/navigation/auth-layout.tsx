// app/(auth)/auth-layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-white text-[#022744]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top bar */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-[#022744] hover:opacity-80"
        >
          <span className="text-lg">←</span>
          <span>Voltar ao site</span>
        </a>

        {/* Brand */}
        <div className="mt-6 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-12 rounded-md"
              style={{
                background: "linear-gradient(135deg,#9BD60C 0%,#c4ff57 100%)",
              }}
              aria-hidden
            />
            <div className="text-2xl font-semibold">Alpha Clean</div>
          </div>
          <p className="text-sm text-[#022744]/70 mt-1">
            Acesse sua área do cliente
          </p>
        </div>

        {/* Card container */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="rounded-2xl border border-[#022744]/10 bg-white shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
