'use client';

import React, { useState } from 'react';
import { Calendar, Trash2, Edit3, Check } from 'lucide-react';
import { Tarefa, PRIORIDADE_ROTULOS } from '@/domain/models/tarefa';
import { Disciplina } from '@/domain/models/disciplina';
import { formatarDataPrazo } from '@/domain/services/task-service';
import { UrgencyBadge } from './UrgencyBadge';
import { Badge } from '@/components/ui/Badge';

export interface TaskCardProps {
  tarefa: Tarefa;
  disciplina?: Disciplina;
  onToggleStatus: (id: string) => void;
  onEdit: (tarefa: Tarefa) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  tarefa,
  disciplina,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const isConcluida = tarefa.status === 'CONCLUIDA';

  const prioridadeVariantes = {
    BAIXA: 'default' as const,
    MEDIA: 'info' as const,
    ALTA: 'danger' as const,
  };

  return (
    <article
      aria-label={`Tarefa: ${tarefa.titulo}`}
      className={`relative p-4 sm:p-5 rounded-xl border transition-all duration-200 bg-white ${
        isConcluida
          ? 'border-slate-200 bg-slate-50/70 opacity-75'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Caixa de alternância rápida de conclusão */}
        <button
          type="button"
          onClick={() => onToggleStatus(tarefa.id)}
          className={`mt-0.5 shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006633] ${
            isConcluida
              ? 'bg-[#006633] border-[#006633] text-white'
              : 'border-slate-300 hover:border-[#006633] bg-white text-transparent'
          }`}
          aria-label={
            isConcluida
              ? `Marcar "${tarefa.titulo}" como pendente`
              : `Marcar "${tarefa.titulo}" como concluída`
          }
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Conteúdo principal da tarefa */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-base font-semibold text-slate-900 break-words ${
                isConcluida ? 'line-through text-slate-500' : ''
              }`}
            >
              {tarefa.titulo}
            </h3>

            {/* Ações de Editar / Excluir */}
            <div className="flex items-center gap-1 shrink-0">
              {isConfirmingDelete ? (
                <div className="flex items-center gap-1 bg-red-50 p-1 rounded-md border border-red-200">
                  <span className="text-[11px] font-semibold text-red-700 px-1">Excluir?</span>
                  <button
                    type="button"
                    onClick={() => onDelete(tarefa.id)}
                    className="text-xs px-2 py-0.5 bg-red-600 text-white rounded font-medium hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
                    aria-label={`Confirmar exclusão de ${tarefa.titulo}`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    className="text-xs px-2 py-0.5 bg-white text-slate-600 border border-slate-300 rounded font-medium hover:bg-slate-100"
                    aria-label="Cancelar exclusão"
                  >
                    Não
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onEdit(tarefa)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006633]"
                    aria-label={`Editar tarefa ${tarefa.titulo}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
                    aria-label={`Excluir tarefa ${tarefa.titulo}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {tarefa.descricao && (
            <p
              className={`mt-1 text-sm text-slate-600 break-words whitespace-pre-line ${
                isConcluida ? 'text-slate-400' : ''
              }`}
            >
              {tarefa.descricao}
            </p>
          )}

          {/* Rodapé do card: Prazo, Prioridade, Disciplina, Urgência */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <UrgencyBadge dataEntrega={tarefa.dataEntrega} status={tarefa.status} />

            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatarDataPrazo(tarefa.dataEntrega)}</span>
            </div>

            <Badge variant={prioridadeVariantes[tarefa.prioridade]} size="sm">
              <span>{PRIORIDADE_ROTULOS[tarefa.prioridade]}</span>
            </Badge>

            {disciplina && (
              <Badge size="sm" customColor={disciplina.cor} className="font-medium">
                {disciplina.nome}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
