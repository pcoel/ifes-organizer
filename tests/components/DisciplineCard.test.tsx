import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DisciplineCard } from '@/components/disciplines/DisciplineCard';
import { Disciplina } from '@/domain/models/disciplina';

describe('DisciplineCard Component', () => {
  const disciplinaMock: Disciplina = {
    id: 'disc-50',
    nome: 'Sistemas Operacionais',
    professor: 'Prof. Marcos',
    sala: 'Sala 101',
    cor: '#006633',
    criadoEm: '2026-10-31T10:00:00.000Z',
    atualizadoEm: '2026-10-31T10:00:00.000Z',
  };

  it('renderiza os dados da matéria e contagem de tarefas', () => {
    render(
      <DisciplineCard
        disciplina={disciplinaMock}
        tarefasVinculadasCount={3}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Sistemas Operacionais')).toBeInTheDocument();
    expect(screen.getByText('Prof. Marcos')).toBeInTheDocument();
    expect(screen.getByText('Sala 101')).toBeInTheDocument();
    expect(screen.getByText('3 tarefas associadas')).toBeInTheDocument();
  });

  it('exibe confirmação antes de excluir a disciplina', () => {
    const handleDelete = vi.fn();
    render(
      <DisciplineCard
        disciplina={disciplinaMock}
        tarefasVinculadasCount={2}
        onEdit={vi.fn()}
        onDelete={handleDelete}
      />
    );

    const deleteBtn = screen.getByLabelText(/Excluir disciplina/i);
    fireEvent.click(deleteBtn);

    expect(screen.getByText('Excluir?')).toBeInTheDocument();
    expect(handleDelete).not.toHaveBeenCalled();

    const confirmBtn = screen.getByLabelText(/Confirmar exclusão/i);
    fireEvent.click(confirmBtn);
    expect(handleDelete).toHaveBeenCalledWith('disc-50');
  });
});
