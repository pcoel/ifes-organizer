'use client';

import React, { useState, useEffect } from 'react';
import {
  Disciplina,
  NovaDisciplinaInput,
  NovaDisciplinaInputSchema,
} from '@/domain/models/disciplina';
import {
  CORES_DISCIPLINA_PADRAO,
  validarNomeDisciplinaUnico,
} from '@/domain/services/discipline-service';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface DisciplineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (disciplina: NovaDisciplinaInput) => void;
  initialData?: Disciplina | null;
  disciplinasExistentes: Disciplina[];
}

export const DisciplineModal: React.FC<DisciplineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  disciplinasExistentes,
}) => {
  const [nome, setNome] = useState('');
  const [professor, setProfessor] = useState('');
  const [sala, setSala] = useState('');
  const [cor, setCor] = useState(CORES_DISCIPLINA_PADRAO[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome);
      setProfessor(initialData.professor || '');
      setSala(initialData.sala || '');
      setCor(initialData.cor);
    } else {
      setNome('');
      setProfessor('');
      setSala('');
      // Escolhe cor não usada ou a primeira
      const coresUsadas = new Set(disciplinasExistentes.map((d) => d.cor));
      const corLivre =
        CORES_DISCIPLINA_PADRAO.find((c) => !coresUsadas.has(c)) ||
        CORES_DISCIPLINA_PADRAO[0];
      setCor(corLivre);
    }
    setErrors({});
  }, [initialData, isOpen, disciplinasExistentes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: NovaDisciplinaInput = {
      nome: nome.trim(),
      professor: professor.trim(),
      sala: sala.trim(),
      cor,
    };

    const validation = NovaDisciplinaInputSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Validação de unicidade de nome
    const isUnico = validarNomeDisciplinaUnico(
      payload.nome,
      disciplinasExistentes,
      initialData?.id
    );

    if (!isUnico) {
      setErrors({ nome: 'Já existe uma disciplina cadastrada com este nome.' });
      return;
    }

    onSave(validation.data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Disciplina' : 'Nova Disciplina'}
      description="Cadastre as matérias do semestre no IFES Campus Serra para organizar suas tarefas."
      maxWidth="md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="discipline-form" variant="primary">
            {initialData ? 'Salvar Alterações' : 'Cadastrar Disciplina'}
          </Button>
        </>
      }
    >
      <form id="discipline-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome da Disciplina"
          placeholder="Ex: Programação Web"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          error={errors.nome}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Professor Responsável (opcional)"
            placeholder="Ex: Prof. Roberto"
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
            error={errors.professor}
          />

          <Input
            label="Sala ou Laboratório (opcional)"
            placeholder="Ex: Lab 3 - Bloco B"
            value={sala}
            onChange={(e) => setSala(e.target.value)}
            error={errors.sala}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cor Identificadora
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {CORES_DISCIPLINA_PADRAO.map((corOpcao) => {
              const isSelected = cor === corOpcao;
              return (
                <button
                  key={corOpcao}
                  type="button"
                  onClick={() => setCor(corOpcao)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 ${
                    isSelected ? 'scale-110 border-slate-900 shadow-md ring-2 ring-white ring-inset' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: corOpcao }}
                  aria-label={`Selecionar cor ${corOpcao}`}
                  aria-pressed={isSelected}
                />
              );
            })}
          </div>
          {errors.cor && <p className="text-xs text-red-600 mt-1">{errors.cor}</p>}
        </div>
      </form>
    </Modal>
  );
};
