'use client';

import React, { useState } from 'react';
import { Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAgenda } from '@/context/useAgenda';
import { gerarPacoteBackup, gerarNomeArquivoBackup } from '@/domain/services/backup-service';
import { Button } from '@/components/ui/Button';

export const ExportCard: React.FC = () => {
  const { state } = useAgenda();
  const [downloadConcluido, setDownloadConcluido] = useState(false);

  const handleExport = () => {
    try {
      const pacote = gerarPacoteBackup(state.disciplinas, state.tarefas, state.configuracoes);
      const jsonString = JSON.stringify(pacote, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const nomeArquivo = gerarNomeArquivoBackup();

      const link = document.createElement('a');
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadConcluido(true);
      setTimeout(() => setDownloadConcluido(false), 4000);
    } catch {
      alert('Não foi possível gerar o arquivo de backup no momento.');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#006633] flex items-center justify-center shrink-0">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Exportar Cópia de Segurança</h2>
          <p className="text-xs text-slate-500">
            Baixe um arquivo JSON com todas as suas tarefas, matérias e prazos.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1">
        <div className="flex justify-between">
          <span>Disciplinas cadastradas:</span>
          <strong className="text-slate-900">{state.disciplinas.length}</strong>
        </div>
        <div className="flex justify-between">
          <span>Tarefas acadêmicas:</span>
          <strong className="text-slate-900">{state.tarefas.length}</strong>
        </div>
        <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5 text-[#006633]" />
          <span>Formato estruturado padrão AgendaIFES (esquema v1)</span>
        </div>
      </div>

      <div className="pt-2 flex items-center gap-3">
        <Button onClick={handleExport} variant="primary" size="md">
          <Download className="w-4 h-4" />
          <span>Baixar Backup (.json)</span>
        </Button>

        {downloadConcluido && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Arquivo baixado com sucesso!</span>
          </span>
        )}
      </div>
    </div>
  );
};
