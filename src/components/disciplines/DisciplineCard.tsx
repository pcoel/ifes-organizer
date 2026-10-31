'use client';

import React, { useState } from 'react';
import { User, MapPin, Edit3, Trash2, BookOpen } from 'lucide-react';
import { Disciplina } from '@/domain/models/disciplina';

export interface DisciplineCardProps {
  disciplina: Disciplina;
  tarefasVinculadasCount: number;
  onEdit: (disciplina: Disciplina) => void;
  onDelete: (id: string) => void;
}

export const DisciplineCard: React.FC<DisciplineCardProps> = ({
  disciplina,
  tarefasVinculadasCount,
  onEdit,
  onDelete,
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
      style={{ borderTopWidth: '4px', borderTopColor: disciplina.cor }}
      role="article"
      aria-label={`Disciplina: ${disciplina.nome}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0"
              style={{ backgroundColor: disciplina.cor }}
              aria-hidden="true"
            />
            <h3 className="text-base font-bold text-slate-900 break-words">{disciplina.nome}</h3>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isConfirmingDelete ? (
              <div className="flex items-center gap-1 bg-red-50 p-1 rounded-md border border-red-200">
                <span className="text-[11px] font-semibold text-red-700 px-1">Excluir?</span>
                <button
                  type="button"
                  onClick={() => onDelete(disciplina.id)}
                  className="text-xs px-2 py-0.5 bg-red-600 text-white rounded font-medium hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
                  aria-label={`Confirmar exclusão de ${disciplina.nome}`}
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
                  onClick={() => onEdit(disciplina)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006633]"
                  aria-label={`Editar disciplina ${disciplina.nome}`}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
                  aria-label={`Excluir disciplina ${disciplina.nome}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-1.5 text-xs text-slate-600">
          {disciplina.professor ? (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{disciplina.professor}</span>
            </div>
          ) : (
            <p className="text-slate-400 italic">Professor não informado</p>
          )}

          {disciplina.sala && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{disciplina.sala}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {tarefasVinculadasCount === 1
              ? '1 tarefa associada'
              : `${tarefasVinculadasCount} tarefas associadas`}
          </span>
        </div>
      </div>
    </div>
  );
};
