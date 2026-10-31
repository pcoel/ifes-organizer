'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, BookOpen, HardDrive, AlertTriangle } from 'lucide-react';
import { useAgenda } from '@/context/useAgenda';
import { Container } from './Container';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { storageWarning } = useAgenda();

  const navLinks = [
    { href: '/', label: 'Tarefas', icon: Calendar },
    { href: '/disciplinas', label: 'Disciplinas', icon: BookOpen },
    { href: '/backup', label: 'Backup & Dados', icon: HardDrive },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      {storageWarning && (
        <div
          className="bg-amber-500 text-slate-900 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 text-center"
          role="alert"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-slate-900" />
          <span>{storageWarning.message}</span>
        </div>
      )}

      <Container size="lg">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006633] rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-lg bg-[#006633] flex items-center justify-center text-white font-bold shadow-sm">
              IF
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">
                AgendaIFES
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-800 block leading-none">
                Campus Serra
              </span>
            </div>
          </Link>

          <nav aria-label="Navegação Principal" className="flex items-center gap-1 sm:gap-2">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006633] ${
                    isActive
                      ? 'bg-emerald-50 text-[#006633]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </Container>
    </header>
  );
};
