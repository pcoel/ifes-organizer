'use client';

import React, { useState, useMemo } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle, CalendarDays } from 'lucide-react';
import { useAgenda } from '@/context/useAgenda';
import { Tarefa, NovaTarefaInput, PrioridadeTarefa } from '@/domain/models/tarefa';
import {
  calcularStatusVencimento,
  filtrarTarefas,
  ordenarTarefas,
  CriterioOrdenacao,
} from '@/domain/services/task-service';
import { obterDadosIniciaisExemplo } from '@/domain/services/seed-data';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskFormModal } from '@/components/tasks/TaskFormModal';
import { TaskFilters } from '@/components/tasks/TaskFilters';

export default function DashboardPage() {
  const {
    state,
    isLoading,
    adicionarTarefa,
    atualizarTarefa,
    alternarStatusTarefa,
    excluirTarefa,
    restaurarBackup,
  } = useAgenda();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Tarefa | null>(null);

  // Estados de filtros
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendentes' | 'concluidas'>('pendentes');
  const [prioridadeFilter, setPrioridadeFilter] = useState<'TODAS' | PrioridadeTarefa>('TODAS');
  const [disciplinaFilter, setDisciplinaFilter] = useState<string | 'TODAS' | 'SEM_DISCIPLINA'>('TODAS');
  const [termoBusca, setTermoBusca] = useState('');
  const [criterioOrdenacao, setCriterioOrdenacao] = useState<CriterioOrdenacao>('prazo');

  // Mapa de disciplinas para lookup instantâneo O(1)
  const mapaDisciplinas = useMemo(() => {
    const mapa = new Map(state.disciplinas.map((d) => [d.id, d]));
    return mapa;
  }, [state.disciplinas]);

  // Contadores de status gerais
  const metricas = useMemo(() => {
    let pendentes = 0;
    let urgentes = 0;
    let atrasadas = 0;
    let concluidas = 0;

    state.tarefas.forEach((t) => {
      if (t.status === 'CONCLUIDA') {
        concluidas++;
      } else {
        pendentes++;
        const statusVenc = calcularStatusVencimento(t.dataEntrega, t.status);
        if (statusVenc === 'VENCIDA') atrasadas++;
        else if (statusVenc === 'URGENTE') urgentes++;
      }
    });

    return { pendentes, urgentes, atrasadas, concluidas };
  }, [state.tarefas]);

  // Lista filtrada e ordenada
  const tarefasExibidas = useMemo(() => {
    const filtradas = filtrarTarefas(state.tarefas, {
      status: statusFilter,
      prioridade: prioridadeFilter,
      disciplinaId: disciplinaFilter,
      termoBusca,
    });
    return ordenarTarefas(filtradas, criterioOrdenacao);
  }, [state.tarefas, statusFilter, prioridadeFilter, disciplinaFilter, termoBusca, criterioOrdenacao]);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tarefa: Tarefa) => {
    setEditingTask(tarefa);
    setIsModalOpen(true);
  };

  const handleSaveTask = (dadosTarefa: NovaTarefaInput) => {
    if (editingTask) {
      atualizarTarefa({
        ...editingTask,
        ...dadosTarefa,
      });
    } else {
      adicionarTarefa(dadosTarefa);
    }
  };

  if (isLoading) {
    return (
      <Container size="lg">
        <div className="py-20 text-center text-slate-500">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-300 border-t-[#006633] rounded-full mb-3" />
          <p className="text-sm font-medium">Carregando sua agenda acadêmica...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <div className="space-y-6">
        {/* Cabeçalho de Boas-vindas e Ação Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Minha Agenda Acadêmica
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Acompanhe entregas, trabalhos e provas das suas disciplinas no IFES Campus Serra.
            </p>
          </div>

          <Button onClick={handleOpenCreateModal} variant="primary" size="md" className="shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </Button>
        </div>

        {/* Cartões de Métricas e Prazos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#006633] flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pendentes</p>
              <p className="text-xl font-bold text-slate-900">{metricas.pendentes}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Urgentes (&lt;24h)</p>
              <p className="text-xl font-bold text-amber-700">{metricas.urgentes}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Atrasadas</p>
              <p className="text-xl font-bold text-red-600">{metricas.atrasadas}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Concluídas</p>
              <p className="text-xl font-bold text-slate-900">{metricas.concluidas}</p>
            </div>
          </div>
        </div>

        {/* Barra de Filtros e Busca */}
        <TaskFilters
          status={statusFilter}
          onStatusChange={setStatusFilter}
          prioridade={prioridadeFilter}
          onPrioridadeChange={setPrioridadeFilter}
          disciplinaId={disciplinaFilter}
          onDisciplinaChange={setDisciplinaFilter}
          termoBusca={termoBusca}
          onTermoBuscaChange={setTermoBusca}
          criterioOrdenacao={criterioOrdenacao}
          onCriterioOrdenacaoChange={setCriterioOrdenacao}
          disciplinas={state.disciplinas}
        />

        {/* Lista de Tarefas */}
        {tarefasExibidas.length > 0 ? (
          <div className="space-y-3">
            {tarefasExibidas.map((tarefa) => (
              <TaskCard
                key={tarefa.id}
                tarefa={tarefa}
                disciplina={tarefa.disciplinaId ? mapaDisciplinas.get(tarefa.disciplinaId) : undefined}
                onToggleStatus={alternarStatusTarefa}
                onEdit={handleOpenEditModal}
                onDelete={excluirTarefa}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#006633] flex items-center justify-center mx-auto mb-3">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Nenhuma tarefa encontrada</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {termoBusca || prioridadeFilter !== 'TODAS' || disciplinaFilter !== 'TODAS'
                ? 'Nenhuma atividade corresponde aos filtros selecionados. Tente ajustar a busca.'
                : 'Você está em dia com todas as atividades! Clique em "+ Nova Tarefa" para registrar seu próximo trabalho.'}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Button onClick={handleOpenCreateModal} variant="primary" size="sm">
                <Plus className="w-4 h-4" />
                <span>Nova Tarefa</span>
              </Button>
              {state.tarefas.length === 0 && state.disciplinas.length === 0 && (
                <Button
                  onClick={() => {
                    const dados = obterDadosIniciaisExemplo();
                    restaurarBackup({
                      versao: 1,
                      disciplinas: dados.disciplinas,
                      tarefas: dados.tarefas,
                      configuracoes: state.configuracoes,
                    });
                  }}
                  variant="secondary"
                  size="sm"
                >
                  Carregar Exemplo
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTask}
        disciplinas={state.disciplinas}
      />
    </Container>
  );
}
