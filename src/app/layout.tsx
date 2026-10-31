import type { Metadata } from 'next';
import './globals.css';
import { AgendaProvider } from '@/context/AgendaContext';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'AgendaIFES - Organização Acadêmica Campus Serra',
  description:
    'Sistema web local-first de organização acadêmica com tarefas, disciplinas e prazos para estudantes do IFES Campus Serra.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-[#006633] selection:text-white">
        <AgendaProvider>
          <Navbar />
          <main className="flex-1 py-6 sm:py-8">{children}</main>
          <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
            <p>
              AgendaIFES &bull; Desenvolvido para a comunidade acadêmica do <strong>IFES Campus Serra</strong>.
            </p>
            <p className="mt-1 text-slate-400">
              Operação 100% Local-First &bull; Seus dados permanecem apenas no seu navegador.
            </p>
          </footer>
        </AgendaProvider>
      </body>
    </html>
  );
}
