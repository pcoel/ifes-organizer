'use client';

import React, { useState } from 'react';
import { HardDrive, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAgenda } from '@/context/useAgenda';
import { Container } from '@/components/layout/Container';
import { ExportCard } from '@/components/backup/ExportCard';
import { ImportCard } from '@/components/backup/ImportCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function BackupPage() {
  const { limparAgenda } = useAgenda();
  const [isModalLimpezaAberto, setIsModalLimpezaAberto] = useState(false);

  const handleConfirmarLimpeza = () => {
    limparAgenda();
    setIsModalLimpezaAberto(false);
  };

  return (
    <Container size="lg">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Backup &amp; Gerenciamento de Dados
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Exporte, restaure e mantenha o controle total das suas informações acadêmicas do IFES Campus Serra.
          </p>
        </div>

        {/* Informação de Privacidade Local-First */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-[#006633] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="font-semibold text-emerald-900 text-sm">Privacidade Total e Soberania dos Seus Dados</h2>
            <p>
              O AgendaIFES armazena todas as suas informações com segurança exclusiva no armazenamento local do seu
              próprio navegador (Local-First). Nenhum dado é transmitido para servidores remotos ou terceiros.
            </p>
            <p className="text-emerald-800">
              Para acessar sua agenda em outros computadores ou navegadores, basta exportar o arquivo de backup e importá-lo no outro aparelho.
            </p>
          </div>
        </div>

        {/* Grade de Exportação e Importação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExportCard />
          <ImportCard />
        </div>

        {/* Zona de Perigo / Limpeza Completa */}
        <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Limpar Todos os Dados Locais</h2>
                <p className="text-xs text-slate-500">
                  Exclui permanentemente todas as tarefas e disciplinas salvas no navegador atual.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setIsModalLimpezaAberto(true)}
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpar Agenda</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Limpeza */}
      <Modal
        isOpen={isModalLimpezaAberto}
        onClose={() => setIsModalLimpezaAberto(false)}
        title="Deseja realmente limpar toda a agenda?"
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalLimpezaAberto(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmarLimpeza}>
              Confirmar Limpeza Total
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm text-slate-700">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Aviso de exclusão permanente:</strong>
              Esta ação removerá todas as disciplinas, tarefas e configurações salvas no seu navegador.
              Recomendamos que você baixe um backup antes de prosseguir.
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Esta operação não pode ser desfeita. Tem certeza de que deseja continuar?
          </p>
        </div>
      </Modal>
    </Container>
  );
}
