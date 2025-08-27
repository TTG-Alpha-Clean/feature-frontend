// src/app/admin/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administração | Alpha Clean",
  description: "Painel administrativo do Alpha Clean",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
