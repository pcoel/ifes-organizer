'use client';

import React, { useState, useRef } from 'react';
import { Upload, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { useAgenda } from '@/context/useAgenda';
import { validarPacoteBackup } from '@/domain/services/backup-service';
import { PacoteBackup } from '@/domain/models/backup';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatarDataPrazo } from '@/domain/services/task-service';
import { CONFIGURACOES_PADRAO } from '@/domain/models/configuracao';

export const ImportCard: React.FC = () => {
  const { restaurarBackup } = useAgenda();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [arquivoCarregado, setArquivoCarregado] = useState<PacoteBackup | null>(null);
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [isModalConfirmacaoAberto, setIsModalConfirmacaoAberto] = useState(false);
  const [sucessoMensagem, setSucessoMensagem] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErroValidacao(null);
    setSucessoMensagem(false);

    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setErroValidacao('Selecione um arquivo com extensão .json válido.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const conteudo = event.target?.result as string;
      const validacao = validarPacoteBackup(conteudo);

      if (!validacao.sucesso) {
        setErroValidacao(validacao.erro);
        setArquivoCarregado(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setArquivoCarregado(validacao.dados);
      setIsModalConfirmacaoAberto(true);
    };

    reader.onerror = () => {
      setErroValidacao('Erro de leitura ao tentar abrir o arquivo selecionado.');
    };

    reader.readAsText(file);
  };

  const handleConfirmarRestauracao = () => {
    if (!arquivoCarregado) return;

    restaurarBackup({
      versao: arquivoCarregado.versaoSchema,
      disciplinas: arquivoCarregado.dados.disciplinas,
      tarefas: arquivoCarregado.dados.tarefas,
      configuracoes: arquivoCarregado.dados.configuracoes || CONFIGURACOES_PADRAO,
    });

    setIsModalConfirmacaoAberto(false);
    setArquivoCarregado(null);
    setSucessoMensagem(true);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setTimeout(() => setSucessoMensagem(false), 5000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Restaurar Backup</h2>
          <p className="text-xs text-slate-500">
            Importe um arquivo JSON salvo anteriormente para restaurar sua agenda.
          </p>
        </div>
      </div>

      <div className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-lg p-5 text-center bg-slate-50/50 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
          id="backup-file-input"
        />
        <label
          htmlFor="backup-file-input"
          className="cursor-pointer inline-flex flex-col items-center gap-2 focus-within:outline focus-within:outline-2 focus-within:outline-[#006633] rounded-lg p-2"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-600">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#006633] hover:underline">
              Clique para selecionar o arquivo de backup
            </span>
            <p className="text-xs text-slate-500 mt-0.5">Apenas arquivos .json compatíveis com o AgendaIFES</p>
          </div>
        </label>
      </div>

      {erroValidacao && (
        <div
          className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-800 animate-fadeIn"
          role="alert"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Falha na validação do backup:</strong>
            <p>{erroValidacao}</p>
            <p className="mt-1 text-[11px] text-red-700 font-medium">
              Seus dados locais foram protegidos e permanecem inalterados.
            </p>
          </div>
        </div>
      )}

      {sucessoMensagem && (
        <div
          className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fadeIn"
          role="status"
        >
          <CheckCircle2 className="w-4 h-4 text-[#006633] shrink-0" />
          <span>Backup restaurado com sucesso! Seus dados foram atualizados.</span>
        </div>
      )}

      {/* Modal de Confirmação de Sobrescrita */}
      <Modal
        isOpen={isModalConfirmacaoAberto}
        onClose={() => {
          setIsModalConfirmacaoAberto(false);
          setArquivoCarregado(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        title="Confirmar Restauração de Dados"
        maxWidth="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalConfirmacaoAberto(false);
                setArquivoCarregado(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmarRestauracao}>
              Confirmar e Substituir
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-sm text-slate-700">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Atenção: Ação irreversível</strong>
              A restauração substituirá todos os registros atuais da sua agenda pelo conteúdo deste
              arquivo de backup.
            </div>
          </div>

          {arquivoCarregado && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Data de geração do backup:</span>
                <strong className="text-slate-900">
                  {formatarDataPrazo(arquivoCarregado.geradoEm)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Disciplinas a restaurar:</span>
                <strong className="text-slate-900">
                  {arquivoCarregado.dados.disciplinas.length}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tarefas a restaurar:</span>
                <strong className="text-slate-900">
                  {arquivoCarregado.dados.tarefas.length}
                </strong>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500">
            Deseja prosseguir com a substituição dos dados atuais da sua agenda?
          </p>
        </div>
      </Modal>
    </div>
  );
};
