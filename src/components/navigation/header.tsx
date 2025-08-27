"use client";
import { Calendar, Menu, X } from "lucide-react";
import { CarLogo } from "../ui/carLogo";
import Link from "next/link";
import { useState } from "react";

type CurrentPage = "home" | "servicos";

interface HeaderProps {
  currentPage?: CurrentPage;
}

export default function Header({ currentPage = "home" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full h-20 bg-[var(--background)] border-b border-[var(--card-border)] fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center h-full px-4 sm:px-8 lg:px-48">
        {/* Logo */}
        <div className="flex gap-4 items-center">
          <CarLogo />
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--primary)]">
            Alpha Clean
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-10 items-center">
          <ul className="flex gap-8">
            <li className="relative">
              <Link
                href="/"
                className={`text-lg font-medium transition-all duration-300 hover:text-[var(--accent)] ${
                  currentPage === "home"
                    ? "text-[var(--accent)] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-[var(--accent)] after:rounded-full"
                    : "text-[var(--muted-foreground)] hover:after:content-[''] hover:after:absolute hover:after:bottom-[-4px] hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-[var(--accent)] hover:after:rounded-full"
                }`}
              >
                Home
              </Link>
            </li>
            <li className="relative">
              <Link
                href="/servicos"
                className={`text-lg font-medium transition-all duration-300 hover:text-[var(--accent)] ${
                  currentPage === "servicos"
                    ? "text-[var(--accent)] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-[var(--accent)] after:rounded-full"
                    : "text-[var(--muted-foreground)] hover:after:content-[''] hover:after:absolute hover:after:bottom-[-4px] hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-[var(--accent)] hover:after:rounded-full"
                }`}
              >
                Serviços
              </Link>
            </li>
          </ul>

          <button className="rounded-lg flex items-center justify-center gap-3 px-6 py-3 text-[var(--accent)] bg-[var(--background)] border-2 border-[var(--accent)] cursor-pointer hover:bg-[var(--accent)] hover:text-[var(--background)] transition-all duration-300 font-medium">
            <Calendar size={20} />
            <span>Reservar</span>
          </button>
        </nav>

        {/* Mobile - Botão Reservar + Menu Hamburguer */}
        <div className="flex md:hidden items-center gap-3">
          <button className="rounded-lg flex items-center justify-center gap-2 px-4 py-2 text-[var(--accent)] bg-[var(--background)] border-2 border-[var(--accent)] cursor-pointer hover:bg-[var(--accent)] hover:text-[var(--background)] transition-all duration-300 font-medium text-sm">
            <Calendar size={18} />
            <span>Reservar</span>
          </button>

          <button
            onClick={toggleMenu}
            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--background)] border-b border-[var(--card-border)] shadow-lg">
          <nav className="px-4 py-6">
            <ul className="flex flex-col gap-4">
              <li>
                <Link
                  href="/home"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-lg font-medium py-2 transition-all duration-300 hover:text-[var(--accent)] ${
                    currentPage === "home"
                      ? "text-[var(--accent)] border-l-4 border-[var(--accent)] pl-4"
                      : "text-[var(--muted-foreground)] pl-4"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/servicos"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-lg font-medium py-2 transition-all duration-300 hover:text-[var(--accent)] ${
                    currentPage === "servicos"
                      ? "text-[var(--accent)] border-l-4 border-[var(--accent)] pl-4"
                      : "text-[var(--muted-foreground)] pl-4"
                  }`}
                >
                  Serviços
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
