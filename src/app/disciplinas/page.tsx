'use client';

import React, { useState, useMemo } from 'react';
import { Plus, BookOpen, AlertCircle } from 'lucide-react';
import { useAgenda } from '@/context/useAgenda';
import { Disciplina, NovaDisciplinaInput } from '@/domain/models/disciplina';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { DisciplineCard } from '@/components/disciplines/DisciplineCard';
import { DisciplineModal } from '@/components/disciplines/DisciplineModal';

export default function DisciplinasPage() {
  const {
    state,
    isLoading,
    adicionarDisciplina,
    atualizarDisciplina,
    excluirDisciplina,
  } = useAgenda();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<Disciplina | null>(null);

  // Mapeia quantidade de tarefas atreladas a cada disciplina
  const contagemTarefasPorDisciplina = useMemo(() => {
    const mapa = new Map<string, number>();
    state.tarefas.forEach((t) => {
      if (t.disciplinaId) {
        mapa.set(t.disciplinaId, (mapa.get(t.disciplinaId) || 0) + 1);
      }
    });
    return mapa;
  }, [state.tarefas]);

  const handleOpenCreateModal = () => {
    setEditingDiscipline(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (disciplina: Disciplina) => {
    setEditingDiscipline(disciplina);
    setIsModalOpen(true);
  };

  const handleSaveDiscipline = (dados: NovaDisciplinaInput) => {
    if (editingDiscipline) {
      atualizarDisciplina({
        ...editingDiscipline,
        ...dados,
      });
    } else {
      adicionarDisciplina(dados);
    }
  };

  if (isLoading) {
    return (
      <Container size="lg">
        <div className="py-20 text-center text-slate-500">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-300 border-t-[#006633] rounded-full mb-3" />
          <p className="text-sm font-medium">Carregando disciplinas...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Disciplinas do Semestre
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Organize suas matérias do IFES Campus Serra para vincular e filtrar suas tarefas.
            </p>
          </div>

          <Button onClick={handleOpenCreateModal} variant="primary" size="md" className="shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Nova Disciplina</span>
          </Button>
        </div>

        {/* Alerta de Desassociação Suave */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-emerald-900">
          <AlertCircle className="w-4 h-4 text-[#006633] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Política de Preservação de Dados:</span> Caso você
            exclua uma disciplina, suas tarefas associadas <strong>não serão deletadas</strong>;
            elas permanecerão salvas com segurança na sua agenda, apenas sem a matéria vinculada.
          </div>
        </div>

        {/* Grade de Disciplinas */}
        {state.disciplinas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.disciplinas.map((disciplina) => (
              <DisciplineCard
                key={disciplina.id}
                disciplina={disciplina}
                tarefasVinculadasCount={contagemTarefasPorDisciplina.get(disciplina.id) || 0}
                onEdit={handleOpenEditModal}
                onDelete={excluirDisciplina}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#006633] flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Nenhuma disciplina cadastrada</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Cadastre suas matérias para que suas tarefas fiquem organizadas por professor, sala e cores visuais.
            </p>
            <div className="mt-5">
              <Button onClick={handleOpenCreateModal} variant="primary" size="sm">
                <Plus className="w-4 h-4" />
                <span>Nova Disciplina</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição */}
      <DisciplineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDiscipline}
        initialData={editingDiscipline}
        disciplinasExistentes={state.disciplinas}
      />
    </Container>
  );
}
