'use client';

import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { PrioridadeTarefa, PRIORIDADE_ROTULOS } from '@/domain/models/tarefa';
import { Disciplina } from '@/domain/models/disciplina';
import { CriterioOrdenacao } from '@/domain/services/task-service';

export interface TaskFiltersProps {
  status: 'todos' | 'pendentes' | 'concluidas';
  onStatusChange: (status: 'todos' | 'pendentes' | 'concluidas') => void;
  prioridade: 'TODAS' | PrioridadeTarefa;
  onPrioridadeChange: (prioridade: 'TODAS' | PrioridadeTarefa) => void;
  disciplinaId: string | 'TODAS' | 'SEM_DISCIPLINA';
  onDisciplinaChange: (disciplinaId: string | 'TODAS' | 'SEM_DISCIPLINA') => void;
  termoBusca: string;
  onTermoBuscaChange: (termo: string) => void;
  criterioOrdenacao: CriterioOrdenacao;
  onCriterioOrdenacaoChange: (criterio: CriterioOrdenacao) => void;
  disciplinas: Disciplina[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  status,
  onStatusChange,
  prioridade,
  onPrioridadeChange,
  disciplinaId,
  onDisciplinaChange,
  termoBusca,
  onTermoBuscaChange,
  criterioOrdenacao,
  onCriterioOrdenacaoChange,
  disciplinas,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
      {/* Linha 1: Abas de Status e Busca */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Status Selector */}
        <div
          className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium self-start sm:self-auto"
          role="tablist"
          aria-label="Filtro de status de tarefas"
        >
          <button
            type="button"
            role="tab"
            aria-selected={status === 'pendentes'}
            onClick={() => onStatusChange('pendentes')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              status === 'pendentes'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pendentes
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={status === 'todos'}
            onClick={() => onStatusChange('todos')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              status === 'todos'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={status === 'concluidas'}
            onClick={() => onStatusChange('concluidas')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              status === 'concluidas'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Concluídas
          </button>
        </div>

        {/* Campo de Busca */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={termoBusca}
            onChange={(e) => onTermoBuscaChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006633] focus:border-[#006633] placeholder-slate-400"
            aria-label="Buscar tarefas"
          />
        </div>
      </div>

      {/* Linha 2: Filtros secundários e ordenação */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">Filtrar:</span>
        </div>

        {/* Filtro Prioridade */}
        <select
          value={prioridade}
          onChange={(e) => onPrioridadeChange(e.target.value as 'TODAS' | PrioridadeTarefa)}
          className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#006633]"
          aria-label="Filtrar por prioridade"
        >
          <option value="TODAS">Prioridade: Todas</option>
          <option value="ALTA">{PRIORIDADE_ROTULOS.ALTA}</option>
          <option value="MEDIA">{PRIORIDADE_ROTULOS.MEDIA}</option>
          <option value="BAIXA">{PRIORIDADE_ROTULOS.BAIXA}</option>
        </select>

        {/* Filtro Disciplina */}
        <select
          value={disciplinaId}
          onChange={(e) => onDisciplinaChange(e.target.value)}
          className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#006633]"
          aria-label="Filtrar por disciplina"
        >
          <option value="TODAS">Disciplina: Todas</option>
          <option value="SEM_DISCIPLINA">Sem disciplina</option>
          {disciplinas.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nome}
            </option>
          ))}
        </select>

        {/* Ordenação */}
        <div className="ml-auto flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">Ordenar:</span>
          <select
            value={criterioOrdenacao}
            onChange={(e) => onCriterioOrdenacaoChange(e.target.value as CriterioOrdenacao)}
            className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#006633]"
            aria-label="Critério de ordenação"
          >
            <option value="prazo">Prazo (mais urgente)</option>
            <option value="prioridade">Prioridade (Alta primeiro)</option>
            <option value="titulo">Título (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
