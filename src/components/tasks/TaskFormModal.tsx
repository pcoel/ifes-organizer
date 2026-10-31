'use client';

import React, { useState, useEffect } from 'react';
import { Tarefa, NovaTarefaInput, NovaTarefaInputSchema, PRIORIDADE_ROTULOS } from '@/domain/models/tarefa';
import { Disciplina } from '@/domain/models/disciplina';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tarefa: NovaTarefaInput) => void;
  initialData?: Tarefa | null;
  disciplinas: Disciplina[];
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  disciplinas,
}) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [prioridade, setPrioridade] = useState<'BAIXA' | 'MEDIA' | 'ALTA'>('MEDIA');
  const [disciplinaId, setDisciplinaId] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo);
      setDescricao(initialData.descricao || '');
      // Normaliza para o formato aceito por input type="datetime-local": YYYY-MM-DDTHH:mm
      setDataEntrega(initialData.dataEntrega.slice(0, 16));
      setPrioridade(initialData.prioridade);
      setDisciplinaId(initialData.disciplinaId || '');
    } else {
      // Define prazo padrão para amanhã às 23:59
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      const dataFormatada = `${amanha.toISOString().slice(0, 10)}T23:59`;

      setTitulo('');
      setDescricao('');
      setDataEntrega(dataFormatada);
      setPrioridade('MEDIA');
      setDisciplinaId('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: NovaTarefaInput = {
      titulo,
      descricao: descricao.trim(),
      dataEntrega,
      prioridade,
      disciplinaId: disciplinaId || null,
    };

    const validation = NovaTarefaInputSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSave(validation.data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Tarefa Acadêmica' : 'Nova Tarefa Acadêmica'}
      description="Preencha as informações da entrega ou compromisso do IFES Campus Serra."
      maxWidth="md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="task-form" variant="primary">
            {initialData ? 'Salvar Alterações' : 'Criar Tarefa'}
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Título da Tarefa"
          placeholder="Ex: Relatório de Física Experimental"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          error={errors.titulo}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Prazo e Horário de Entrega"
            type="datetime-local"
            value={dataEntrega}
            onChange={(e) => setDataEntrega(e.target.value)}
            error={errors.dataEntrega}
            required
          />

          <div>
            <label htmlFor="task-priority" className="block text-sm font-medium text-slate-700 mb-1">
              Prioridade
            </label>
            <select
              id="task-priority"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value as 'BAIXA' | 'MEDIA' | 'ALTA')}
              className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006633] focus:border-[#006633]"
            >
              <option value="BAIXA">{PRIORIDADE_ROTULOS.BAIXA}</option>
              <option value="MEDIA">{PRIORIDADE_ROTULOS.MEDIA}</option>
              <option value="ALTA">{PRIORIDADE_ROTULOS.ALTA}</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="task-discipline" className="block text-sm font-medium text-slate-700 mb-1">
            Disciplina Associada
          </label>
          <select
            id="task-discipline"
            value={disciplinaId}
            onChange={(e) => setDisciplinaId(e.target.value)}
            className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006633] focus:border-[#006633]"
          >
            <option value="">Nenhuma disciplina vinculada</option>
            {disciplinas.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nome} {d.professor ? `(${d.professor})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="task-description" className="block text-sm font-medium text-slate-700 mb-1">
            Descrição / Orientações (opcional)
          </label>
          <textarea
            id="task-description"
            rows={3}
            placeholder="Orientações de entrega, formato do arquivo, links ou requisitos do professor..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006633] focus:border-[#006633]"
          />
          {errors.descricao && <p className="text-xs text-red-600 mt-1">{errors.descricao}</p>}
        </div>
      </form>
    </Modal>
  );
};
